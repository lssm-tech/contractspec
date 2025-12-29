import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { generateDocsFromSpecs } from '@contractspec/bundle.workspace';
import { createNodeAdapters } from '@contractspec/bundle.workspace';

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
            'src/**/*.spec.ts',
            'src/**/*.feature.ts',
            'src/**/*.contract.ts',
            'src/**/*.operation.ts',
            'src/**/*.event.ts',
            'src/**/*.presentation.ts',
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
