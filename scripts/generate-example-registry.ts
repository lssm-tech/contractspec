import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';

interface ExamplePackageInfo {
	directory: string;
	packageName: string;
	hasUiExport: boolean;
	example: ExampleSpec;
}

interface ExampleSourceInfo {
	key: string;
	packageName: string;
	repositoryUrl: string;
	directory: string;
	defaultRef: string;
}

interface PreviewPackageInfo extends ExamplePackageInfo {
	exportName: string;
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const examplesDir = path.join(repoRoot, 'packages', 'examples');
const builtinsPath = path.join(
	repoRoot,
	'packages',
	'modules',
	'examples',
	'src',
	'builtins.ts'
);
const previewsPath = path.join(
	repoRoot,
	'packages',
	'modules',
	'examples',
	'src',
	'runtime',
	'previews.generated.ts'
);
const previewMetadataPath = path.join(
	repoRoot,
	'packages',
	'modules',
	'examples',
	'src',
	'preview-catalog.generated.ts'
);

const SOURCE_REPOSITORY_URL = 'https://github.com/lssm-tech/contractspec.git';
const SOURCE_DEFAULT_REF = 'main';

const PRIMARY_UI_EXPORT_BY_DIRECTORY: Record<string, string> = {
	'agent-console': 'ExecutionConsoleHost',
	'ai-chat-assistant': 'AiChatAssistantDashboard',
	'analytics-dashboard': 'AnalyticsDashboard',
	'crm-pipeline': 'CrmDashboard',
	'data-grid-showcase': 'DataGridShowcase',
	'finance-ops-ai-workflows': 'FinanceOpsAiWorkflowsPreview',
	'form-showcase': 'FormShowcasePreview',
	'in-app-docs': 'InAppDocsViewer',
	'integration-hub': 'IntegrationDashboard',
	'learning-journey-registry': 'LearningMiniApp',
	marketplace: 'MarketplaceDashboard',
	'pocket-family-office': 'PocketFamilyOfficePreview',
	'policy-safe-knowledge-assistant': 'PolicySafeKnowledgeAssistantDashboard',
	'saas-boilerplate': 'SaasDashboard',
	'visualization-showcase': 'VisualizationShowcase',
	'wealth-snapshot': 'WealthSnapshotPreview',
	'workflow-system': 'WorkflowDashboard',
};

async function main(): Promise<void> {
	const write = process.argv.includes('--write');
	const packages = await discoverWorkspaceExamples();
	const renderedBuiltins = await formatGeneratedTypescript(
		builtinsPath,
		renderBuiltins(packages)
	);
	const previewPackages = resolvePreviewPackages(packages);
	const renderedPreviewMetadata = await formatGeneratedTypescript(
		previewMetadataPath,
		renderPreviewMetadata(previewPackages)
	);
	const renderedPreviews = await formatGeneratedTypescript(
		previewsPath,
		renderPreviewRegistry(previewPackages)
	);
	const currentBuiltins = await readFileIfExists(builtinsPath);
	const currentPreviewMetadata = await readFileIfExists(previewMetadataPath);
	const currentPreviews = await readFileIfExists(previewsPath);

	if (!write) {
		if (currentBuiltins !== renderedBuiltins) {
			console.error(
				`Example registry is out of date: ${path.relative(repoRoot, builtinsPath)}`
			);
			process.exitCode = 1;
		}
		if (currentPreviews !== renderedPreviews) {
			console.error(
				`Example preview registry is out of date: ${path.relative(
					repoRoot,
					previewsPath
				)}`
			);
			process.exitCode = 1;
		}
		if (currentPreviewMetadata !== renderedPreviewMetadata) {
			console.error(
				`Example preview metadata is out of date: ${path.relative(
					repoRoot,
					previewMetadataPath
				)}`
			);
			process.exitCode = 1;
		}
		return;
	}

	if (currentBuiltins !== renderedBuiltins) {
		await fs.writeFile(builtinsPath, renderedBuiltins, 'utf8');
		console.log(
			`Updated ${path.relative(repoRoot, builtinsPath)} with ${packages.length} examples.`
		);
	}

	if (currentPreviews !== renderedPreviews) {
		await fs.writeFile(previewsPath, renderedPreviews, 'utf8');
		console.log(
			`Updated ${path.relative(repoRoot, previewsPath)} with inline preview loaders.`
		);
	}

	if (currentPreviewMetadata !== renderedPreviewMetadata) {
		await fs.writeFile(previewMetadataPath, renderedPreviewMetadata, 'utf8');
		console.log(
			`Updated ${path.relative(repoRoot, previewMetadataPath)} with inline preview metadata.`
		);
	}

	if (
		currentBuiltins === renderedBuiltins &&
		currentPreviewMetadata === renderedPreviewMetadata &&
		currentPreviews === renderedPreviews
	) {
		console.log(
			`Example registry already up to date (${packages.length} examples).`
		);
	}
}

async function discoverWorkspaceExamples(): Promise<ExamplePackageInfo[]> {
	const entries = await fs.readdir(examplesDir, { withFileTypes: true });
	const packages: ExamplePackageInfo[] = [];

	for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
		if (!entry.isDirectory()) continue;

		const packageJsonPath = path.join(examplesDir, entry.name, 'package.json');
		const pkg = await readJson<{
			name?: string;
			private?: boolean;
			exports?: Record<string, unknown>;
		}>(packageJsonPath);

		if (!pkg?.name?.startsWith('@contractspec/example.')) continue;
		if (pkg.private === true) continue;
		if (!pkg.exports?.['./example']) continue;
		if (!pkg.exports?.['./docs']) continue;

		packages.push({
			directory: entry.name,
			example: await loadExampleSpec(entry.name),
			packageName: pkg.name,
			hasUiExport: Boolean(pkg.exports?.['./ui']),
		});
	}

