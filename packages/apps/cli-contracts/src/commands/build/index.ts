import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import chalk from 'chalk';
import ora from 'ora';
import { basename, dirname, join, relative, resolve as resolvePath } from 'path';
import { AgentOrchestrator } from '../../ai/agents/index';
import { validateProvider } from '../../ai/providers';
import {
  generateHandlerTemplate,
  generateComponentTemplate,
  generateTestTemplate,
} from '../../templates/handler.template';
import { writeFileSafe } from '../../utils/fs';
import type { Config } from '../../utils/config';
import type { AgentResult } from '../../ai/agents/types';
import { generateWorkflowRunnerTemplate } from '../../templates/workflow-runner.template';

interface BuildOptions {
  outputDir?: string;
  provider?: string;
  model?: string;
  agentMode?: string;
  noTests?: boolean;
  noAgent?: boolean;
}

type SpecBuildType =
  | 'operation'
  | 'presentation'
  | 'form'
  | 'event'
  | 'workflow'
  | 'data-view'
  | 'telemetry'
  | 'migration'
  | 'experiment'
  | 'app-config'
  | 'integration'
  | 'knowledge'
  | 'unknown';

type GenerationTarget = 'handler' | 'component' | 'form';

type TestTarget = 'handler' | 'component';

export async function buildCommand(
  specFile: string,
  options: BuildOptions,
  config: Config
) {
  console.log(chalk.bold.blue('\n🏗️  Contract Builder\n'));

  if (!existsSync(specFile)) {
    console.error(chalk.red(`❌ Spec file not found: ${specFile}`));
    process.exit(1);
  }

  const specCode = await readFile(specFile, 'utf-8');
  const specType = detectSpecType(specFile, specCode);

  if (
    specType === 'event' ||
    specType === 'migration' ||
    specType === 'telemetry' ||
    specType === 'experiment' ||
    specType === 'app-config' ||
    specType === 'integration' ||
    specType === 'knowledge'
  ) {
    console.log(
      chalk.yellow('ℹ️  This spec type does not require build artifacts. Skipping.')
    );
    return;
  }

  if (specType === 'unknown') {
    console.log(
      chalk.yellow(
        '⚠️  Could not determine spec type automatically. Currently supported: operations, presentations, forms.'
      )
    );
    return;
  }

  let orchestrator: AgentOrchestrator | null = null;
  if (!options.noAgent) {
    orchestrator = new AgentOrchestrator(config);

    // For simple agent mode ensure provider credentials exist; otherwise fall back to templates
    if (config.agentMode === 'simple') {
      const providerStatus = await validateProvider(config);
      if (!providerStatus.success) {
        console.log(
          chalk.yellow(
            `⚠️  AI provider unavailable (${providerStatus.error}). Falling back to template generation.`
          )
        );
        orchestrator = null;
      }
    }
  }

  switch (specType) {
    case 'operation':
      await buildOperation(specFile, specCode, options, config, orchestrator);
      break;
    case 'presentation':
      await buildPresentation(specFile, specCode, options, config, orchestrator);
      break;
    case 'form':
      await buildForm(specFile, specCode, options, config, orchestrator);
      break;
    case 'workflow':
      await buildWorkflow(specFile, specCode, options, config);
      break;
    case 'data-view':
      await buildDataView(specFile, specCode, options, config);
      break;
    default:
      console.log(chalk.yellow('⚠️  Unsupported spec type for build command.'));
  }
}

async function buildOperation(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config,
  orchestrator: AgentOrchestrator | null
) {
  const specName = extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const operationKind = extractOperationKind(specCode) || 'command';
  const sanitizedName = toKebabCase(specName);
  const output = resolveOperationPaths(specFile, sanitizedName, options, config);

  const handlerResult = await generateWithAgent(
    orchestrator,
    config.agentMode,
    {
      label: 'handler',
      target: 'handler',
      specCode,
      targetPath: output.handlerPath,
    }
  );

  const handlerCode =
    handlerResult?.code ?? generateHandlerTemplate(specName, operationKind);

  await writeFileSafe(output.handlerPath, ensureTrailingNewline(handlerCode));
  console.log(chalk.green(`✅ Handler written to ${output.handlerPath}`));

  if (!options.noTests) {
    const testsResult = await generateTestsWithAgent(
      orchestrator,
      config.agentMode,
      {
        specCode,
        existingCode: handlerCode,
        target: 'handler',
      }
    );

    const testCode = testsResult?.code ?? generateTestTemplate(specName, 'handler');
    await writeFileSafe(output.testPath, ensureTrailingNewline(testCode));
    console.log(chalk.green(`✅ Tests written to ${output.testPath}`));
  }

  console.log(chalk.cyan('\n✨ Build complete!'));
}

