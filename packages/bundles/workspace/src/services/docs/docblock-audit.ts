import {
	analyzePackageDocBlocks,
	type DocBlockDiagnostic,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';

export interface WorkspaceDocBlockDiagnostic extends DocBlockDiagnostic {
	packageName: string;
	packageRoot: string;
	srcRoot: string;
}

interface WorkspaceDocPackage {
	packageName: string;
	packageRoot: string;
	srcRoot: string;
}

const PACKAGE_GLOB_IGNORES = [
	'**/node_modules/**',
	'**/dist/**',
	'**/.turbo/**',
	'**/.next/**',
];

async function discoverWorkspaceDocPackages(
	fs: FsAdapter,
	workspaceRoot: string
): Promise<WorkspaceDocPackage[]> {
	const packageJsonFiles = await fs.glob({
		pattern: 'packages/**/package.json',
		cwd: workspaceRoot,
		ignore: PACKAGE_GLOB_IGNORES,
	});
	const discovered = new Map<string, WorkspaceDocPackage>();

	for (const packageJsonFile of packageJsonFiles) {
		const packageRoot = fs.dirname(packageJsonFile);
		const srcRoot = fs.join(packageRoot, 'src');
		if (!(await fs.exists(srcRoot))) {
			continue;
		}

		try {
			const packageJson = JSON.parse(await fs.readFile(packageJsonFile)) as {
				name?: string;
			};
			discovered.set(packageRoot, {
				packageName:
					packageJson.name ?? fs.relative(workspaceRoot, packageRoot),
				packageRoot,
				srcRoot,
			});
		} catch {
			continue;
		}
	}

	const rootPackageJson = fs.join(workspaceRoot, 'package.json');
	const rootSrc = fs.join(workspaceRoot, 'src');
	if ((await fs.exists(rootPackageJson)) && (await fs.exists(rootSrc))) {
		try {
			const packageJson = JSON.parse(await fs.readFile(rootPackageJson)) as {
				name?: string;
			};
			discovered.set(workspaceRoot, {
				packageName: packageJson.name ?? workspaceRoot,
				packageRoot: workspaceRoot,
				srcRoot: rootSrc,
			});
		} catch {
			// Ignore unreadable root package.json files.
		}
	}

	return [...discovered.values()].sort((left, right) =>
		left.packageRoot.localeCompare(right.packageRoot)
	);
}

export async function analyzeWorkspaceDocBlocks(
	fs: FsAdapter,
	workspaceRoot: string
): Promise<WorkspaceDocBlockDiagnostic[]> {
	const diagnostics: WorkspaceDocBlockDiagnostic[] = [];
	const packages = await discoverWorkspaceDocPackages(fs, workspaceRoot);

	for (const pkg of packages) {
		const result = analyzePackageDocBlocks({
			packageName: pkg.packageName,
			srcRoot: pkg.srcRoot,
		});

		for (const diagnostic of result.diagnostics) {
			diagnostics.push({
				...diagnostic,
				packageName: pkg.packageName,
				packageRoot: pkg.packageRoot,
				srcRoot: pkg.srcRoot,
			});
		}
	}

	return diagnostics;
}