	return packages.sort((a, b) => a.packageName.localeCompare(b.packageName));
}

function renderBuiltins(packages: ExamplePackageInfo[]): string {
	const examples = packages.map((pkg) => pkg.example);
	const sources = packages.map((pkg): ExampleSourceInfo => {
		const key = normalizeExampleKey(pkg.example.meta.key);
		return {
			key,
			packageName: pkg.packageName,
			repositoryUrl: SOURCE_REPOSITORY_URL,
			directory: `packages/examples/${pkg.directory}`,
			defaultRef: SOURCE_DEFAULT_REF,
		};
	});

	return `${[
		'// Generated by scripts/generate-example-registry.ts. Do not edit manually.',
		"import type { ExampleSpec } from '@contractspec/lib.contracts-spec/examples/types';",
		"import type { ExampleSource } from './registry';",
		'',
		`export const EXAMPLE_REGISTRY = ${JSON.stringify(examples, null, '\t')} satisfies readonly ExampleSpec[];`,
		'',
		`export const EXAMPLE_SOURCE_REGISTRY = ${JSON.stringify(sources, null, '\t')} satisfies readonly ExampleSource[];`,
		'',
	].join('\n')}`;
}

function resolvePreviewPackages(
	packages: ExamplePackageInfo[]
): PreviewPackageInfo[] {
	const previewPackages = packages
		.filter((pkg) => pkg.hasUiExport)
		.map((pkg) => ({
			...pkg,
			exportName: PRIMARY_UI_EXPORT_BY_DIRECTORY[pkg.directory],
		}));

	for (const pkg of previewPackages) {
		if (!pkg.exportName) {
			throw new Error(
				`Missing primary UI export mapping for ${pkg.packageName}. Update PRIMARY_UI_EXPORT_BY_DIRECTORY in scripts/generate-example-registry.ts.`
			);
		}
	}

	return previewPackages;
}