async function buildPresentation(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config,
  orchestrator: AgentOrchestrator | null
) {
  const specName = extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const description = extractMetaValue(specCode, 'description') || 'Generated presentation component';
  const sanitizedName = toKebabCase(specName);
  const output = resolvePresentationPaths(specFile, sanitizedName, options, config);

  const componentResult = await generateWithAgent(
    orchestrator,
    config.agentMode,
    {
      label: 'component',
      target: 'component',
      specCode,
      targetPath: output.componentPath,
    }
  );

  const componentCode =
    componentResult?.code ?? generateComponentTemplate(specName, description);

  await writeFileSafe(output.componentPath, ensureTrailingNewline(componentCode));
  console.log(chalk.green(`✅ Component written to ${output.componentPath}`));

  if (!options.noTests) {
    const testsResult = await generateTestsWithAgent(
      orchestrator,
      config.agentMode,
      {
        specCode,
        existingCode: componentCode,
        target: 'component',
      }
    );

    const testCode = testsResult?.code ?? generateTestTemplate(specName, 'component');
    await writeFileSafe(output.testPath, ensureTrailingNewline(testCode));
    console.log(chalk.green(`✅ Tests written to ${output.testPath}`));
  }

  console.log(chalk.cyan('\n✨ Build complete!'));
}

async function buildForm(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config,
  orchestrator: AgentOrchestrator | null
) {
  const specName = extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const sanitizedName = toKebabCase(specName);
  const output = resolveFormPaths(specFile, sanitizedName, options, config);

  const formResult = await generateWithAgent(
    orchestrator,
    config.agentMode,
    {
      label: 'form component',
      target: 'form',
      specCode,
      targetPath: output.formPath,
    }
  );

  const formCode =
    formResult?.code ??
    `// ${specName} form implementation
// TODO: implement form based on specification
`;

  await writeFileSafe(output.formPath, ensureTrailingNewline(formCode));
  console.log(chalk.green(`✅ Form component written to ${output.formPath}`));

  if (!options.noTests) {
    const testsResult = await generateTestsWithAgent(
      orchestrator,
      config.agentMode,
      {
        specCode,
        existingCode: formCode,
        target: 'component',
      }
    );

    const testCode =
      testsResult?.code ??
      `import { describe, it, expect } from 'vitest';

// TODO: implement tests for ${specName} form component

describe('${toPascalCase(specName)}Form', () => {
  it('should render without crashing', () => {
    expect(true).toBe(true);
  });
});
`;

    await writeFileSafe(output.testPath, ensureTrailingNewline(testCode));
    console.log(chalk.green(`✅ Tests written to ${output.testPath}`));
  }

  console.log(chalk.cyan('\n✨ Build complete!'));
}

