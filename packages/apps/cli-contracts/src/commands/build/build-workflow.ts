import chalk from 'chalk';
import type { Config } from '../../utils/config';
import { writeFileSafe } from '../../utils/fs';
import { generateWorkflowRunnerTemplate } from '../../templates/workflow-runner.template';
import { ensureTrailingNewline } from './agent-generation';
import { toKebabCase, toPascalCase } from './naming';
import { computeRelativeImport, resolveWorkflowRunnerPath } from './paths';
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

  console.log(chalk.cyan('\n✨ Build complete!'));
}




