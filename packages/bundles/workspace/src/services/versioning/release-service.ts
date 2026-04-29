import {
	type GeneratedReleaseManifest,
	type GeneratedReleaseManifestEntry,
	GeneratedReleaseManifestSchema,
	type ReleaseCapsule,
	type ReleaseCapsulePackage,
	type VersionBumpType,
} from '@contractspec/lib.contracts-spec';
import {
	ContractsrcSchema,
	DEFAULT_CONTRACTSRC,
} from '@contractspec/lib.contracts-spec/workspace-config/contractsrc-schema';
import { findWorkspaceRoot } from '../../adapters/workspace';
import type { FsAdapter } from '../../ports/fs';
import type { GitAdapter, GitChangedFile } from '../../ports/git';
import type { LoggerAdapter } from '../../ports/logger';
import { detectImpact } from '../impact';
import {
	discoverWorkspacePackages,
	formatReleaseCapsuleReadIssues,
	matchChangedFilesToPackages,
	readChangesets,
	readReleaseCapsulesDetailed,
	renderChangesetMarkdown,
	renderReleaseCapsuleYaml,
} from './release-files';
import {
	renderCustomerGuide,
	renderPatchNotes,
	renderUpgradePrompt,
} from './release-formatters';
import { createUpgradePlan } from './release-plan';
import type {
	ReleaseBuildOptions,
	ReleaseBuildResult,
	ReleaseBuildScope,
	ReleaseCheckOptions,
	ReleaseCheckResult,
	ReleaseCheckStatus,
	ReleaseInitOptions,
	ReleaseInitResult,
} from './release-service.types';
import {
	analyzeVersions,
	analyzeVersionsFromCommits,
} from './versioning-service';

interface ServiceAdapters {
	fs: FsAdapter;
	git: GitAdapter;
	logger: LoggerAdapter;
}

const DEFAULT_OUTPUT_DIR = 'generated/releases';
const RELEASE_ARTIFACTS_GENERATED_AT = '1970-01-01T00:00:00.000Z';
const DEFAULT_RELEASE_CONFIG = DEFAULT_CONTRACTSRC.release ?? {
	enforceOn: 'release-branch',
	requireChangesetForPublished: true,
	requireReleaseCapsule: true,
	publishArtifacts: [],
	agentTargets: ['codex'],
};

export async function initReleaseArtifacts(
	adapters: ServiceAdapters,
	options: ReleaseInitOptions = {}
): Promise<ReleaseInitResult> {
	const { fs, git, logger } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const workspacePackages = await discoverWorkspacePackages(fs, workspaceRoot);
	const changedFiles = options.baseline
		? await git.diffFiles(options.baseline)
		: [];
	const packageNames =
		options.packages && options.packages.length > 0
			? options.packages
			: matchChangedFilesToPackages(changedFiles, workspacePackages);
	const commitAnalysis = options.baseline
		? await analyzeVersionsFromCommits(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			})
		: null;
	const impact = options.baseline
		? await detectImpact(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			})
		: null;

	const inferredReleaseType =
		(impact?.summary.breaking ?? 0) > 0
			? 'major'
			: (commitAnalysis?.suggestedBumpType ?? inferReleaseType(packageNames));
	const releaseType = options.releaseType ?? inferredReleaseType;
	const summary =
		options.summary ??
		`Describe the ${releaseType} release for ${packageNames[0] ?? 'the workspace'}`;
	const slug = options.slug ?? slugify(summary);
	const packages: ReleaseCapsulePackage[] = packageNames.map((name) => ({
		name,
		releaseType,
		version: workspacePackages.find((pkg) => pkg.name === name)?.version,
	}));
	const capsule: ReleaseCapsule = {
		schemaVersion: '1',
		slug,
		summary,
		isBreaking: releaseType === 'major' || (impact?.summary.breaking ?? 0) > 0,
		packages,
		affectedRuntimes: [],
		affectedFrameworks: [],
		audiences: [
			{ kind: 'maintainer', summary },
			{ kind: 'customer', summary },
		],
		deprecations: [],
		migrationInstructions: [],
		upgradeSteps: [],
		validation: {
			commands: [
				'contractspec impact --baseline main --format markdown',
				'contractspec version analyze --baseline main',
			],
			evidence: [],
		},
	};

	const changesetPath = fs.join(workspaceRoot, '.changeset', `${slug}.md`);
	const capsulePath = fs.join(
		workspaceRoot,
		'.changeset',
		`${slug}.release.yaml`
	);

	if (!options.force) {
		if (await fs.exists(changesetPath)) {
			throw new Error(`Changeset already exists: ${changesetPath}`);
		}
		if (await fs.exists(capsulePath)) {
			throw new Error(`Release capsule already exists: ${capsulePath}`);
		}
	}

	const changesetContent = renderChangesetMarkdown(summary, packages);
	const capsuleContent = renderReleaseCapsuleYaml(capsule);

	if (!options.dryRun) {
		await fs.writeFile(changesetPath, changesetContent);
		await fs.writeFile(capsulePath, capsuleContent);
	}

	logger.info('Initialized release artifacts', { slug, workspaceRoot });

	return {
		slug,
		changesetPath,
		capsulePath,
		changesetContent,
		capsuleContent,
		packages,
		releaseType,
		isBreaking: capsule.isBreaking,
	};
}