function renderPreviewMetadata(
	previewPackages: readonly PreviewPackageInfo[]
): string {
	const lines: string[] = [
		'// Generated by scripts/generate-example-registry.ts. Do not edit manually.',
		'',
		'export interface GeneratedInlineExamplePreviewMetadata {',
		'\tkey: string;',
		'\texportName: string;',
		'}',
		'',
		'export const INLINE_EXAMPLE_PREVIEW_METADATA: readonly GeneratedInlineExamplePreviewMetadata[] =',
		'\t[',
	];

	for (const pkg of previewPackages) {
		lines.push('\t\t{');
		lines.push(`\t\t\tkey: '${pkg.directory}',`);
		lines.push(`\t\t\texportName: '${pkg.exportName}',`);
		lines.push('\t\t},');
	}

	lines.push('\t];', '');
	return `${lines.join('\n')}`;
}

function renderPreviewRegistry(
	previewPackages: readonly PreviewPackageInfo[]
): string {
	const lines: string[] = [
		'// Generated by scripts/generate-example-registry.ts. Do not edit manually.',
		'',
		'export interface GeneratedInlineExamplePreviewRegistration {',
		'\tkey: string;',
		'\texportName: string;',
		'\tloadModule: () => Promise<Record<string, unknown>>;',
		'}',
		'',
		'export const INLINE_EXAMPLE_PREVIEW_REGISTRY: readonly GeneratedInlineExamplePreviewRegistration[] =',
		'\t[',
	];

	for (const pkg of previewPackages) {
		lines.push('\t\t{');
		lines.push(`\t\t\tkey: '${pkg.directory}',`);
		lines.push(`\t\t\texportName: '${pkg.exportName}',`);
		lines.push('\t\t\tloadModule: () =>');
		lines.push(`\t\t\t\timport('${pkg.packageName}/ui').catch((error) => {`);
		lines.push('\t\t\t\t\tthrow new Error(');
		lines.push(
			`\t\t\t\t\t\t'Example package ${pkg.packageName} is not installed. Run \`contractspec examples download ${pkg.directory}\` or install the package before requesting its runtime preview.',`
		);
		lines.push('\t\t\t\t\t\t{ cause: error }');
		lines.push('\t\t\t\t\t);');
		lines.push('\t\t\t\t}),');
		lines.push('\t\t},');
	}

	lines.push('\t];', '');
	return `${lines.join('\n')}`;
}

async function loadExampleSpec(directory: string): Promise<ExampleSpec> {
	const moduleUrl = pathToFileURL(
		path.join(examplesDir, directory, 'src', 'example.ts')
	).href;
	const mod = (await import(moduleUrl)) as {
		default?: ExampleSpec;
	};
	if (!mod.default) {
		throw new Error(`Missing default example export for ${directory}`);
	}
	return mod.default;
}

function normalizeExampleKey(key: string): string {
	return key.startsWith('examples.') ? key.slice('examples.'.length) : key;
}

async function readJson<T>(filePath: string): Promise<T | null> {
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		return JSON.parse(raw) as T;
	} catch {
		return null;
	}
}

async function readFileIfExists(filePath: string): Promise<string | null> {
	try {
		return await fs.readFile(filePath, 'utf8');
	} catch {
		return null;
	}
}

async function formatGeneratedTypescript(
	targetPath: string,
	content: string
): Promise<string> {
	const tempDir = await fs.mkdtemp(
		path.join(os.tmpdir(), 'contractspec-generated-')
	);
	const tempPath = path.join(tempDir, path.basename(targetPath));

	try {
		await fs.writeFile(tempPath, content, 'utf8');
		const result = spawnSync(
			process.execPath,
			[
				path.join(repoRoot, 'scripts', 'biome.cjs'),
				'check',
				'--write',
				tempPath,
			],
			{ cwd: repoRoot, stdio: 'ignore' }
		);

		if (result.status !== 0) {
			return content;
		}

		return await fs.readFile(tempPath, 'utf8');
	} finally {
		await fs.rm(tempDir, { force: true, recursive: true });
	}
}

void main();
