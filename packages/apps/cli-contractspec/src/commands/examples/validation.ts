import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';
import { analyzePackageDocBlocks } from '@contractspec/module.workspace';

const EXAMPLE_SCRIPT_GRACE_DEADLINE = Date.parse('2026-03-26T00:00:00+01:00');
const EXECUTABLE_TEST_FILE_PATTERN = /\.(test|spec)\.(?:[cm]?[jt]sx?)$/;
const PROOF_OR_SMOKE_FILE_PATTERN =
	/(^|\/)(proofs\/.+|src\/proof\/.+|.+\.(proof|smoke)\.(?:test|spec)\.(?:[cm]?[jt]sx?))$/;
const DOCUMENTED_PREFLIGHT_PATTERN =
	/\b(preflight|runbook|running locally|quickstart)\b/i;

interface WorkspaceExamplePackageJson {
	name?: string;
	exports?: Record<string, unknown>;
	scripts?: Record<string, string>;
}

interface ExamplePackageSignals {
	files: string[];
	readme: string;
}

export interface WorkspaceExampleFolderCheck {
	exampleDir: string;
	packageName?: string;
	errors: string[];
	warnings: string[];
}

interface MaintainedWorkspaceExample {
	directory: string;
	packageName: string;
}

interface WorkspaceExampleValidationResult {
	errors: string[];
	warnings: string[];
}

export async function validateWorkspaceExamplesFolder(
	repoRoot: string,
	examples: readonly ExampleSpec[]
): Promise<WorkspaceExampleFolderCheck[]> {
	const dir = path.join(repoRoot, 'packages', 'examples');
	let entries: string[] = [];
	try {
		entries = (await fs.readdir(dir, { withFileTypes: true }))
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);
	} catch {
		return [
			{
				exampleDir: dir,
				errors: [
					'Missing packages/examples folder (run from repo root or pass --repo-root)',
				],
				warnings: [],
			},
		];
	}

	const examplesByPackageName = new Map(
		examples.map((example) => [example.entrypoints.packageName, example])
	);
	const results: WorkspaceExampleFolderCheck[] = [];

	for (const name of entries) {
		const exampleDir = path.join(dir, name);
		const errors: string[] = [];
		const warnings: string[] = [];
		const pkgJsonPath = path.join(exampleDir, 'package.json');
		const hasPackageJson = await fileExists(pkgJsonPath);
		if (!hasPackageJson) {
			results.push({
				exampleDir,
				errors: [],
				warnings: [
					'skipping non-workspace example folder without package.json',
				],
			});
			continue;
		}
		const pkg = await readJson<WorkspaceExamplePackageJson>(pkgJsonPath);
		const packageName = pkg?.name;
		const exportsMap = normalizeExports(pkg?.exports);

		if (!packageName) {
			errors.push('package.json missing "name"');
		}
		if (packageName && !packageName.startsWith('@contractspec/example.')) {
			errors.push(
				`package name must start with "@contractspec/example." (got ${packageName})`
			);
		}
		if (!exportsMap['./example']) {
			errors.push('package.json must export "./example"');
		}
		if (!exportsMap['./docs']) {
			errors.push('package.json must export "./docs" (package docs surface)');
		}

		const srcExample = path.join(exampleDir, 'src', 'example.ts');
		if (!(await fileExists(srcExample))) {
			errors.push('missing src/example.ts');
		}

		const docsIndex = path.join(exampleDir, 'src', 'docs', 'index.ts');
		if (!(await fileExists(docsIndex))) {
			errors.push('missing src/docs/index.ts');
		}

		const docAnalysis = analyzePackageDocBlocks({
			packageName: packageName ?? path.basename(exampleDir),
			srcRoot: path.join(exampleDir, 'src'),
		});
		for (const diagnostic of docAnalysis.diagnostics) {
			if (diagnostic.severity !== 'error') {
				continue;
			}
			errors.push(`${diagnostic.ruleId}: ${diagnostic.message}`);
		}

		const example = packageName
			? examplesByPackageName.get(packageName)
			: undefined;
		if (packageName && !example) {
			errors.push(
				'not present in EXAMPLE_REGISTRY (manifest not wired into examples module)'
			);
		}

		if (example) {
			const maturityValidation = await validateExampleMaturity(
				exampleDir,
				example,
				pkg,
				exportsMap
			);
			errors.push(...maturityValidation.errors);
			warnings.push(...maturityValidation.warnings);
		}

		results.push({ exampleDir, packageName, errors, warnings });
	}

	const folderPackageNames = new Set(
		results.map((result) => result.packageName).filter(Boolean) as string[]
	);
	for (const example of examples) {
		if (!example.entrypoints.packageName.startsWith('@contractspec/example.')) {
			continue;
		}
		if (!folderPackageNames.has(example.entrypoints.packageName)) {
			results.push({
				exampleDir: dir,
				packageName: example.entrypoints.packageName,
				errors: [
					`registry example "${example.meta.key}" points to missing workspace package ${example.entrypoints.packageName}`,
				],
				warnings: [],
			});
		}
	}

	return results;
}