export async function buildReleaseArtifacts(
	adapters: ServiceAdapters,
	options: ReleaseBuildOptions = {}
): Promise<ReleaseBuildResult> {
	const { fs, logger } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const config = await readWorkspaceReleaseConfig(fs, workspaceRoot);
	const outputDir = fs.join(
		workspaceRoot,
		options.outputDir ?? DEFAULT_OUTPUT_DIR
	);
	const manifestPath = fs.join(outputDir, 'manifest.json');
	const existingManifest = await readExistingManifest(fs, manifestPath);
	const changesets = await readChangesets(fs, workspaceRoot);
	const selectedSlugs = await selectReleaseSlugs(adapters, {
		workspaceRoot,
		changesets,
		scope: options.scope ?? 'current',
		baseline: options.baseline,
	});
	const capsuleResult = await readReleaseCapsulesDetailed(
		fs,
		workspaceRoot,
		changesets,
		selectedSlugs
	);
	if (capsuleResult.issues.length > 0) {
		throw new Error(formatReleaseCapsuleReadIssues(capsuleResult.issues));
	}
	const capsules = capsuleResult.capsules;
	const workspacePackages = await discoverWorkspacePackages(fs, workspaceRoot);
	const existingEntries = new Map(
		(existingManifest?.releases ?? []).map((entry) => [entry.slug, entry])
	);
	const preferCurrentVersions = (options.scope ?? 'current') !== 'all';

	const releases = Array.from(capsules.entries()).map(
		([slug, capsule]): GeneratedReleaseManifestEntry => {
			const existingEntry = existingEntries.get(slug);
			const packages = capsule.packages.map((pkg) => ({
				...pkg,
				version: resolvePackageVersion(
					pkg,
					workspacePackages,
					existingEntry,
					preferCurrentVersions
				),
			}));
			return {
				slug,
				version: resolveReleaseVersion(
					capsule,
					workspacePackages,
					existingEntry,
					preferCurrentVersions
				),
				summary: capsule.summary,
				date: existingEntry?.date ?? currentDate(),
				isBreaking: capsule.isBreaking,
				packages,
				affectedRuntimes: [...capsule.affectedRuntimes],
				affectedFrameworks: [...capsule.affectedFrameworks],
				audiences: [...capsule.audiences],
				deprecations: [...capsule.deprecations],
				migrationInstructions: [...capsule.migrationInstructions],
				upgradeSteps: [...capsule.upgradeSteps],
				validation: capsule.validation,
			};
		}
	);

	const manifest = GeneratedReleaseManifestSchema.parse({
		generatedAt: resolveGeneratedAt(releases),
		releases,
	}) as GeneratedReleaseManifest;
	const agentTargets = options.agentTargets ?? config.agentTargets ?? ['codex'];
	const upgradePlan = createUpgradePlan(
		manifest,
		[],
		agentTargets,
		renderUpgradePrompt
	);
	const upgradeManifestPath = fs.join(outputDir, 'upgrade-manifest.json');
	const patchNotesPath = fs.join(outputDir, 'patch-notes.md');
	const customerGuidePath = fs.join(outputDir, 'customer-guide.md');
	const promptPaths = Object.fromEntries(
		upgradePlan.agentPrompts.map((prompt) => [
			prompt.agent,
			fs.join(outputDir, 'prompts', `${prompt.agent}.md`),
		])
	);

	if (!options.dryRun) {
		await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
		await fs.writeFile(upgradeManifestPath, JSON.stringify(manifest, null, 2));
		await fs.writeFile(patchNotesPath, renderPatchNotes(manifest));
		await fs.writeFile(customerGuidePath, renderCustomerGuide(manifest));

		for (const prompt of upgradePlan.agentPrompts) {
			await fs.writeFile(promptPaths[prompt.agent] ?? '', prompt.prompt);
		}
	}

	logger.info('Built release artifacts', {
		outputDir,
		releasesBuilt: manifest.releases.length,
	});

	return {
		outputDir,
		manifestPath,
		upgradeManifestPath,
		patchNotesPath,
		customerGuidePath,
		promptPaths,
		manifest,
		upgradePlan,
		releasesBuilt: manifest.releases.length,
	};
}

