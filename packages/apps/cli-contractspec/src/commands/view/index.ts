import { Command } from 'commander';
import chalk from 'chalk';
import {
  createNodeAdapters,
  generateViews,
  type GenerateViewsResult,
  type ViewAudience,
} from '@contractspec/bundle.workspace';

/**
 * Handle result status and log appropriate messages.
 * Returns true if processing should continue, false if should exit.
 */
function handleResultStatus(
  result: GenerateViewsResult,
  baseline?: string
): boolean {
  switch (result.status) {
    case 'no_changes':
      console.error(chalk.green('No contract changes detected.'));
      return false;

    case 'no_changed_specs':
      if (result.changedFilesCount !== undefined) {
        console.error(
          chalk.gray(
            `Found ${result.changedFilesCount} changed files since ${baseline}.`
          )
        );
      }
      console.error(chalk.green('No contract specs changed.'));
      return false;

    case 'no_specs':
      console.error(chalk.yellow('No specs found.'));
      return false;

    case 'success':
      if (baseline && result.changedFilesCount !== undefined) {
        console.error(
          chalk.gray(
            `Found ${result.changedFilesCount} changed files since ${baseline}.`
          )
        );
        console.error(
          chalk.gray(`${result.views.length} contract specs changed.`)
        );
      }
      return true;
  }
}

export const viewCommand = new Command('view')
  .description('Generate audience-specific views of the contract')
  .argument(
    '[spec-files...]',
    'Path to spec files (defaults to workspace scan)'
  )
  .requiredOption('--audience <type>', 'Audience type: product, eng, qa')
  .option('--json', 'Output as JSON')
  .option(
    '--baseline <ref>',
    'Git ref to compare against (only show changed specs since baseline)'
  )
  .action(async (specFiles: string[], options) => {
    try {
      const adapters = createNodeAdapters({ silent: true });

      // Log scanning message if not using explicit files
      if (!specFiles || specFiles.length === 0) {
        console.error(chalk.cyan('Scanning workspace for contracts...'));
      }

      // Generate views using bundle service
      const result = await generateViews(adapters, {
        audience: options.audience as ViewAudience,
        specFiles: specFiles?.length > 0 ? specFiles : undefined,
        baseline: options.baseline,
      });

      // Log scan results
      if (result.totalSpecs !== undefined) {
        console.error(chalk.gray(`Found ${result.totalSpecs} contracts.`));
      }

      // Handle result status
      if (!handleResultStatus(result, options.baseline)) {
        process.exit(0);
      }

      // Output views
      if (options.json) {
        const firstView = result.views[0];
        const isSingleExplicitFile =
          result.views.length === 1 &&
          specFiles &&
          specFiles.length === 1 &&
          firstView;
        const output = isSingleExplicitFile
          ? firstView.content
          : result.views.map((v) => v.content);
        console.log(JSON.stringify(output, null, 2));
      } else {
        result.views.forEach((view) => {
          if (result.views.length > 1) {
            console.log(chalk.bold(`\n📄 ${view.filePath}`));
          }
          console.log(view.content);
        });
      }
    } catch (error) {
      console.error(
        chalk.red('❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
