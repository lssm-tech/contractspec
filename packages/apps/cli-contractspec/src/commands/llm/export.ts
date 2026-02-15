/**
 * LLM Export Command
 *
 * Export specs to markdown in various formats for LLM consumption.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { type LLMExportFormat } from '@contractspec/lib.contracts-spec/llm';
import {
  loadSpecFromSource,
  specToMarkdown,
} from '@contractspec/module.workspace';

import { generateFeatureContextMarkdown } from '@contractspec/bundle.workspace';

export const exportLLMCommand = new Command('export')
  .description('Export a spec to markdown for LLM consumption')
  .argument('<spec-file>', 'Path to the spec file')
  .option(
    '-f, --format <format>',
    'Export format: context, full, prompt',
    'full'
  )
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .action(async (specFile, options) => {
    try {
      console.log(chalk.blue(`\n📄 Exporting ${specFile}...\n`));

      const fullPath = resolve(process.cwd(), specFile);
      if (!existsSync(fullPath)) {
        throw new Error(`File not found: ${specFile}`);
      }

      // Load with static analysis
      const specs = await loadSpecFromSource(fullPath);
      if (specs.length === 0) {
        throw new Error('No spec definitions found');
      }

      const spec = specs[0];
      if (!spec) {
        throw new Error('No spec definitions found');
      }
      const format = options.format as LLMExportFormat;

      let markdown: string;
      if (spec.specType === 'feature' && format === 'full') {
        // Use createNodeAdapters to get full filesystem access
        const { createNodeAdapters } =
          await import('@contractspec/bundle.workspace');
        const nodeAdapters = createNodeAdapters({ cwd: process.cwd() });
        markdown = await generateFeatureContextMarkdown(spec, nodeAdapters);
      } else {
        markdown = specToMarkdown(spec, format);
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
