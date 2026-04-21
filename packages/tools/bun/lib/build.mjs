/* global Bun */

import { existsSync } from 'node:fs';
import {
	copyFile,
	mkdir,
	readFile,
	rm,
	stat,
	unlink,
	writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { glob } from 'glob';
import { selectEntriesForTarget } from './config.mjs';

const BUN_EXECUTABLE = process.execPath || 'bun';

function getOutputDir(cwd, target) {
	if (target === 'bun') {
		return path.join(cwd, 'dist');
	}

	return path.join(cwd, 'dist', target);
}

function getBuildTarget(target) {
	if (target === 'native') {
		return 'browser';
	}

	return target;
}

/**
 * Compute output path for an entry when using [dir]/[name].[ext] naming.
 * @param {string} entry - Entry path relative to cwd (e.g. "src/index.ts")
 * @param {string} root - Build root (e.g. "src" or ".")
 * @returns {string} Output path relative to outdir (e.g. "index.js" or "adapters/dnd.js")
 */
function entryToOutputPath(entry, root) {
	const normalized = entry.replaceAll('\\', '/');
	const relative = root === '.' ? normalized : path.relative(root, normalized);
	const dir = path.dirname(relative);
	const base = path.basename(relative);
	const ext = base.includes('.') ? base.slice(base.lastIndexOf('.')) : '';
	const name = ext ? base.slice(0, -ext.length) : base;
	const outExt = /\.(tsx?|jsx?|mts|cts|mjs|cjs)$/i.test(ext) ? '.js' : ext;
	const outPath = dir === '.' ? `${name}${outExt}` : `${dir}/${name}${outExt}`;
	return outPath.replaceAll('\\', '/');
}

function styleEntryToOutputPath(entry) {
	const normalized = entry.replaceAll('\\', '/');
	return normalized.startsWith('src/') ? normalized.slice(4) : normalized;
}

/**
 * Transpile with noBundle using bun build --outfile per entry.
 * Workaround for Bun bug: --no-bundle --outdir causes ENOENT (bun#5206).
 * Using --outfile per entry avoids the bug.
 */
export function buildTranspileNoBundleArgs({
	entry,
	root,
	target,
	outfile,
	external,
	production = true,
}) {
	const args = [
		'build',
		entry,
		'--root',
		root,
		'--target',
		getBuildTarget(target),
		'--format',
		'esm',
		'--packages',
		'external',
		'--no-bundle',
		'--outfile',
		outfile,
	];
	if (production) {
		args.push('--production');
	}
	for (const item of external) {
		args.push('--external', item);
	}

	return args;
}

async function runTranspileNoBundle({
	cwd,
	selectedEntries,
	root,
	target,
	outdir,
	external,
}) {
	for (const entry of selectedEntries) {
		const outPath = entryToOutputPath(entry, root);
		const outfile = path.join(outdir, outPath);
		const args = buildTranspileNoBundleArgs({
			entry,
			root,
			target,
			outfile,
			external,
		});

		const subprocess = Bun.spawn([BUN_EXECUTABLE, ...args], {
			cwd,
			env: { ...process.env, NODE_ENV: 'production' },
			stdout: 'inherit',
			stderr: 'inherit',
			stdin: 'inherit',
		});
		const exitCode = await subprocess.exited;
		if (exitCode !== 0) {
			process.exit(exitCode);
		}
	}
}

async function runTranspileStyles({ cwd, styleEntries }) {
	for (const styleEntry of styleEntries) {
		const outfile = path.join(cwd, 'dist', styleEntryToOutputPath(styleEntry));
		const subprocess = Bun.spawn(
			[
				BUN_EXECUTABLE,
				'build',
				styleEntry,
				'--target',
				'browser',
				'--outfile',
				outfile,
				'--production',
			],
			{
				cwd,
				env: { ...process.env, NODE_ENV: 'production' },
				stdout: 'inherit',
				stderr: 'inherit',
				stdin: 'inherit',
			}
		);
		const exitCode = await subprocess.exited;
		if (exitCode !== 0) {
			process.exit(exitCode);
		}
	}
}

async function copyTranspileStyles({ cwd, styleEntries }) {
	for (const styleEntry of styleEntries) {
		const outfile = path.join(cwd, 'dist', styleEntryToOutputPath(styleEntry));
		await mkdir(path.dirname(outfile), { recursive: true });
		await copyFile(path.join(cwd, styleEntry), outfile);
	}
}

export function buildTranspileArgs({
	selectedEntries,
	root,
	target,
	outdir,
	external,
	noBundle,
	production = true,
}) {
	const args = [
		'build',
		...selectedEntries,
		'--root',
		root,
		'--target',
		getBuildTarget(target),
		'--format',
		'esm',
		'--packages',
		'external',
		'--outdir',
		outdir,
		'--entry-naming',
		'[dir]/[name].[ext]',
	];
	if (production) {
		args.push('--production');
	}

	if (noBundle === true) {
		args.push('--no-bundle');
	}

	for (const item of external) {
		args.push('--external', item);
	}

	return args;
}

async function readJson(filePath) {
	const content = await readFile(filePath, 'utf8');
	return JSON.parse(content);
}

async function findWorkspaceRoot(startDir) {
	let currentDir = startDir;

	while (true) {
		const packageJsonPath = path.join(currentDir, 'package.json');
		try {
			const packageJson = await readJson(packageJsonPath);
			if (packageJson.workspaces) {
				return currentDir;
			}
		} catch {
			// Keep walking up until we find the workspace root.
		}

		const parentDir = path.dirname(currentDir);
		if (parentDir === currentDir) {
			return null;
		}

		currentDir = parentDir;
	}
}

function toPosixRelativePath(fromDir, toPath) {
	return path.relative(fromDir, toPath).replaceAll('\\', '/');
}

function extractTypesPath(exportValue) {
	if (typeof exportValue === 'string') {
		return exportValue;
	}

	if (exportValue && typeof exportValue === 'object') {
		if (typeof exportValue.types === 'string') {
			return exportValue.types;
		}

		if (
			typeof exportValue.default === 'string' &&
			exportValue.default.endsWith('.d.ts')
		) {
			return exportValue.default;
		}
	}

	return null;
}

function extractWorkspaceExportPath(exportValue) {
	if (typeof exportValue === 'string') {
		return exportValue;
	}

	if (!exportValue || typeof exportValue !== 'object') {
		return null;
	}

	for (const key of ['source', 'types', 'import', 'default', 'bun', 'node']) {
		const value = exportValue[key];
		if (typeof value === 'string' && value.startsWith('./src/')) {
			return value;
		}
	}

	return null;
}

function resolveWorkspacePathCandidate(dependencyDir, candidatePaths) {
	for (const candidatePath of candidatePaths) {
		if (typeof candidatePath !== 'string' || candidatePath.length === 0) {
			continue;
		}

		const absolutePath = path.join(dependencyDir, candidatePath);
		if (existsSync(absolutePath)) {
			return candidatePath;
		}
	}

	return null;
}

function collectPublishedTypePaths(packageJson) {
	const publishExports = packageJson.publishConfig?.exports;
	const typePaths = new Set();
	const rootTypesPath =
		extractTypesPath(publishExports?.['.']) ?? packageJson.types;

	if (typeof rootTypesPath === 'string') {
		typePaths.add(rootTypesPath);
	}

	if (!publishExports || typeof publishExports !== 'object') {
		return Array.from(typePaths);
	}

	for (const [subpath, exportValue] of Object.entries(publishExports)) {
		if (!subpath.startsWith('./') || subpath === './*') {
			continue;
		}

		const typesPath = extractTypesPath(exportValue);
		if (typeof typesPath === 'string') {
			typePaths.add(typesPath);
		}
	}

	return Array.from(typePaths);
}

function hasBuildTypesScript(packageJson) {
	const buildTypesScript = packageJson.scripts?.['build:types'];
	return typeof buildTypesScript === 'string' && buildTypesScript.length > 0;
}

async function getLatestSourceMtimeMs(dependencyDir) {
	const sourceFiles = await glob('src/**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}', {
		cwd: dependencyDir,
		nodir: true,
		windowsPathsNoEscape: true,
	});

	let latestSourceMtimeMs = 0;
	for (const sourceFile of sourceFiles) {
		const sourceStats = await stat(path.join(dependencyDir, sourceFile));
		latestSourceMtimeMs = Math.max(latestSourceMtimeMs, sourceStats.mtimeMs);
	}

	return latestSourceMtimeMs;
}

async function getOldestPublishedTypeMtimeMs(
	dependencyDir,
	publishedTypePaths
) {
	let oldestPublishedTypeMtimeMs = Number.POSITIVE_INFINITY;
	for (const publishedTypePath of publishedTypePaths) {
		const typeStats = await stat(path.join(dependencyDir, publishedTypePath));
		oldestPublishedTypeMtimeMs = Math.min(
			oldestPublishedTypeMtimeMs,
			typeStats.mtimeMs
		);
	}

	return oldestPublishedTypeMtimeMs;
}

async function dependencyTypesNeedBuild(dependencyDir, dependencyPackageJson) {
	const publishedTypePaths = collectPublishedTypePaths(dependencyPackageJson);
	if (publishedTypePaths.length === 0) {
		return false;
	}

	if (
		publishedTypePaths.some(
			(targetPath) => !existsSync(path.join(dependencyDir, targetPath))
		)
	) {
		return true;
	}

	const latestSourceMtimeMs = await getLatestSourceMtimeMs(dependencyDir);
	if (latestSourceMtimeMs === 0) {
		return false;
	}

	const oldestPublishedTypeMtimeMs = await getOldestPublishedTypeMtimeMs(
		dependencyDir,
		publishedTypePaths
	);

	return latestSourceMtimeMs > oldestPublishedTypeMtimeMs;
}

async function ensureWorkspaceDependencyTypes(
	dependencyDir,
	dependencyPackageJson
) {
	if (!hasBuildTypesScript(dependencyPackageJson)) {
		return;
	}

	if (!(await dependencyTypesNeedBuild(dependencyDir, dependencyPackageJson))) {
		return;
	}

	const subprocess = Bun.spawn([BUN_EXECUTABLE, 'run', 'build:types'], {
		cwd: dependencyDir,
		stdout: 'inherit',
		stderr: 'inherit',
		stdin: 'inherit',
	});
	const exitCode = await subprocess.exited;
	if (exitCode !== 0) {
		process.exit(exitCode);
	}
}

function addPathMapping(pathsMap, key, values) {
	if (!key || !Array.isArray(values) || values.length === 0) {
		return;
	}

	const deduped = [];
	for (const value of values) {
		if (typeof value !== 'string' || value.length === 0) {
			continue;
		}

		if (!deduped.includes(value)) {
			deduped.push(value);
		}
	}

	if (deduped.length > 0) {
		pathsMap[key] = deduped;
	}
}

async function resolveDependencyPathMappings(cwd) {
	const workspaceRoot = await findWorkspaceRoot(cwd);
	if (!workspaceRoot) {
		return {};
	}

	const packageJson = await readJson(path.join(cwd, 'package.json'));
	const dependencyNames = new Set();
	for (const deps of [
		packageJson.dependencies,
		packageJson.devDependencies,
		packageJson.peerDependencies,
	]) {
		for (const [name] of Object.entries(deps ?? {})) {
			if (name.startsWith('@contractspec/')) {
				dependencyNames.add(name);
			}
		}
	}

	if (dependencyNames.size === 0) {
		return {};
	}

	const packageJsonFiles = await glob('packages/*/*/package.json', {
		cwd: workspaceRoot,
		nodir: true,
		windowsPathsNoEscape: true,
	});

	const dependencyDirs = new Map();
	for (const packageJsonFile of packageJsonFiles) {
		const absolutePackageJsonPath = path.join(workspaceRoot, packageJsonFile);
		const dependencyPackageJson = await readJson(absolutePackageJsonPath);
		if (dependencyNames.has(dependencyPackageJson.name)) {
			dependencyDirs.set(
				dependencyPackageJson.name,
				path.dirname(absolutePackageJsonPath)
			);
		}
	}

	const pathsMap = {};

	for (const dependencyName of dependencyNames) {
		const dependencyDir = dependencyDirs.get(dependencyName);
		if (!dependencyDir) {
			continue;
		}

		const dependencyPackageJson = await readJson(
			path.join(dependencyDir, 'package.json')
		);
		await ensureWorkspaceDependencyTypes(dependencyDir, dependencyPackageJson);
		const preferPublishedTypes = hasBuildTypesScript(dependencyPackageJson);
		const workspaceExports = dependencyPackageJson.exports;
		const rootWorkspacePath = extractWorkspaceExportPath(
			workspaceExports?.['.']
		);
		const publishExports = dependencyPackageJson.publishConfig?.exports;
		const rootTypesPath =
			extractTypesPath(publishExports?.['.']) ?? dependencyPackageJson.types;
		const rootPathCandidates = preferPublishedTypes
			? [rootTypesPath, rootWorkspacePath]
			: [rootWorkspacePath, rootTypesPath];
		const resolvedRootPath = resolveWorkspacePathCandidate(
			dependencyDir,
			rootPathCandidates
		);

		if (resolvedRootPath) {
			addPathMapping(pathsMap, dependencyName, [
				toPosixRelativePath(cwd, path.join(dependencyDir, resolvedRootPath)),
			]);
		}

		addPathMapping(pathsMap, `${dependencyName}/*`, [
			toPosixRelativePath(cwd, path.join(dependencyDir, 'dist/*')),
		]);

		if (!publishExports || typeof publishExports !== 'object') {
			continue;
		}

		for (const [subpath, exportValue] of Object.entries(publishExports)) {
			if (!subpath.startsWith('./') || subpath === './*') {
				continue;
			}

			const subpathWithoutPrefix = subpath.slice(2);
			const workspaceSubpath =
				workspaceExports && typeof workspaceExports === 'object'
					? extractWorkspaceExportPath(workspaceExports[subpath])
					: null;
			const typesPath = extractTypesPath(exportValue);
			const subpathCandidates = preferPublishedTypes
				? [typesPath, workspaceSubpath]
				: [workspaceSubpath, typesPath];
			const resolvedSubpath = resolveWorkspacePathCandidate(
				dependencyDir,
				subpathCandidates
			);
			if (!resolvedSubpath) {
				continue;
			}

			addPathMapping(pathsMap, `${dependencyName}/${subpathWithoutPrefix}`, [
				toPosixRelativePath(cwd, path.join(dependencyDir, resolvedSubpath)),
			]);
		}
	}

	return pathsMap;
}

export async function runTranspile({
	cwd,
	entries,
	styleEntries = [],
	styleMode = 'build',
	external,
	targets,
	targetRoots,
	noBundle,
}) {
	const selectedStyleEntries = styleEntries.filter(
		(entry) => typeof entry === 'string' && entry.endsWith('.css')
	);
	const bunEntries = selectEntriesForTarget(entries, 'bun');
	if (selectedStyleEntries.length > 0 && bunEntries.length === 0) {
		await rm(getOutputDir(cwd, 'bun'), { recursive: true, force: true });
	}

	const requestedTargets = [
		'bun',
		targets.node ? 'node' : null,
		targets.browser ? 'browser' : null,
		selectEntriesForTarget(entries, 'native').length > 0 ? 'native' : null,
	].filter(Boolean);

	for (const target of requestedTargets) {
		const selectedEntries =
			target === 'bun' ? bunEntries : selectEntriesForTarget(entries, target);

		if (selectedEntries.length === 0) {
			continue;
		}

		const root = targetRoots?.[target] ?? '.';

		const outdir = getOutputDir(cwd, target);
		await rm(outdir, { recursive: true, force: true });

		console.log(
			`[contractspec-bun-build] transpile target=${target} root=${root} entries=${selectedEntries.length} noBundle=${noBundle === true}`
		);

		if (noBundle === true) {
			await runTranspileNoBundle({
				cwd,
				selectedEntries,
				root,
				target,
				outdir,
				external,
			});
			continue;
		}

		const relativeOutdir = path.relative(cwd, outdir).replaceAll('\\', '/');
		const args = buildTranspileArgs({
			selectedEntries,
			root,
			target,
			outdir: relativeOutdir,
			external,
			noBundle: false,
		});

		const subprocess = Bun.spawn([BUN_EXECUTABLE, ...args], {
			cwd,
			env: { ...process.env, NODE_ENV: 'production' },
			stdout: 'inherit',
			stderr: 'inherit',
			stdin: 'inherit',
		});
		const exitCode = await subprocess.exited;
		if (exitCode !== 0) {
			process.exit(exitCode);
		}
	}

	if (selectedStyleEntries.length > 0) {
		const selectedStyleMode = styleMode === 'copy' ? 'copy' : 'build';
		console.log(
			`[contractspec-bun-build] transpile target=style entries=${selectedStyleEntries.length} mode=${selectedStyleMode}`
		);
		if (selectedStyleMode === 'copy') {
			await copyTranspileStyles({ cwd, styleEntries: selectedStyleEntries });
			return;
		}

		await runTranspileStyles({ cwd, styleEntries: selectedStyleEntries });
	}
}

export async function runDev({
	cwd,
	entries,
	external,
	targets,
	targetRoots,
	allTargets = false,
	noBundle,
}) {
	const requestedTargets = allTargets
		? [
				'bun',
				targets.node ? 'node' : null,
				targets.browser ? 'browser' : null,
				selectEntriesForTarget(entries, 'native').length > 0 ? 'native' : null,
			]
		: ['bun'];
	const selectedTargets = requestedTargets.filter(Boolean);
	const subprocesses = [];

	for (const target of selectedTargets) {
		const selectedEntries = selectEntriesForTarget(entries, target);

		if (selectedEntries.length === 0) {
			continue;
		}

		const root = targetRoots?.[target] ?? '.';
		const outdir = target === 'bun' ? 'dist' : `dist/${target}`;
		const args = buildTranspileArgs({
			selectedEntries,
			root,
			target,
			outdir,
			external,
			noBundle,
			production: false,
		});
		args.push('--watch');

		const subprocess = Bun.spawn([BUN_EXECUTABLE, ...args], {
			cwd,
			stdout: 'inherit',
			stderr: 'inherit',
			stdin: 'inherit',
		});
		subprocesses.push(subprocess);
	}

	await Promise.all(subprocesses.map((subprocess) => subprocess.exited));
}

export async function runTypes({
	cwd,
	tsconfigForTypes,
	typesRoot,
	declarationMap = process.env.CONTRACTSPEC_TYPES_DECLARATION_MAP === '1',
}) {
	const configPath = tsconfigForTypes ?? 'tsconfig.json';
	const tempTsConfigPath = path.join(cwd, '.tsconfig.contractspec-types.json');
	const dependencyPaths = await resolveDependencyPathMappings(cwd);

	const tempConfig = {
		extends: `./${configPath}`,
		compilerOptions: {
			noEmit: false,
			incremental: false,
			emitDeclarationOnly: true,
			declaration: true,
			declarationMap,
			outDir: 'dist',
			...(typesRoot ? { rootDir: typesRoot } : {}),
			...(Object.keys(dependencyPaths).length > 0
				? {
						baseUrl: '.',
						paths: dependencyPaths,
					}
				: {}),
		},
	};

	await writeFile(
		tempTsConfigPath,
		`${JSON.stringify(tempConfig, null, 2)}\n`,
		'utf8'
	);
	let exitCode = 1;
	try {
		const subprocess = Bun.spawn(
			[BUN_EXECUTABLE, 'x', 'tsc', '--project', tempTsConfigPath],
			{
				cwd,
				stdout: 'inherit',
				stderr: 'inherit',
				stdin: 'inherit',
			}
		);
		exitCode = await subprocess.exited;
	} finally {
		await unlink(tempTsConfigPath).catch(() => undefined);
	}

	if (exitCode !== 0) {
		process.exit(exitCode);
	}
}
