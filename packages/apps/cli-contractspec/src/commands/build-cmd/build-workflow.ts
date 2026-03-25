import chalk from 'chalk';
import {
	generateWorkflowDevkitFollowUpRouteTemplate,
	generateWorkflowDevkitGenericTemplate,
	generateWorkflowDevkitStartRouteTemplate,
	generateWorkflowDevkitStreamRouteTemplate,
	generateWorkflowDevkitWorkflowTemplate,
} from '../../templates/workflow-devkit.template';
import { generateWorkflowRunnerTemplate } from '../../templates/workflow-runner.template';
import type { Config } from '../../utils/config';
import { writeFileSafe } from '../../utils/fs';
import { ensureTrailingNewline } from './agent-generation';
import { toKebabCase, toPascalCase } from './naming';
import {
	computeRelativeImport,
	resolveWorkflowArtifactPaths,
	resolveWorkflowRunnerPath,
} from './paths';
import {
	deriveNameFromFile,
	extractMetaValue,
	extractWorkflowExportName,
} from './spec-detect';
import type { BuildOptions } from './types';

export async function buildWorkflow(
	specFile: string,
	specCode: string,
	options: BuildOptions,
	config: Config
) {
	const specName =
		extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
	const sanitizedName = toKebabCase(specName);
	const exportName =
		extractWorkflowExportName(specCode) || `${toPascalCase(specName)}Workflow`;
	const runnerName = `${toPascalCase(specName)}Runner`;
	const runnerPath = resolveWorkflowRunnerPath(
		specFile,
		sanitizedName,
		options,
		config
	);
	const importPath = computeRelativeImport(specFile, runnerPath);

	const runnerCode = generateWorkflowRunnerTemplate({
		exportName,
		specImportPath: importPath,
		runnerName,
		workflowName: specName,
	});

	await writeFileSafe(runnerPath, ensureTrailingNewline(runnerCode));

	console.log(chalk.green(`✅ Runner written to ${runnerPath}`));

	const workflowDevkitEnabled =
		/workflowDevkit\s*:/.test(specCode) ||
		/['"]workflow-devkit['"]\s*:\s*true/.test(specCode);
	if (workflowDevkitEnabled) {
		const workflowFunctionName = `${toPascalCase(specName)}WorkflowDevkit`;
		const artifactPaths = resolveWorkflowArtifactPaths(
			specFile,
			sanitizedName,
			options,
			config
		);
		const workflowModuleCode = generateWorkflowDevkitWorkflowTemplate({
			exportName,
			specImportPath: importPath,
			workflowFunctionName,
		});
		await writeFileSafe(
			artifactPaths.workflowModulePath,
			ensureTrailingNewline(workflowModuleCode)
		);

		const workflowModuleImportPath = computeRelativeImport(
			artifactPaths.workflowModulePath,
			artifactPaths.startRoutePath
		);
		await writeFileSafe(
			artifactPaths.startRoutePath,
			ensureTrailingNewline(
				generateWorkflowDevkitStartRouteTemplate(
					workflowModuleImportPath,
					workflowFunctionName
				)
			)
		);
		await writeFileSafe(
			artifactPaths.followUpRoutePath,
			ensureTrailingNewline(generateWorkflowDevkitFollowUpRouteTemplate())
		);
		await writeFileSafe(
			artifactPaths.streamRoutePath,
			ensureTrailingNewline(generateWorkflowDevkitStreamRouteTemplate())
		);
		const workflowModuleImportForGeneric = computeRelativeImport(
			artifactPaths.workflowModulePath,
			artifactPaths.genericBootstrapPath
		);
		await writeFileSafe(
			artifactPaths.genericBootstrapPath,
			ensureTrailingNewline(
				generateWorkflowDevkitGenericTemplate(
					workflowModuleImportForGeneric,
					workflowFunctionName
				)
			)
		);

		console.log(
			chalk.green(
				`✅ Workflow DevKit artifacts written for ${workflowFunctionName}`
			)
		);
	}

	console.log(chalk.cyan('\n✨ Build complete!'));
}