async function buildWorkflow(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config
) {
  const specName =
    extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const sanitizedName = toKebabCase(specName);
  const exportName =
    extractWorkflowExportName(specCode) ||
    `${toPascalCase(specName)}Workflow`;
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

async function buildDataView(
  specFile: string,
  specCode: string,
  options: BuildOptions,
  config: Config
) {
  const specName =
    extractMetaValue(specCode, 'name') || deriveNameFromFile(specFile);
  const sanitizedName = toKebabCase(specName);
  const exportName =
    extractDataViewExportName(specCode) ||
    `${toPascalCase(specName)}DataView`;
  const rendererName = `${toPascalCase(specName)}Renderer`;
  const rendererPath = resolveDataViewRendererPath(
    specFile,
    sanitizedName,
    options,
    config
  );
  const importPath = computeRelativeImport(specFile, rendererPath);
  const viewKind = extractDataViewKind(specCode) ?? 'table';

  const rendererCode = generateDataViewRendererTemplate({
    exportName,
    specImportPath: importPath,
    rendererName,
    viewKind,
  });

  await writeFileSafe(rendererPath, ensureTrailingNewline(rendererCode));
  console.log(
    chalk.green(`✅ Data view renderer written to ${rendererPath}`)
  );
  console.log(chalk.cyan('\n✨ Build complete!'));
}

async function generateWithAgent(
  orchestrator: AgentOrchestrator | null,
  agentMode: string,
  task: {
    label: string;
    target: GenerationTarget;
    specCode: string;
    targetPath?: string;
  }
): Promise<{ code: string; result: AgentResult } | null> {
  if (!orchestrator) {
    return null;
  }

  const spinner = ora(`🤖 Generating ${task.label} using ${agentMode} agent...`).start();
  try {
    const result = await orchestrator.generate(task.specCode, task.targetPath);

    if (result.success && result.code) {
      spinner.succeed(chalk.green(`Agent generated ${task.label}`));
      logAgentInsights(result);
      return { code: stripCode(result.code), result };
    }

    spinner.warn(
      chalk.yellow(`Agent could not produce a ${task.label}. Falling back to template.`)
    );
    logAgentInsights(result);
    return null;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Agent execution failed for ${task.label}: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    return null;
  }
}

async function generateTestsWithAgent(
  orchestrator: AgentOrchestrator | null,
  agentMode: string,
  task: {
    specCode: string;
    existingCode: string;
    target: TestTarget;
  }
): Promise<{ code: string; result: AgentResult } | null> {
  if (!orchestrator) {
    return null;
  }

  const spinner = ora(`🤖 Generating ${task.target} tests using ${agentMode} agent...`).start();
  try {
    const result = await orchestrator.generateTests(
      task.specCode,
      task.existingCode
    );

    if (result.success && result.code) {
      spinner.succeed(chalk.green(`Agent generated ${task.target} tests`));
      logAgentInsights(result);
      return { code: stripCode(result.code), result };
    }

    spinner.warn(
      chalk.yellow(`Agent could not produce ${task.target} tests. Falling back to template.`)
    );
    logAgentInsights(result);
    return null;
  } catch (error) {
    spinner.fail(
      chalk.red(
        `Agent execution failed for tests: ${error instanceof Error ? error.message : String(error)}`
      )
    );
    return null;
  }
}

function detectSpecType(specFile: string, specCode: string): SpecBuildType {
  const file = basename(specFile);
  if (file.includes('.contracts.') || /define(Command|Query)/.test(specCode)) {
    return 'operation';
  }
  if (file.includes('.presentation.') || /PresentationSpec/.test(specCode)) {
    return 'presentation';
  }
  if (file.includes('.form.') || /defineForm/.test(specCode)) {
    return 'form';
  }
  if (file.includes('.event.') || /defineEvent/.test(specCode)) {
    return 'event';
  }
  if (file.includes('.workflow.') || /WorkflowSpec/.test(specCode)) {
    return 'workflow';
  }
  if (file.includes('.data-view.') || /DataViewSpec/.test(specCode)) {
    return 'data-view';
  }
  if (file.includes('.telemetry.') || /TelemetrySpec/.test(specCode)) {
    return 'telemetry';
  }
  if (file.includes('.experiment.') || /ExperimentSpec/.test(specCode)) {
    return 'experiment';
  }
  if (file.includes('.app-config.') || /AppBlueprintSpec/.test(specCode)) {
    return 'app-config';
  }
  if (file.includes('.migration.') || /MigrationSpec/.test(specCode)) {
    return 'migration';
  }
  if (file.includes('.integration.') || /IntegrationSpec/.test(specCode)) {
    return 'integration';
  }
  if (file.includes('.knowledge.') || /KnowledgeSpaceSpec/.test(specCode)) {
    return 'knowledge';
  }
  return 'unknown';
}

function extractMetaValue(specCode: string, field: string): string | null {
  const regex = new RegExp(`${field}\\s*:\\s*['\"]([^'\"]+)['\"]`);
  const match = specCode.match(regex);
  if (match && typeof match[1] === 'string' && match[1].length > 0) {
    return match[1];
  }
  return null;
}

function extractOperationKind(specCode: string): 'command' | 'query' | null {
  const match = specCode.match(/kind\s*:\s*['\"](command|query)['\"]/);
  return match ? (match[1] as 'command' | 'query') : null;
}

function deriveNameFromFile(specFile: string): string {
  const file = basename(specFile, '.ts');
  return file.replace(/\.[^/.]+$/, '');
}

function resolveOperationPaths(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'handlers');
  const handlerDir = baseDir ?? join(dirname(specFile), '..', 'handlers');
  const normalizedHandlerDir = handlerDir.endsWith('handlers') ? handlerDir : join(handlerDir, 'handlers');

  return {
    handlerPath: join(normalizedHandlerDir, `${sanitizedName}.handler.ts`),
    testPath: join(normalizedHandlerDir, `${sanitizedName}.handler.test.ts`),
  };
}

function resolvePresentationPaths(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'components');
  const componentDir = baseDir ?? join(dirname(specFile), '..', 'components');
  const normalizedComponentDir = componentDir.endsWith('components')
    ? componentDir
    : join(componentDir, 'components');

  return {
    componentPath: join(normalizedComponentDir, `${sanitizedName}.tsx`),
    testPath: join(normalizedComponentDir, `${sanitizedName}.test.tsx`),
  };
}

function resolveFormPaths(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'forms');
  const formsDir = baseDir ?? join(dirname(specFile), '..', 'forms');
  const normalizedFormsDir = formsDir.endsWith('forms') ? formsDir : join(formsDir, 'forms');

  return {
    formPath: join(normalizedFormsDir, `${sanitizedName}.form.tsx`),
    testPath: join(normalizedFormsDir, `${sanitizedName}.form.test.tsx`),
  };
}

