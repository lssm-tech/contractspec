import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec/workspace-config';
import {
	scanAllSpecsFromSource,
	scanSpecSource,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';
import {
	getCanonicalDeclarationRelativePath,
	getIndexExportPath,
	inferWorkspacePackageKind,
	normalizePath,
} from './helpers';
import {
	type PackageDeclarationAuditOptions,
	type PackageDeclarationAuditResult,
	resolvePackageDeclarationConfig,
	type WorkspacePackageInfo,
	type WorkspacePackageKind,
} from './types';

const DEFAULT_MANIFEST_PATTERNS = [
	'packages/libs/*/package.json',
	'packages/modules/*/package.json',
	'packages/integrations/*/package.json',
	'packages/bundles/*/package.json',
	'packages/apps/*/package.json',
	'packages/apps-registry/*/package.json',
	'packages/examples/*/package.json',
];

export async function discoverWorkspacePackages(
	fs: FsAdapter,
	options: PackageDeclarationAuditOptions = {}
): Promise<WorkspacePackageInfo[]> {
	const workspaceRoot = normalizePath(options.workspaceRoot ?? process.cwd());
	const manifestPatterns = await getWorkspaceManifestPatterns(
		fs,
		workspaceRoot,
		options.config
	);
	const manifests = await fs.glob({
		cwd: workspaceRoot,
		patterns: manifestPatterns,
		absolute: false,
		ignore: ['**/node_modules/**', '**/dist/**', '**/.turbo/**'],
	});
	const declarationConfig = resolvePackageDeclarationConfig(options.config);
	const packages: WorkspacePackageInfo[] = [];

	for (const manifestPath of manifests) {
		const relativePackageRoot = normalizePath(fs.dirname(manifestPath));
		const kind = inferWorkspacePackageKind(relativePackageRoot);
		if (!kind) continue;

		const packageJson = await readPackageManifest(
			fs,
			fs.join(workspaceRoot, manifestPath)
		);
		const packageDirName = fs.basename(relativePackageRoot);
		const packageRoot = fs.join(workspaceRoot, relativePackageRoot);
		const target =
			declarationConfig.requiredByKind?.[getRequiredByKindKey(kind)];
		if (!target) continue;

		const canonicalDeclarationRelativePath =
			getCanonicalDeclarationRelativePath(kind, packageDirName);

		packages.push({
			workspaceRoot,
			relativePackageRoot,
			packageRoot,
			packageName:
				typeof packageJson.name === 'string'
					? packageJson.name
					: relativePackageRoot,
			packageDirName,
			description:
				typeof packageJson.description === 'string'
					? packageJson.description
					: undefined,
			kind,
			target,
			canonicalDeclarationRelativePath,
			canonicalDeclarationPath: fs.join(
				packageRoot,
				canonicalDeclarationRelativePath
			),
			indexPath: fs.join(packageRoot, 'src/index.ts'),
			indexExportPath: getIndexExportPath(kind, packageDirName),
		});
	}

	return packages.sort((left, right) =>
		left.relativePackageRoot.localeCompare(right.relativePackageRoot)
	);
}

export async function auditPackageDeclarations(
	fs: FsAdapter,
	options: PackageDeclarationAuditOptions = {}
): Promise<PackageDeclarationAuditResult[]> {
	const packages = await discoverWorkspacePackages(fs, options);
	const results: PackageDeclarationAuditResult[] = [];

	for (const pkg of packages) {
		const exists = await fs.exists(pkg.canonicalDeclarationPath);
		let detectedSpecType: string | undefined;
		let matchesExpectedTarget = false;

		if (exists) {
			const content = await fs.readFile(pkg.canonicalDeclarationPath);
			const specs = scanAllSpecsFromSource(
				content,
				pkg.canonicalDeclarationPath
			);
			const discovered =
				specs.length > 0
					? specs
					: [scanSpecSource(content, pkg.canonicalDeclarationPath)];
			detectedSpecType = discovered.find(
				(spec) => spec.specType !== 'unknown'
			)?.specType;
			matchesExpectedTarget = detectedSpecType === pkg.target;
		}

		results.push({
			...pkg,
			exists,
			matchesExpectedTarget,
			detectedSpecType,
		});
	}

	return results;
}

async function getWorkspaceManifestPatterns(
	fs: FsAdapter,
	workspaceRoot: string,
	config?: ResolvedContractsrcConfig
): Promise<string[]> {
	const workspacePackageJsonPath = fs.join(workspaceRoot, 'package.json');
	if (await fs.exists(workspacePackageJsonPath)) {
		const packageJson = await readPackageManifest(fs, workspacePackageJsonPath);
		const workspaces = extractWorkspacePatterns(packageJson);
		if (workspaces.length > 0) {
			return workspaces.map(
				(pattern) => `${stripSuffix(pattern)}/package.json`
			);
		}
	}

	if (config?.packages?.length) {
		return config.packages.map(
			(pattern) => `${stripSuffix(pattern)}/package.json`
		);
	}

	return DEFAULT_MANIFEST_PATTERNS;
}

function extractWorkspacePatterns(
	packageJson: Record<string, unknown>
): string[] {
	if (Array.isArray(packageJson.workspaces)) {
		return packageJson.workspaces.filter(
			(entry): entry is string => typeof entry === 'string'
		);
	}

	const workspaces = packageJson.workspaces as
		| { packages?: unknown }
		| undefined;
	if (Array.isArray(workspaces?.packages)) {
		return workspaces.packages.filter(
			(entry): entry is string => typeof entry === 'string'
		);
	}

	return [];
}

function getRequiredByKindKey(kind: WorkspacePackageKind) {
	return kind === 'appsRegistry' ? 'appsRegistry' : kind;
}

function stripSuffix(value: string): string {
	return value.replace(/\/+$/, '');
}

async function readPackageManifest(
	fs: FsAdapter,
	packageJsonPath: string
): Promise<Record<string, unknown>> {
	try {
		return JSON.parse(await fs.readFile(packageJsonPath)) as Record<
			string,
			unknown
		>;
	} catch {
		return {};
	}
}