export async function checkReleaseArtifacts(
	adapters: ServiceAdapters,
	options: ReleaseCheckOptions = {}
): Promise<ReleaseCheckResult> {
	const { fs } = adapters;
	const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
	const config = await readWorkspaceReleaseConfig(fs, workspaceRoot);
	const outputDir = fs.join(
		workspaceRoot,
		options.outputDir ?? DEFAULT_OUTPUT_DIR
	);
	const checks: ReleaseCheckStatus[] = [];
	const warnings: string[] = [];
	const errors: string[] = [];
	const changesets = await readChangesets(fs, workspaceRoot);
	const selectedSlugs = await selectReleaseSlugs(adapters, {
		workspaceRoot,
		changesets,
		scope: options.scope ?? 'current',
		baseline: options.baseline,
	});
	const capsuleResult = await readReleaseCapsulesDetailed(
		fs,
		workspaceRoot,
		changesets,
		selectedSlugs
	);
	const capsules = capsuleResult.capsules;
	const hasPendingChangesets = changesets.length > 0;
	const hasPostVersionCapsules = !hasPendingChangesets && capsules.size > 0;

	errors.push(
		...capsuleResult.issues.map((issue) =>
			formatReleaseCapsuleReadIssues([issue])
		)
	);

	recordCheck(
		checks,
		hasPendingChangesets || hasPostVersionCapsules,
		'changesets',
		hasPendingChangesets
			? `Found ${changesets.length} release changeset(s).`
			: hasPostVersionCapsules
				? 'No pending release changesets found; release capsules are present.'
				: 'No release changesets found.'
	);

	for (const changeset of changesets) {
		if (!capsules.has(changeset.slug) && config.requireReleaseCapsule) {
			errors.push(`Missing release capsule for changeset ${changeset.slug}.`);
		}
	}

	for (const [slug, capsule] of capsules) {
		if (capsule.isBreaking && capsule.migrationInstructions.length === 0) {
			errors.push(
				`Breaking release ${slug} is missing migration instructions.`
			);
		}
		if (capsule.validation.commands.length === 0) {
			errors.push(`Release capsule ${slug} is missing validation commands.`);
		}
		if (capsule.validation.evidence.length === 0) {
			errors.push(`Release capsule ${slug} is missing validation evidence.`);
		}
	}

	if (options.baseline) {
		try {
			const impact = await detectImpact(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			});
			recordCheck(checks, true, 'impact', `Impact status: ${impact.status}`);
			if (
				impact.summary.breaking > 0 &&
				!Array.from(capsules.values()).some((capsule) => capsule.isBreaking)
			) {
				errors.push(
					'Breaking impact detected without a breaking release capsule.'
				);
			}
		} catch (error) {
			recordCheck(checks, false, 'impact', failureMessage(error));
			errors.push(`Impact detection failed: ${failureMessage(error)}`);
		}

		try {
			const analysis = await analyzeVersions(adapters, {
				baseline: options.baseline,
				workspaceRoot,
			});
			recordCheck(
				checks,
				true,
				'versioning',
				`${analysis.specsNeedingBump} spec(s) need version review.`
			);
		} catch (error) {
			recordCheck(checks, false, 'versioning', failureMessage(error));
			errors.push(`Version analysis failed: ${failureMessage(error)}`);
		}
	}

	if (options.strict) {
		for (const artifact of config.publishArtifacts ?? []) {
			const artifactPath = fs.join(outputDir, artifact);
			if (!(await fs.exists(artifactPath))) {
				errors.push(`Missing generated release artifact: ${artifactPath}`);
			}
		}
	}

	recordCheck(
		checks,
		errors.length === 0,
		'capsules',
		errors.length === 0
			? 'All release capsules are complete.'
			: (errors[0] ?? '')
	);

	if (!hasPendingChangesets && !hasPostVersionCapsules) {
		warnings.push('No pending release changesets were found.');
	}

	return {
		success: errors.length === 0,
		errors,
		warnings,
		checks,
	};
}

async function readWorkspaceReleaseConfig(
	fs: FsAdapter,
	workspaceRoot: string
): Promise<typeof DEFAULT_RELEASE_CONFIG> {
	const configPath = fs.join(workspaceRoot, '.contractsrc.json');
	if (!(await fs.exists(configPath))) {
		return DEFAULT_RELEASE_CONFIG;
	}

	try {
		const parsed = JSON.parse(await fs.readFile(configPath));
		const validated = ContractsrcSchema.safeParse(parsed);
		return validated.success
			? {
					...DEFAULT_RELEASE_CONFIG,
					...validated.data.release,
				}
			: DEFAULT_RELEASE_CONFIG;
	} catch {
		return DEFAULT_RELEASE_CONFIG;
	}
}

