import type {
	ReleaseCapsule,
	ReleaseCapsulePackage,
	VersionBumpType,
} from '@contractspec/lib.contracts-spec';
import { ReleaseCapsuleSchema } from '@contractspec/lib.contracts-spec';
import { dump, load } from 'js-yaml';
import type { FsAdapter } from '../../ports/fs';
import type { ReleaseCapsuleReadIssue } from './release-service.types';

const CHANGESET_PATTERN = '.changeset/*.md';
const RELEASE_CAPSULE_PATTERN = '.changeset/*.release.yaml';
const CHANGESET_FRONTMATTER = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
const CHANGESET_RELEASE_LINE =
	/^["']?([^"':]+(?:\/[^"':]+)?)["']?\s*:\s*(major|minor|patch|none)\s*$/;

export interface WorkspacePackageInfo {
	name: string;
	dir: string;
	version: string;
}

export interface ParsedChangesetFile {
	slug: string;
	summary: string;
	packages: ReleaseCapsulePackage[];
}

export interface ReadReleaseCapsulesResult {
	capsules: Map<string, ReleaseCapsule>;
	issues: ReleaseCapsuleReadIssue[];
}

export async function listChangesetFiles(
	fs: FsAdapter,
	workspaceRoot: string
): Promise<string[]> {
	const files = await fs.glob({
		pattern: CHANGESET_PATTERN,
		cwd: workspaceRoot,
		absolute: true,
	});

	return files.filter((file) => fs.basename(file) !== 'README.md');
}

export async function readChangesets(
	fs: FsAdapter,
	workspaceRoot: string
): Promise<ParsedChangesetFile[]> {
	const files = await listChangesetFiles(fs, workspaceRoot);
	const changesets: ParsedChangesetFile[] = [];

	for (const filePath of files) {
		const content = await fs.readFile(filePath);
		changesets.push(parseChangesetContent(fs.basename(filePath), content));
	}

	return changesets;
}

export async function readReleaseCapsules(
	fs: FsAdapter,
	workspaceRoot: string,
	changesets: ParsedChangesetFile[]
): Promise<Map<string, ReleaseCapsule>> {
	const result = await readReleaseCapsulesDetailed(
		fs,
		workspaceRoot,
		changesets
	);
	if (result.issues.length > 0) {
		throw new Error(formatReleaseCapsuleReadIssues(result.issues));
	}

	return result.capsules;
}

export async function readReleaseCapsulesDetailed(
	fs: FsAdapter,
	workspaceRoot: string,
	changesets: ParsedChangesetFile[],
	selectedSlugs?: Set<string>
): Promise<ReadReleaseCapsulesResult> {
	const files = await fs.glob({
		pattern: RELEASE_CAPSULE_PATTERN,
		cwd: workspaceRoot,
		absolute: true,
	});
	const fallbackPackages = new Map(
		changesets.map((changeset) => [changeset.slug, changeset.packages])
	);
	const capsules = new Map<string, ReleaseCapsule>();
	const issues: ReleaseCapsuleReadIssue[] = [];

	for (const filePath of files) {
		const slug = fs.basename(filePath).replace(/\.release\.yaml$/, '');
		if (selectedSlugs && !selectedSlugs.has(slug)) {
			continue;
		}
		try {
			const parsed = load(await fs.readFile(filePath));
			const capsule = normalizeCapsule(
				parsed,
				slug,
				fallbackPackages.get(slug) ?? []
			);
			capsules.set(slug, capsule);
		} catch (error) {
			issues.push(createReleaseCapsuleReadIssue(filePath, slug, error));
		}
	}

	return { capsules, issues };
}

export async function discoverWorkspacePackages(
	fs: FsAdapter,
	workspaceRoot: string
): Promise<WorkspacePackageInfo[]> {
	const packageJsonFiles = await fs.glob({
		patterns: ['package.json', 'packages/*/*/package.json'],
		cwd: workspaceRoot,
		absolute: true,
	});
	const packages: WorkspacePackageInfo[] = [];

	for (const filePath of packageJsonFiles) {
		const manifest = JSON.parse(await fs.readFile(filePath)) as {
			name?: string;
			version?: string;
			private?: boolean;
		};
		if (!manifest.name || !manifest.version || manifest.private === true) {
			continue;
		}

		const dir = fs.relative(workspaceRoot, fs.dirname(filePath)) || '.';
		packages.push({ name: manifest.name, dir, version: manifest.version });
	}

	return packages.sort((left, right) => left.dir.localeCompare(right.dir));
}

export function matchChangedFilesToPackages(
	changedFiles: string[],
	packages: WorkspacePackageInfo[]
): string[] {
	const names = new Set<string>();

	for (const changedFile of changedFiles) {
		const match = packages.find((pkg) =>
			pkg.dir === '.'
				? !changedFile.startsWith('packages/')
				: changedFile === pkg.dir || changedFile.startsWith(`${pkg.dir}/`)
		);
		if (match) {
			names.add(match.name);
		}
	}

	return Array.from(names).sort((left, right) => left.localeCompare(right));
}

export function renderChangesetMarkdown(
	summary: string,
	packages: ReleaseCapsulePackage[]
): string {
	const header = packages
		.map((pkg) => `"${pkg.name}": ${pkg.releaseType}`)
		.join('\n');

	return `---\n${header}\n---\n\n${summary}\n`;
}

export function renderReleaseCapsuleYaml(capsule: ReleaseCapsule): string {
	return dump(ReleaseCapsuleSchema.parse(capsule), {
		noRefs: true,
		lineWidth: 100,
	});
}

export function formatReleaseCapsuleReadIssues(
	issues: ReleaseCapsuleReadIssue[]
): string {
	return issues
		.map((issue) => {
			const position =
				issue.line && issue.column
					? `:${issue.line}:${issue.column}`
					: issue.line
						? `:${issue.line}`
						: '';
			const suggestion = issue.suggestion ? ` ${issue.suggestion}` : '';
			return `${issue.filePath}${position} ${issue.message}.${suggestion}`.trim();
		})
		.join('\n');
}

function parseChangesetContent(
	fileName: string,
	content: string
): ParsedChangesetFile {
	const slug = fileName.replace(/\.md$/, '');
	const match = content.match(CHANGESET_FRONTMATTER);

	if (!match) {
		return { slug, summary: content.trim(), packages: [] };
	}

	const header = match[1] ?? '';
	const summary = (match[2] ?? '').trim();
	const packages: ReleaseCapsulePackage[] = [];

	for (const line of header.split('\n')) {
		const parsed = line.trim().match(CHANGESET_RELEASE_LINE);
		if (!parsed) {
			continue;
		}

		const packageName = parsed[1];
		const releaseType = parsed[2] as VersionBumpType | 'none';
		if (!packageName || releaseType === 'none') {
			continue;
		}

		packages.push({ name: packageName, releaseType });
	}

	return { slug, summary, packages };
}

function normalizeCapsule(
	value: unknown,
	slug: string,
	fallbackPackages: ReleaseCapsulePackage[]
): ReleaseCapsule {
	const record = (
		typeof value === 'object' && value !== null
			? (value as Record<string, unknown>)
			: {}
	) as Record<string, unknown>;
	const legacyPackageNames = Array.isArray(record['packageNames'])
		? record['packageNames']
				.filter((entry): entry is string => typeof entry === 'string')
				.map((name) => ({
					name,
					releaseType:
						(record['releaseType'] as VersionBumpType | undefined) ?? 'patch',
				}))
		: [];

	return ReleaseCapsuleSchema.parse({
		...record,
		slug,
		packages:
			Array.isArray(record['packages']) && record['packages'].length > 0
				? record['packages']
				: legacyPackageNames.length > 0
					? legacyPackageNames
					: fallbackPackages,
	});
}

function createReleaseCapsuleReadIssue(
	filePath: string,
	slug: string,
	error: unknown
): ReleaseCapsuleReadIssue {
	const record =
		typeof error === 'object' && error !== null
			? (error as {
					message?: string;
					reason?: string;
					issues?: Array<{ message?: string }>;
					mark?: { line?: number; column?: number };
				})
			: null;
	const zodIssues = Array.isArray(record?.issues)
		? record.issues
				.map((issue) => issue.message)
				.filter((message): message is string => typeof message === 'string')
		: [];
	const message =
		zodIssues.length > 0
			? `Release capsule validation failed: ${zodIssues.join('; ')}`
			: typeof record?.reason === 'string'
				? `Release capsule YAML parse failed: ${record.reason}`
				: `Release capsule parse failed: ${
						error instanceof Error ? error.message : String(error)
					}`;

	return {
		slug,
		filePath,
		message,
		line:
			typeof record?.mark?.line === 'number' ? record.mark.line + 1 : undefined,
		column:
			typeof record?.mark?.column === 'number'
				? record.mark.column + 1
				: undefined,
		suggestion: `Re-run \`contractspec release edit ${slug}\` to rewrite the capsule safely.`,
	};
}