export async function validateGeneratedRegistry(
	repoRoot: string
): Promise<string[]> {
	const maintainedExamples =
		await discoverMaintainedWorkspaceExamples(repoRoot);
	const expectedRegistry = renderBuiltinsFile(maintainedExamples);
	const builtinsPath = path.join(
		repoRoot,
		'packages',
		'modules',
		'examples',
		'src',
		'builtins.ts'
	);
	const builtins = await fs.readFile(builtinsPath, 'utf8').catch(() => null);

	const errors: string[] = [];

	if (builtins !== expectedRegistry) {
		errors.push(
			'generated builtins.ts is out of date (run `bun scripts/generate-example-registry.ts --write`)'
		);
	}

	const moduleExamplesPackageJson = path.join(
		repoRoot,
		'packages',
		'modules',
		'examples',
		'package.json'
	);
	const modulePackage = await readJson<{
		dependencies?: Record<string, string>;
	}>(moduleExamplesPackageJson);
	const dependencies = modulePackage?.dependencies ?? {};

	for (const example of maintainedExamples) {
		if (!dependencies[example.packageName]) {
			errors.push(
				`packages/modules/examples/package.json is missing dependency ${example.packageName}`
			);
		}
	}

	return errors;
}

async function validateExampleMaturity(
	exampleDir: string,
	example: ExampleSpec,
	pkg: WorkspaceExamplePackageJson | null,
	exportsMap: Record<string, unknown>
): Promise<WorkspaceExampleValidationResult> {
	const scripts = pkg?.scripts ?? {};
	const signals = await collectExampleSignals(exampleDir);
	const errors: string[] = [];
	const warnings: string[] = [];

	const requiredScripts = ['build', 'typecheck', 'test'] as const;
	const missingScripts = requiredScripts.filter(
		(scriptName) => !scripts[scriptName]
	);
	const missingEntrypoints = getMissingEntrypointExports(example, exportsMap);
	const hasExecutableCoverage =
		hasTestFiles(signals.files) ||
		hasProofOrSmokeFiles(signals.files) ||
		Boolean(scripts.proof) ||
		Boolean(scripts.smoke) ||
		Boolean(scripts.preflight);

	if (
		example.meta.stability === 'beta' ||
		example.meta.stability === 'stable'
	) {
		for (const scriptName of missingScripts) {
			errors.push(
				`${example.meta.stability} examples must define a "${scriptName}" script`
			);
		}
		if (!hasExecutableCoverage) {
			errors.push(
				`${example.meta.stability} examples must include at least one executable test, proof, or smoke path`
			);
		}
		for (const missingEntrypoint of missingEntrypoints) {
			errors.push(missingEntrypoint);
		}
	}

	if (example.meta.stability === 'stable') {
		if (scripts.test?.includes('--pass-with-no-tests')) {
			errors.push(
				'stable examples cannot use `--pass-with-no-tests` in the "test" script'
			);
		}
		if (
			!hasProofOrSmokeFiles(signals.files) &&
			!scripts.proof &&
			!scripts.smoke
		) {
			errors.push(
				'stable examples must include deterministic proof or smoke coverage'
			);
		}
		if (!scripts.preflight) {
			errors.push(
				'stable examples must define a "preflight" script for release checks'
			);
		}
		if (
			!signals.readme ||
			!DOCUMENTED_PREFLIGHT_PATTERN.test(signals.readme) ||
			(!signals.readme.toLowerCase().includes('preflight') &&
				!signals.readme.toLowerCase().includes('runbook'))
		) {
			errors.push(
				'stable examples must document a runbook or preflight path in README.md'
			);
		}
	}

	if (example.meta.stability === 'experimental') {
		const scriptIssues = collectExperimentalScriptIssues(
			scripts,
			signals.files
		);
		if (scriptIssues.length > 0) {
			const target =
				Date.now() >= EXAMPLE_SCRIPT_GRACE_DEADLINE ? errors : warnings;
			for (const issue of scriptIssues) {
				target.push(issue);
			}
		}
	}

	return { errors, warnings };
}

function collectExperimentalScriptIssues(
	scripts: Record<string, string>,
	files: string[]
): string[] {
	const issues: string[] = [];
	for (const scriptName of ['build', 'typecheck', 'test'] as const) {
		if (!scripts[scriptName]) {
			issues.push(
				`experimental example is missing a "${scriptName}" script; this stays a warning until March 26, 2026`
			);
		}
	}
	if (scripts.test?.includes('--pass-with-no-tests') && !hasTestFiles(files)) {
		issues.push(
			'experimental example uses `--pass-with-no-tests` without colocated tests; this stays a warning until March 26, 2026'
		);
	}
	return issues;
}