async function selectReleaseSlugs(
	adapters: ServiceAdapters,
	options: {
		workspaceRoot: string;
		changesets: Awaited<ReturnType<typeof readChangesets>>;
		scope: ReleaseBuildScope;
		baseline?: string;
	}
): Promise<Set<string> | undefined> {
	if (options.scope === 'all') {
		return undefined;
	}

	if (options.changesets.length > 0) {
		return new Set(options.changesets.map((changeset) => changeset.slug));
	}

	const changedFiles = await changedReleaseFiles(
		adapters.git,
		options.baseline
	);
	const slugs = new Set<string>();
	for (const file of changedFiles) {
		const slug = slugFromChangesetPath(file.path);
		if (!slug) {
			continue;
		}
		if (file.path.endsWith('.release.yaml') || file.path.endsWith('.md')) {
			slugs.add(slug);
		}
	}

	return slugs.size > 0 ? slugs : undefined;
}

async function changedReleaseFiles(
	git: GitAdapter,
	baseline?: string
): Promise<GitChangedFile[]> {
	if (baseline && baseline !== 'HEAD' && git.diffNameStatus) {
		return git.diffNameStatus(baseline, ['.changeset']);
	}
	if (git.statusFiles) {
		return git.statusFiles(['.changeset']);
	}
	if (baseline) {
		const files = await git.diffFiles(baseline, ['.changeset']);
		return files.map((path) => ({ status: 'M', path }));
	}
	return [];
}

function slugFromChangesetPath(filePath: string): string | undefined {
	const normalized = filePath.replace(/\\/g, '/');
	const fileName = normalized.split('/').pop();
	if (!fileName || fileName === 'README.md') {
		return undefined;
	}
	if (fileName.endsWith('.release.yaml')) {
		return fileName.replace(/\.release\.yaml$/, '');
	}
	if (fileName.endsWith('.md')) {
		return fileName.replace(/\.md$/, '');
	}
	return undefined;
}

async function readExistingManifest(
	fs: FsAdapter,
	manifestPath: string
): Promise<GeneratedReleaseManifest | undefined> {
	if (!(await fs.exists(manifestPath))) {
		return undefined;
	}
	try {
		return GeneratedReleaseManifestSchema.parse(
			JSON.parse(await fs.readFile(manifestPath))
		) as GeneratedReleaseManifest;
	} catch {
		return undefined;
	}
}

function inferReleaseType(packageNames: string[]): VersionBumpType {
	return packageNames.length > 0 ? 'minor' : 'patch';
}

function resolveReleaseVersion(
	capsule: ReleaseCapsule,
	workspacePackages: Array<{ name: string; version: string }>,
	existingEntry: GeneratedReleaseManifestEntry | undefined,
	preferCurrentVersions: boolean
): string {
	const version = capsule.packages
		.map((pkg) =>
			resolvePackageVersion(
				pkg,
				workspacePackages,
				existingEntry,
				preferCurrentVersions
			)
		)
		.find((value): value is string => typeof value === 'string');

	return version ?? '0.0.0';
}

function resolvePackageVersion(
	pkg: ReleaseCapsulePackage,
	workspacePackages: Array<{ name: string; version: string }>,
	existingEntry: GeneratedReleaseManifestEntry | undefined,
	preferCurrentVersions: boolean
): string | undefined {
	const currentVersion = workspacePackages.find(
		(candidate) => candidate.name === pkg.name
	)?.version;
	const existingVersion = existingEntry?.packages.find(
		(candidate) => candidate.name === pkg.name
	)?.version;

	return preferCurrentVersions
		? (currentVersion ?? pkg.version ?? existingVersion)
		: (pkg.version ?? existingVersion ?? currentVersion);
}

function resolveGeneratedAt(releases: GeneratedReleaseManifestEntry[]): string {
	const dates = releases
		.map((release) => release.date)
		.filter(Boolean)
		.sort();
	const latestDate = dates.at(-1);
	return latestDate
		? `${latestDate}T00:00:00.000Z`
		: RELEASE_ARTIFACTS_GENERATED_AT;
}

function currentDate(): string {
	return new Date().toISOString().split('T')[0] ?? '1970-01-01';
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 48);
}

function recordCheck(
	checks: ReleaseCheckStatus[],
	ok: boolean,
	name: string,
	message: string
): void {
	checks.push({ name, ok, message });
}

function failureMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
