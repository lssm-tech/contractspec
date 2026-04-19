import { scanAllSpecsFromSource } from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';
import { matchesAllowMissing } from './helpers';
import { auditPackageDeclarations } from './inventory';
import { type PackageSpecRefs, renderPackageDeclaration } from './render';
import {
	type PackageDeclarationSyncEntry,
	type PackageDeclarationSyncOptions,
	type PackageDeclarationSyncResult,
	type WorkspacePackageInfo,
} from './types';

const DEPENDENCIES_BY_TARGET: Record<WorkspacePackageInfo['target'], string[]> =
	{
		feature: ['@contractspec/lib.contracts-spec'],
		integration: [
			'@contractspec/lib.contracts-integrations',
			'@contractspec/lib.schema',
		],
		'app-config': ['@contractspec/lib.contracts-spec'],
		'module-bundle': ['@contractspec/lib.surface-runtime'],
		example: ['@contractspec/lib.contracts-spec'],
	};

function shouldExportPackageDeclaration(pkg: WorkspacePackageInfo) {
	return pkg.packageName !== '@contractspec/lib.schema';
}

function shouldKeepDependency(pkg: WorkspacePackageInfo, dependency: string) {
	if (dependency === pkg.packageName) {
		return false;
	}

	if (
		pkg.packageName === '@contractspec/lib.schema' &&
		dependency === '@contractspec/lib.contracts-spec'
	) {
		return false;
	}

	return true;
}

export async function syncPackageDeclarations(
	fs: FsAdapter,
	options: PackageDeclarationSyncOptions = {}
): Promise<PackageDeclarationSyncResult> {
	const audits = await auditPackageDeclarations(fs, options);
	const createdFiles: string[] = [];
	const updatedFiles: string[] = [];
	const packages: PackageDeclarationSyncEntry[] = [];

	for (const audit of audits) {
		if (!options.force && audit.exists && audit.matchesExpectedTarget) {
			packages.push({
				...audit,
				action: 'skipped',
				declarationCreated: false,
				indexUpdated: false,
				packageJsonUpdated: false,
				dependenciesUpdated: [],
			});
			continue;
		}

		const refs = await collectPackageSpecRefs(fs, audit);
		const code = renderPackageDeclaration({
			pkg: audit,
			refs,
			owners: options.config?.defaultOwners?.length
				? options.config.defaultOwners
				: ['@contractspec-core'],
			defaultTags: options.config?.defaultTags ?? [],
		});

		if (!options.dryRun) {
			await fs.writeFile(audit.canonicalDeclarationPath, `${code.trimEnd()}\n`);
		}

		const indexUpdated = await ensureIndexExport(
			fs,
			audit,
			options.dryRun,
			shouldExportPackageDeclaration(audit)
		);
		const { dependenciesUpdated, packageJsonUpdated } = await ensurePackageJson(
			fs,
			audit,
			options.dryRun
		);

		if (audit.exists) {
			updatedFiles.push(audit.canonicalDeclarationPath);
		} else {
			createdFiles.push(audit.canonicalDeclarationPath);
		}
		if (indexUpdated) {
			updatedFiles.push(audit.indexPath);
		}
		if (packageJsonUpdated) {
			updatedFiles.push(fs.join(audit.packageRoot, 'package.json'));
		}

		packages.push({
			...audit,
			action: audit.exists ? 'updated' : 'created',
			declarationCreated: !audit.exists,
			indexUpdated,
			packageJsonUpdated,
			dependenciesUpdated,
		});
	}

	return {
		packages,
		createdFiles,
		updatedFiles,
	};
}

export function createPackageDeclarationIssue(
	entry:
		| PackageDeclarationSyncEntry
		| Awaited<ReturnType<typeof auditPackageDeclarations>>[number],
	allowMissing: string[]
) {
	const allowlisted = matchesAllowMissing(
		allowMissing,
		entry.relativePackageRoot,
		entry.packageName
	);
	return {
		allowlisted,
		message: entry.exists
			? `Package declaration at ${entry.canonicalDeclarationRelativePath} must be a ${entry.target} spec.`
			: `Package ${entry.relativePackageRoot} is missing its canonical ${entry.target} declaration at ${entry.canonicalDeclarationRelativePath}.`,
	};
}