function resolveDataViewRendererPath(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'views');
  const targetDir = baseDir ?? dirname(specFile);
  return join(targetDir, `${sanitizedName}.renderer.tsx`);
}

function resolveWorkflowRunnerPath(
  specFile: string,
  sanitizedName: string,
  options: BuildOptions,
  config: Config
) {
  const baseDir = resolveBaseOutputDir(options, config, 'workflows');
  const targetDir = baseDir ?? dirname(specFile);
  return join(targetDir, `${sanitizedName}.runner.ts`);
}

function resolveBaseOutputDir(
  options: BuildOptions,
  config: Config,
  subdir: string
): string | null {
  const explicit = options.outputDir || config.outputDir;
  if (!explicit) {
    return null;
  }

  const resolved = explicit.startsWith('.')
    ? resolvePath(process.cwd(), explicit, subdir)
    : resolvePath(explicit, subdir);

  return resolved;
}

function stripCode(text: string): string {
  const codeBlock = text.match(/```[a-zA-Z]*\n([\s\S]*?)```/);
  if (codeBlock && codeBlock[1]) {
    return codeBlock[1].trim();
  }
  return text.trim();
}

function ensureTrailingNewline(code: string): string {
  return code.endsWith('\n') ? code : `${code}\n`;
}

function logAgentInsights(result?: AgentResult | null) {
  if (!result) {
    return;
  }

  if (result.warnings && result.warnings.length > 0) {
    console.log(chalk.yellow('\n  ⚠️  Agent warnings:'));
    result.warnings.forEach((warning) =>
      console.log(chalk.yellow(`     • ${warning}`))
    );
  }

  if (result.suggestions && result.suggestions.length > 0) {
    console.log(chalk.cyan('\n  💡 Agent suggestions:'));
    result.suggestions.forEach((suggestion) =>
      console.log(chalk.cyan(`     • ${suggestion}`))
    );
  }
}

function toKebabCase(str: string): string {
  return str
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function toPascalCase(str: string): string {
  return str
    .split(/[-_.]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export const __buildInternals = {
  detectSpecType,
  stripCode,
  ensureTrailingNewline,
};

function extractWorkflowExportName(specCode: string): string | null {
  const match = specCode.match(
    /export\s+const\s+(\w+)\s*:\s*WorkflowSpec/
  );
  return match ? match[1] ?? null : null;
}

function computeRelativeImport(specFile: string, runnerPath: string): string {
  const relativePath = relative(dirname(runnerPath), specFile)
    .replace(/\\/g, '/')
    .replace(/\.ts$/, '');
  return relativePath.startsWith('.') ? relativePath : `./${relativePath}`;
}

function extractDataViewExportName(specCode: string): string | null {
  const match = specCode.match(
    /export\s+const\s+(\w+)\s*:\s*DataViewSpec/
  );
  return match ? match[1] ?? null : null;
}

function extractDataViewKind(specCode: string): string | null {
  const match = specCode.match(
    /view\s*:\s*{[\s\S]*?kind:\s*['"]([^'"]+)['"]/
  );
  return match ? match[1] ?? null : null;
}

function generateDataViewRendererTemplate({
  exportName,
  specImportPath,
  rendererName,
  viewKind,
}: {
  exportName: string;
  specImportPath: string;
  rendererName: string;
  viewKind: string;
}) {
  return `'use client';

import * as React from 'react';
import { DataViewRenderer } from '@lssm/lib.design-system';
import { ${exportName} } from '${specImportPath}';

export interface ${rendererName}Props {
  items?: Record<string, unknown>[];
  item?: Record<string, unknown> | null;
  className?: string;
  renderActions?: (item: Record<string, unknown>) => React.ReactNode;
  onSelect?: (item: Record<string, unknown>) => void;
  onRowClick?: (item: Record<string, unknown>) => void;
  headerActions?: React.ReactNode;
  emptyState?: React.ReactNode;
  footer?: React.ReactNode;
}

/**
 * Auto-generated renderer for the "${viewKind}" data view.
 * Customize as needed for app-specific behaviour.
 */
export function ${rendererName}({
  items = [],
  item = null,
  className,
  renderActions,
  onSelect,
  onRowClick,
  headerActions,
  emptyState,
  footer,
}: ${rendererName}Props) {
  return (
    <DataViewRenderer
      spec={${exportName}}
      items={items}
      item={item}
      className={className}
      renderActions={renderActions}
      onSelect={onSelect}
      onRowClick={onRowClick}
      headerActions={headerActions}
      emptyState={emptyState}
      footer={footer}
    />
  );
}
`;
}