function getMissingEntrypointExports(
	example: ExampleSpec,
	exportsMap: Record<string, unknown>
): string[] {
	const missingEntrypoints: string[] = [];

	for (const [entrypointName, exportPath] of Object.entries(
		example.entrypoints
	)) {
		if (entrypointName === 'packageName' || !exportPath) {
			continue;
		}
		if (!exportsMap[exportPath]) {
			missingEntrypoints.push(
				`${example.meta.stability} example "${example.meta.key}" declares example.entrypoints.${entrypointName} = "${exportPath}" but package.json does not export it`
			);
		}
	}

	return missingEntrypoints;
}

function hasTestFiles(files: string[]): boolean {
	return files.some((filePath) => EXECUTABLE_TEST_FILE_PATTERN.test(filePath));
}

function hasProofOrSmokeFiles(files: string[]): boolean {
	return files.some((filePath) => PROOF_OR_SMOKE_FILE_PATTERN.test(filePath));
}

async function collectExampleSignals(
	exampleDir: string
): Promise<ExamplePackageSignals> {
	const readme = await fs
		.readFile(path.join(exampleDir, 'README.md'), 'utf8')
		.catch(() => '');
	const files = await listFilesRecursive(exampleDir, ['src', 'proofs']);
	return { files, readme };
}

async function listFilesRecursive(
	exampleDir: string,
	subdirectories: string[]
): Promise<string[]> {
	const files: string[] = [];

	for (const subdirectory of subdirectories) {
		const baseDirectory = path.join(exampleDir, subdirectory);
		if (!(await fileExists(baseDirectory))) {
			continue;
		}
		const discovered = await walkFiles(baseDirectory, exampleDir);
		files.push(...discovered);
	}

	return files;
}

async function walkFiles(
	currentDirectory: string,
	rootDirectory: string
): Promise<string[]> {
	const entries = await fs
		.readdir(currentDirectory, { withFileTypes: true })
		.catch(() => []);
	const files: string[] = [];

	for (const entry of entries) {
		const absolutePath = path.join(currentDirectory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await walkFiles(absolutePath, rootDirectory)));
			continue;
		}
		if (entry.isFile()) {
			files.push(path.relative(rootDirectory, absolutePath));
		}
	}

	return files;
}

async function discoverMaintainedWorkspaceExamples(
	repoRoot: string
): Promise<MaintainedWorkspaceExample[]> {
	const dir = path.join(repoRoot, 'packages', 'examples');
	const entries = await fs
		.readdir(dir, { withFileTypes: true })
		.catch(() => []);
	const results: MaintainedWorkspaceExample[] = [];

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue;
		}

		const pkgJsonPath = path.join(dir, entry.name, 'package.json');
		const pkg = await readJson<WorkspaceExamplePackageJson>(pkgJsonPath);
		const exportsMap = normalizeExports(pkg?.exports);

		if (!pkg?.name?.startsWith('@contractspec/example.')) {
			continue;
		}
		if (!exportsMap['./example']) {
			continue;
		}
		if (!exportsMap['./docs']) {
			continue;
		}

		results.push({
			directory: entry.name,
			packageName: pkg.name,
		});
	}

	return results.sort((left, right) =>
		left.packageName.localeCompare(right.packageName)
	);
}

function renderBuiltinsFile(examples: MaintainedWorkspaceExample[]): string {
	const lines: string[] = [
		'import type { ExampleSpec } from "@contractspec/lib.contracts-spec/examples/types";',
		'',
		'// Generated by scripts/generate-example-registry.ts. Do not edit manually.',
	];

	for (const example of examples) {
		lines.push(
			`import ${toIdentifier(example.directory)} from "../../../examples/${example.directory}/src/example";`
		);
	}

	lines.push('', 'export const EXAMPLE_REGISTRY: readonly ExampleSpec[] = [');

	for (const example of examples) {
		lines.push(`  ${toIdentifier(example.directory)},`);
	}

	lines.push('];', '');
	return lines.join('\n');
}

function toIdentifier(value: string): string {
	const raw = value
		.split(/[^a-zA-Z0-9]+/)
		.filter(Boolean)
		.map((segment) => segment.slice(0, 1).toUpperCase() + segment.slice(1))
		.join('');

	return /^[0-9]/.test(raw) ? `Example${raw}` : raw;
}

function normalizeExports(
	exportsMap: WorkspaceExamplePackageJson['exports']
): Record<string, unknown> {
	return exportsMap ?? {};
}

async function readJson<T>(filePath: string): Promise<T | null> {
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}