async function collectPackageSpecRefs(
	fs: FsAdapter,
	pkg: WorkspacePackageInfo
): Promise<PackageSpecRefs> {
	const files = await fs.glob({
		cwd: pkg.packageRoot,
		patterns: ['src/**/*.{ts,tsx}'],
		absolute: false,
		ignore: ['**/dist/**', '**/*.test.*', '**/*.spec.*', '**/*.stories.*'],
	});
	const refs: PackageSpecRefs = {
		operations: [],
		events: [],
		presentations: [],
		experiments: [],
		workflows: [],
		dataViews: [],
		capabilities: [],
		features: [],
	};

	for (const file of files) {
		if (file === pkg.canonicalDeclarationRelativePath) continue;
		const content = await fs.readFile(fs.join(pkg.packageRoot, file));
		const specs = scanAllSpecsFromSource(content, file);
		for (const spec of specs) {
			if (!spec.key || !spec.version) continue;
			const ref = { key: spec.key, version: spec.version };
			switch (spec.specType) {
				case 'operation':
					pushUnique(refs.operations, ref);
					break;
				case 'event':
					pushUnique(refs.events, ref);
					break;
				case 'presentation':
					pushUnique(refs.presentations, ref);
					break;
				case 'experiment':
					pushUnique(refs.experiments, ref);
					break;
				case 'workflow':
					pushUnique(refs.workflows, ref);
					break;
				case 'data-view':
					pushUnique(refs.dataViews, ref);
					break;
				case 'capability':
					pushUnique(refs.capabilities, ref);
					break;
				case 'feature':
					pushUnique(refs.features, ref);
					break;
			}
		}
	}

	return refs;
}

function pushUnique(
	target: Array<{ key: string; version: string }>,
	ref: {
		key: string;
		version: string;
	}
) {
	if (
		!target.some(
			(entry) => entry.key === ref.key && entry.version === ref.version
		)
	) {
		target.push(ref);
	}
}

async function ensureIndexExport(
	fs: FsAdapter,
	pkg: WorkspacePackageInfo,
	dryRun = false,
	enabled = true
) {
	if (!enabled) return false;
	const exportLine = `export * from "${pkg.indexExportPath}";`;
	const exportPattern = new RegExp(
		`export \\* from ['"]${pkg.indexExportPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];`
	);
	let content = (await fs.exists(pkg.indexPath))
		? await fs.readFile(pkg.indexPath)
		: '';
	if (exportPattern.test(content)) return false;
	content = `${content.trimEnd()}\n${exportLine}\n`.trimStart();
	if (!dryRun) {
		await fs.writeFile(pkg.indexPath, content);
	}
	return true;
}

async function ensurePackageJson(
	fs: FsAdapter,
	pkg: WorkspacePackageInfo,
	dryRun = false
) {
	const packageJsonPath = fs.join(pkg.packageRoot, 'package.json');
	const packageJson = JSON.parse(await fs.readFile(packageJsonPath)) as Record<
		string,
		unknown
	>;
	const dependencies = ensureRecord(packageJson, 'dependencies');
	const dependenciesUpdated: string[] = [];
	let packageJsonUpdated = false;

	for (const dependency of DEPENDENCIES_BY_TARGET[pkg.target]) {
		if (!shouldKeepDependency(pkg, dependency)) {
			if (dependency in dependencies) {
				delete dependencies[dependency];
				packageJsonUpdated = true;
			}
			continue;
		}
		if (typeof dependencies[dependency] !== 'string') {
			dependencies[dependency] = 'workspace:*';
			dependenciesUpdated.push(dependency);
		}
	}

	const exportsField = ensureRecord(packageJson, 'exports');
	packageJsonUpdated = packageJsonUpdated || dependenciesUpdated.length > 0;
	if (typeof exportsField['.'] !== 'string') {
		exportsField['.'] = './src/index.ts';
		packageJsonUpdated = true;
	}

	if (packageJsonUpdated && !dryRun) {
		await fs.writeFile(
			packageJsonPath,
			`${JSON.stringify(packageJson, null, '\t')}\n`
		);
	}

	return { dependenciesUpdated, packageJsonUpdated };
}

function ensureRecord(
	object: Record<string, unknown>,
	key: string
): Record<string, unknown> {
	const value = object[key];
	if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	const created: Record<string, unknown> = {};
	object[key] = created;
	return created;
}
