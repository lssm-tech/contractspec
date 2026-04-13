/**
 * Build/scaffold service for generating implementation files from specs.
 *
 * Uses templates from @contractspec/module.workspace to generate
 * handler, component, and test skeletons without requiring AI.
 */

import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec';
import {
	detectAuthoringTarget,
	generateComponentTemplate,
	generateHandlerTemplate,
	generateTestTemplate,
	getAuthoringTargetDefinition,
	inferSpecTypeFromFilePath,
	type SpecScanResult,
	scanSpecSource,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';
import {
	generateDataViewRendererTemplate,
	generateWorkflowDevkitFollowUpRouteTemplate,
	generateWorkflowDevkitGenericTemplate,
	generateWorkflowDevkitStartRouteTemplate,
	generateWorkflowDevkitStreamRouteTemplate,
	generateWorkflowDevkitWorkflowTemplate,
	generateWorkflowRunnerTemplate,
} from '../templates';
import {
	createPackageTargetSpecSource,
	ensurePackageScaffold,
} from './package-scaffold';

/**
 * Build target types.
 */
export type BuildTarget =
	| 'handler'
	| 'component'
	| 'test'
	| 'form'
	| 'workflow-runner'
	| 'data-view-renderer'
	| 'package-scaffold';

/**
 * Options for building from a spec.
 */
export interface BuildSpecOptions {
	/**
	 * Which artifacts to generate.
	 */
	targets?: BuildTarget[];

	/**
	 * Override output directory.
	 */
	outputDir?: string;

	/**
	 * Whether to overwrite existing files.
	 */
	overwrite?: boolean;

	/**
	 * Skip writing files (dry run).
	 */
	dryRun?: boolean;

	/**
	 * Include target-specific test artifacts in the default build plan.
	 */
	includeTests?: boolean;

	/**
	 * Optional runtime generation strategy supplied by higher-level callers.
	 */
	runtimeGeneration?: RuntimeGenerationStrategy;
}

export type RuntimeArtifactKind = 'handler' | 'component' | 'form';
export type RuntimeTestKind = 'handler' | 'component';

export interface RuntimeArtifactGenerationInput {
	kind: RuntimeArtifactKind;
	specCode: string;
	outputPath: string;
	fallbackCode: string;
}

export interface RuntimeTestGenerationInput {
	kind: RuntimeTestKind;
	specCode: string;
	outputPath: string;
	existingCode: string;
	fallbackCode: string;
}

export interface RuntimeGenerationStrategy {
	generateArtifact?: (
		input: RuntimeArtifactGenerationInput
	) => Promise<string | null | undefined>;
	generateTest?: (
		input: RuntimeTestGenerationInput
	) => Promise<string | null | undefined>;
}

/**
 * Result of a single build target.
 */
export interface BuildTargetResult {
	target: BuildTarget;
	outputPath: string;
	success: boolean;
	skipped?: boolean;
	error?: string;
	generatedCode?: string;
}

/**
 * Result of building from a spec.
 */
export interface BuildSpecResult {
	specPath: string;
	specInfo: SpecScanResult;
	targetId: string;
	results: BuildTargetResult[];
}

/**
 * Build implementation files from a spec.
 */
export async function buildSpec(
	specPath: string,
	adapters: {
		fs: FsAdapter;
		logger: LoggerAdapter;
		workspace?: typeof import('@contractspec/module.workspace');
	},
	config: ResolvedContractsrcConfig,
	options: BuildSpecOptions = {}
): Promise<BuildSpecResult> {
	const { fs, logger, workspace } = adapters;

	// Use injected modules or defaults
	const scan = workspace?.scanSpecSource ?? scanSpecSource;
	const inferType =
		workspace?.inferSpecTypeFromFilePath ?? inferSpecTypeFromFilePath;
	const genHandler =
		workspace?.generateHandlerTemplate ?? generateHandlerTemplate;
	const genComponent =
		workspace?.generateComponentTemplate ?? generateComponentTemplate;
	const genTest = workspace?.generateTestTemplate ?? generateTestTemplate;

	const {
		targets = undefined,
		outputDir = config.outputDir,
		overwrite = false,
		dryRun = false,
		includeTests = false,
		runtimeGeneration,
	} = options;

	// Read and scan spec
	const specCode = await fs.readFile(specPath);
	const specInfo = scan(specCode, specPath);
	const detectedTarget = detectAuthoringTarget(specCode, specPath);
	const targetId =
		detectedTarget === 'unknown' ? inferType(specPath) : detectedTarget;
	const materializationTargets =
		targets ?? resolveDefaultBuildTargets(targetId, { includeTests });

	logger.info(`Building from spec: ${specPath}`, { targetId });

	const results: BuildTargetResult[] = [];
	const generatedCodeByTarget: Partial<Record<BuildTarget, string>> = {};

	for (const target of materializationTargets) {
		try {
			const result = await buildTarget(
				target,
				specPath,
				specCode,
				specInfo,
				targetId,
				{ fs, logger },
				outputDir,
				overwrite,
				dryRun,
				runtimeGeneration,
				generatedCodeByTarget,
				{ genHandler, genComponent, genTest }
			);
			results.push(result);
			if (result.success && result.generatedCode) {
				generatedCodeByTarget[target] = result.generatedCode;
			}
		} catch (error) {
			results.push({
				target,
				outputPath: '',
				success: false,
				error: error instanceof Error ? error.message : String(error),
				skipped: false, // Default to false unless overridden
			});
		}
	}

	return {
		specPath,
		specInfo,
		targetId,
		results,
	};
}

/**
 * Build a single target from a spec.
 */
async function buildTarget(
	target: BuildTarget,
	specPath: string,
	specCode: string,
	specInfo: SpecScanResult,
	targetId: string,
	adapters: { fs: FsAdapter; logger: LoggerAdapter },
	outputDir: string,
	overwrite: boolean,
	dryRun: boolean,
	runtimeGeneration: RuntimeGenerationStrategy | undefined,
	generatedCodeByTarget: Partial<Record<BuildTarget, string>>,
	generators: {
		genHandler: typeof generateHandlerTemplate;
		genComponent: typeof generateComponentTemplate;
		genTest: typeof generateTestTemplate;
	}
): Promise<BuildTargetResult> {
	const { fs, logger } = adapters;
	const { genHandler, genComponent, genTest } = generators;

	let code: string;
	let outputPath: string;
	let additionalOutputs: Array<{ path: string; code: string }> = [];

	switch (target) {
		case 'handler': {
			if (targetId !== 'operation') {
				return {
					target,
					outputPath: '',
					success: false,
					skipped: true,
					error: `Handler generation only supported for operation specs (got ${targetId})`,
				};
			}

			const kind =
				specInfo.kind === 'command' || specInfo.kind === 'query'
					? specInfo.kind
					: 'command';

			const fallbackCode = genHandler(
				resolveSpecDisplayName(specCode, specInfo, specPath),
				kind
			);
			outputPath = resolveOutputPath(
				specPath,
				outputDir,
				'handlers',
				resolveSpecDisplayName(specCode, specInfo, specPath),
				'.handler.ts',
				adapters.fs
			);
			code =
				(await runtimeGeneration?.generateArtifact?.({
					kind: 'handler',
					specCode,
					outputPath,
					fallbackCode,
				})) ?? fallbackCode;
			break;
		}

		case 'component': {
			if (targetId !== 'presentation') {
				return {
					target,
					outputPath: '',
					success: false,
					skipped: true,
					error: `Component generation only supported for presentation specs (got ${targetId})`,
				};
			}

			const fallbackCode = genComponent(
				resolveSpecDisplayName(specCode, specInfo, specPath),
				specInfo.description ?? ''
			);
			outputPath = resolveOutputPath(
				specPath,
				outputDir,
				'components',
				resolveSpecDisplayName(specCode, specInfo, specPath),
				'.tsx',
				adapters.fs
			);
			code =
				(await runtimeGeneration?.generateArtifact?.({
					kind: 'component',
					specCode,
					outputPath,
					fallbackCode,
				})) ?? fallbackCode;
			break;
		}

		case 'test': {
			const testType = targetId === 'operation' ? 'handler' : 'component';
			const existingCode =
				targetId === 'operation'
					? (generatedCodeByTarget.handler ?? '')
					: targetId === 'presentation'
						? (generatedCodeByTarget.component ?? '')
						: targetId === 'form'
							? (generatedCodeByTarget.form ?? '')
							: '';
			const fallbackCode = genTest(
				resolveSpecDisplayName(specCode, specInfo, specPath),
				testType
			);
			outputPath = resolveOutputPath(
				specPath,
				outputDir,
				'__tests__',
				resolveSpecDisplayName(specCode, specInfo, specPath),
				'.test.ts',
				adapters.fs
			);
			code =
				(await runtimeGeneration?.generateTest?.({
					kind: testType,
					specCode,
					outputPath,
					existingCode,
					fallbackCode,
				})) ?? fallbackCode;
			break;
		}

		case 'form': {
			if (targetId !== 'form') {
				return {
					target,
					outputPath: '',
					success: false,
					skipped: true,
					error: `Form generation only supported for form specs (got ${targetId})`,
				};
			}

			const fallbackCode = `import * as React from "react";

export interface ${toPascalCase(resolveSpecDisplayName(specCode, specInfo, specPath))}Props {
  className?: string;
}

export function ${toPascalCase(resolveSpecDisplayName(specCode, specInfo, specPath))}Form({
  className,
}: ${toPascalCase(resolveSpecDisplayName(specCode, specInfo, specPath))}Props) {
  return <form className={className}>TODO: implement ${resolveSpecDisplayName(specCode, specInfo, specPath)}</form>;
}
`;
			outputPath = resolveOutputPath(
				specPath,
				outputDir,
				'forms',
				resolveSpecDisplayName(specCode, specInfo, specPath),
				'.form.tsx',
				adapters.fs
			);
			code =
				(await runtimeGeneration?.generateArtifact?.({
					kind: 'form',
					specCode,
					outputPath,
					fallbackCode,
				})) ?? fallbackCode;
			break;
		}

		case 'workflow-runner': {
			if (targetId !== 'workflow') {
				return {
					target,
					outputPath: '',
					success: false,
					skipped: true,
					error: `Workflow runners only supported for workflow specs (got ${targetId})`,
				};
			}

			const specDisplayName = resolveSpecDisplayName(
				specCode,
				specInfo,
				specPath
			);
			const exportName =
				extractWorkflowExportName(specCode) ??
				`${toPascalCase(specDisplayName)}Workflow`;
			const runnerName = `${toPascalCase(specDisplayName)}Runner`;
			const sanitizedName = toKebabCase(specDisplayName);
			outputPath = resolveOutputPath(
				specPath,
				outputDir,
				'workflows',
				specDisplayName,
				'.runner.ts',
				adapters.fs
			);
			code = generateWorkflowRunnerTemplate({
				exportName,
				specImportPath: resolveRelativeSpecImport(
					adapters.fs,
					outputPath,
					specPath
				),
				runnerName,
				workflowName: specDisplayName,
			});
			if (isWorkflowDevkitEnabled(specCode)) {
				const workflowFunctionName = `${toPascalCase(specDisplayName)}WorkflowDevkit`;
				const workflowModulePath = resolveSiblingOutputPath(
					adapters.fs,
					outputPath,
					`${sanitizedName}.workflow-devkit.ts`
				);
				const startRoutePath = resolveSiblingOutputPath(
					adapters.fs,
					outputPath,
					`${sanitizedName}.workflow-devkit.start.route.ts`
				);
				const followUpRoutePath = resolveSiblingOutputPath(
					adapters.fs,
					outputPath,
					`${sanitizedName}.workflow-devkit.follow-up.route.ts`
				);
				const streamRoutePath = resolveSiblingOutputPath(
					adapters.fs,
					outputPath,
					`${sanitizedName}.workflow-devkit.stream.route.ts`
				);
				const genericBootstrapPath = resolveSiblingOutputPath(
					adapters.fs,
					outputPath,
					`${sanitizedName}.workflow-devkit.generic.ts`
				);
				additionalOutputs = [
					{
						path: workflowModulePath,
						code: generateWorkflowDevkitWorkflowTemplate({
							exportName,
							specImportPath: resolveRelativeSpecImport(
								adapters.fs,
								workflowModulePath,
								specPath
							),
							workflowFunctionName,
						}),
					},
					{
						path: startRoutePath,
						code: generateWorkflowDevkitStartRouteTemplate(
							resolveRelativeImport(
								adapters.fs,
								startRoutePath,
								workflowModulePath
							),
							workflowFunctionName
						),
					},
					{
						path: followUpRoutePath,
						code: generateWorkflowDevkitFollowUpRouteTemplate(),
					},
					{
						path: streamRoutePath,
						code: generateWorkflowDevkitStreamRouteTemplate(),
					},
					{
						path: genericBootstrapPath,
						code: generateWorkflowDevkitGenericTemplate(
							resolveRelativeImport(
								adapters.fs,
								genericBootstrapPath,
								workflowModulePath
							),
							workflowFunctionName
						),
					},
				];
			}
			break;
		}

		case 'data-view-renderer': {
			if (targetId !== 'data-view') {
				return {
					target,
					outputPath: '',
					success: false,
					skipped: true,
					error: `Data view renderers only supported for data-view specs (got ${targetId})`,
				};
			}

			const specDisplayName = resolveSpecDisplayName(
				specCode,
				specInfo,
				specPath
			);
			const exportName =
				extractDataViewExportName(specCode) ??
				`${toPascalCase(specDisplayName)}DataView`;
			const rendererName = `${toPascalCase(specDisplayName)}Renderer`;
			outputPath = resolveOutputPath(
				specPath,
				outputDir,
				'data-views',
				specDisplayName,
				'.renderer.tsx',
				adapters.fs
			);
			code = generateDataViewRendererTemplate({
				exportName,
				specImportPath: resolveRelativeSpecImport(
					adapters.fs,
					outputPath,
					specPath
				),
				rendererName,
				viewKind: extractDataViewKind(specCode) ?? 'table',
			});
			break;
		}

		case 'package-scaffold': {
			if (
				targetId !== 'module-bundle' &&
				targetId !== 'builder-spec' &&
				targetId !== 'provider-spec'
			) {
				return {
					target,
					outputPath: '',
					success: false,
					skipped: true,
					error: `Package scaffold generation only supported for package targets (got ${targetId})`,
				};
			}

			if (dryRun) {
				const packageRoot = resolvePackageRoot(specPath);
				logger.info(`[dry-run] Would scaffold package: ${packageRoot}`);
				return {
					target,
					outputPath: packageRoot,
					success: true,
				};
			}

			const scaffoldCode =
				specCode.trim().length > 0
					? specCode
					: createPackageTargetSpecSource({
							target: targetId,
							key: specInfo.key ?? adapters.fs.basename(specPath),
							title: specInfo.key ?? adapters.fs.basename(specPath),
							description:
								specInfo.description ??
								getAuthoringTargetDefinition(targetId).title,
							exportName: toPascalCase(
								specInfo.key ?? adapters.fs.basename(specPath)
							),
						});
			const scaffoldResult = await ensurePackageScaffold(adapters.fs, {
				target: targetId,
				specPath,
				specCode: scaffoldCode,
				overwrite,
			});
			outputPath = scaffoldResult.packageRoot;
			logger.info(`Generated package scaffold: ${outputPath}`);
			return {
				target,
				outputPath,
				success: true,
			};
		}

		default:
			return {
				target,
				outputPath: '',
				success: false,
				error: `Unknown target: ${target}`,
			};
	}

	const outputs = [{ path: outputPath, code }, ...additionalOutputs];
	const existingOutput = overwrite
		? undefined
		: await findExistingOutput(outputs, fs);
	if (existingOutput) {
		return {
			target,
			outputPath: existingOutput,
			success: false,
			skipped: true,
			error: 'File already exists (use overwrite option)',
		};
	}

	if (dryRun) {
		for (const output of outputs) {
			logger.info(`[dry-run] Would write: ${output.path}`);
		}
		return {
			target,
			outputPath,
			success: true,
			generatedCode: outputs[0]?.code,
		};
	}

	for (const output of outputs) {
		await fs.mkdir(fs.dirname(output.path));
		await fs.writeFile(output.path, ensureTrailingNewline(output.code));
		logger.info(`Generated: ${output.path}`);
	}

	return {
		target,
		outputPath,
		success: true,
	};
}

/**
 * Detect default targets based on spec type.
 */
export function resolveDefaultBuildTargets(
	targetId: string,
	options: { includeTests: boolean }
): BuildTarget[] {
	switch (targetId) {
		case 'operation':
			return options.includeTests ? ['handler', 'test'] : ['handler'];
		case 'presentation':
			return options.includeTests ? ['component', 'test'] : ['component'];
		case 'form':
			return options.includeTests ? ['form', 'test'] : ['form'];
		case 'workflow':
			return ['workflow-runner'];
		case 'data-view':
			return ['data-view-renderer'];
		case 'module-bundle':
		case 'builder-spec':
		case 'provider-spec':
			return ['package-scaffold'];
		default:
			return [];
	}
}

/**
 * Resolve output path for generated file.
 */
function resolveOutputPath(
	specPath: string,
	outputDir: string,
	subdir: string,
	specName: string,
	extension: string,
	fs: FsAdapter
): string {
	const sanitizedName = toKebabCase(specName.split('.').pop() ?? 'unknown');

	let baseDir: string;
	if (outputDir.startsWith('.')) {
		// Relative to spec file location
		baseDir = fs.resolve(fs.dirname(specPath), '..', outputDir, subdir);
	} else {
		// Absolute or relative to cwd
		baseDir = fs.resolve(outputDir, subdir);
	}

	return fs.join(baseDir, `${sanitizedName}${extension}`);
}

async function findExistingOutput(
	outputs: Array<{ path: string; code: string }>,
	fs: FsAdapter
) {
	for (const output of outputs) {
		if (await fs.exists(output.path)) {
			return output.path;
		}
	}
	return undefined;
}

/**
 * Convert string to kebab-case.
 */
function toKebabCase(str: string): string {
	return str
		.replace(/\./g, '-')
		.replace(/([a-z])([A-Z])/g, '$1-$2')
		.toLowerCase();
}

function toPascalCase(str: string): string {
	return toKebabCase(str)
		.split('-')
		.filter(Boolean)
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join('');
}

function stripExtension(fileName: string): string {
	return fileName.replace(/\.[^.]+$/, '');
}

function resolvePackageRoot(specPath: string) {
	const normalized = specPath.replaceAll('\\', '/');
	const markerIndex = normalized.lastIndexOf('/src/');
	return markerIndex === -1
		? normalized.replace(/\/[^/]+$/, '')
		: normalized.slice(0, markerIndex);
}

function resolveRelativeSpecImport(
	fs: FsAdapter,
	outputPath: string,
	specPath: string
) {
	const relativePath = stripExtension(
		fs.relative(fs.dirname(outputPath), specPath)
	);
	return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function resolveRelativeImport(
	fs: FsAdapter,
	fromPath: string,
	toPath: string
) {
	const relativePath = stripExtension(
		fs.relative(fs.dirname(fromPath), toPath)
	);
	return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function resolveSiblingOutputPath(
	fs: FsAdapter,
	basePath: string,
	fileName: string
) {
	return fs.join(fs.dirname(basePath), fileName);
}

function resolveSpecDisplayName(
	specCode: string,
	specInfo: SpecScanResult,
	specPath: string
) {
	return (
		extractMetaValue(specCode, 'name') ??
		specInfo.key ??
		stripExtension(fsBaseName(specPath))
	);
}

function extractMetaValue(specCode: string, field: string) {
	const regex = new RegExp(`${field}\\s*:\\s*['"]([^'"]+)['"]`);
	const match = specCode.match(regex);
	return match?.[1] ?? null;
}

function extractWorkflowExportName(specCode: string) {
	const match = specCode.match(
		/export\\s+const\\s+(\\w+)\\s*:\\s*WorkflowSpec/
	);
	return match?.[1] ?? null;
}

function extractDataViewExportName(specCode: string) {
	const match = specCode.match(
		/export\\s+const\\s+(\\w+)\\s*:\\s*DataViewSpec/
	);
	return match?.[1] ?? null;
}

function extractDataViewKind(specCode: string) {
	const match = specCode.match(
		/view\\s*:\\s*{[\\s\\S]*?kind:\\s*['"]([^'"]+)['"]/
	);
	return match?.[1] ?? null;
}

function isWorkflowDevkitEnabled(specCode: string) {
	return (
		/workflowDevkit\s*:/.test(specCode) ||
		/['"]workflow-devkit['"]\s*:\s*true/.test(specCode)
	);
}

function ensureTrailingNewline(code: string) {
	return code.endsWith('\n') ? code : `${code}\n`;
}

function fsBaseName(specPath: string) {
	return specPath.replaceAll('\\', '/').split('/').pop() ?? specPath;
}
