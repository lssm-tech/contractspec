import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import {
  createNodeAdapters,
  generateDocsFromSpecs,
} from '@contractspec/bundle.workspace';

export function createDocsCommand(): Command {
  return new Command('docs')
    .description('Generate documentation from specs (DocBlock)')
    .argument('[files...]', 'Spec files to process (glob patterns allowed)')
    .option('-o, --output <dir>', 'Output directory', 'docs')
    .option(
      '-f, --format <format>',
      'Output format (markdown, html, json)',
      'markdown'
    )
    .action(async (files: string[], options) => {
      try {
        console.log(chalk.blue('\n📚 Generating documentation...\n'));

        // Default to all known spec files if none provided
        if (!files || files.length === 0) {
          files = [
            '**/*.spec.ts',
            '**/*.feature.ts',
            '**/*.contract.ts',
            '**/*.operation.ts',
            '**/*.event.ts',
            '**/*.presentation.ts',
          ];
        }

        const adapters = createNodeAdapters({ cwd: process.cwd() });
        const fs = adapters.fs;

        // Resolve globs
        const resolvedFiles: string[] = [];
        for (const pattern of files) {
          const matches = await fs.glob({ pattern });
          resolvedFiles.push(...matches.map((m) => resolve(process.cwd(), m)));
        }

        if (resolvedFiles.length === 0) {
          console.warn(chalk.yellow('No spec files found matching patterns.'));
          return;
        }

        const result = await generateDocsFromSpecs(
          resolvedFiles,
          {
            outputDir: resolve(process.cwd(), options.output),
            format: options.format as 'markdown' | 'html' | 'json',
          },
          adapters
        );

        console.log(
          chalk.green(
            `\n✨ Generated ${result.count} documentation blocks in ${options.output}`
          )
        );
      } catch (error) {
        console.error(
          chalk.red('\n❌ Error generating docs:'),
          error instanceof Error ? error.message : String(error)
        );
        process.exit(1);
      }
    });
}
