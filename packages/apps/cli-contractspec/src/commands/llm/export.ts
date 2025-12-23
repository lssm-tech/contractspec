/**
 * LLM Export Command
 *
 * Export specs to markdown in various formats for LLM consumption.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import {
  type LLMExportFormat,
  operationSpecToAgentPrompt,
  operationSpecToContextMarkdown,
  operationSpecToFullMarkdown,
} from '@lssm/lib.contracts/llm';

async function loadSpec(
  specPath: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<{ spec: any; code: string }> {
  const fullPath = resolve(process.cwd(), specPath);

  if (!existsSync(fullPath)) {
    throw new Error(`Spec file not found: ${specPath}`);
  }

  const code = readFileSync(fullPath, 'utf-8');

  // Dynamic import the spec
  try {
    const module = await import(fullPath);
    // Find the first exported spec-like object
    for (const [, value] of Object.entries(module)) {
      if (
        value &&
        typeof value === 'object' &&
        'meta' in value &&
        'io' in value
      ) {
        return { spec: value, code };
      }
    }
    throw new Error('No spec found in module');
  } catch (error) {
    throw new Error(
      `Failed to load spec: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const exportLLMCommand = new Command('export')
  .description('Export a spec to markdown for LLM consumption')
  .argument('<spec-file>', 'Path to the spec file')
  .option(
    '-f, --format <format>',
    'Export format: context, full, prompt',
    'full'
  )
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .option(
    '--task <type>',
    'Task type for prompt format: implement, test, refactor, review',
    'implement'
  )
  .option('--include-schemas', 'Include JSON schemas in output', true)
  .option('--include-examples', 'Include examples in output', true)
  .option('--include-scenarios', 'Include acceptance scenarios in output', true)
  .action(async (specFile, options) => {
    try {
      console.log(chalk.blue(`\n📄 Exporting ${specFile}...\n`));

      const { spec } = await loadSpec(specFile);
      const format = options.format as LLMExportFormat;

      let markdown: string;

      switch (format) {
        case 'context':
          markdown = operationSpecToContextMarkdown(spec);
          break;
        case 'prompt':
          markdown = operationSpecToAgentPrompt(spec, {
            taskType: options.task as
              | 'implement'
              | 'test'
              | 'refactor'
              | 'review',
          });
          break;
        case 'full':
        default:
          markdown = operationSpecToFullMarkdown(spec, {
            format: 'full',
            includeSchemas: options.includeSchemas,
            includeExamples: options.includeExamples,
            includeScenarios: options.includeScenarios,
          });
          break;
      }

      if (options.output) {
        const outputPath = resolve(process.cwd(), options.output);
        writeFileSync(outputPath, markdown, 'utf-8');
        console.log(chalk.green(`✓ Exported to ${options.output}`));
        console.log(chalk.gray(`  Format: ${format}`));
        console.log(chalk.gray(`  Words: ${markdown.split(/\s+/).length}`));
      } else {
        console.log(markdown);
      }

      console.log('');
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
