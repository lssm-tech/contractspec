import { Command } from 'commander';
import chalk from 'chalk';
import {
  createNodeAdapters,
  generateView,
  listSpecsForView,
  type ViewAudience,
} from '@contractspec/bundle.workspace';

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

      // Validate audience
      const validAudiences = ['product', 'eng', 'qa'];
      if (!validAudiences.includes(options.audience)) {
        throw new Error(
          `Invalid audience: ${options.audience}. Must be one of: ${validAudiences.join(', ')}`
        );
      }

      // Resolve files
      let filesToProcess: string[] = [];
      if (specFiles && specFiles.length > 0) {
        filesToProcess = specFiles;
      } else {
        console.error(chalk.cyan('Scanning workspace for contracts...'));

        // Use bundle service to list specs with optional baseline filtering
        const result = await listSpecsForView(adapters, {
          baseline: options.baseline,
        });

        console.error(chalk.gray(`Found ${result.totalSpecs} contracts.`));

        // Handle baseline filtering results
        if (options.baseline) {
          if (result.changedFilesCount === 0) {
            console.error(chalk.green('No contract changes detected.'));
            process.exit(0);
          }

          console.error(
            chalk.gray(
              `Found ${result.changedFilesCount} changed files since ${options.baseline}.`
            )
          );

          if (result.specFiles.length === 0) {
            console.error(chalk.green('No contract specs changed.'));
            process.exit(0);
          }

          console.error(
            chalk.gray(`${result.specFiles.length} contract specs changed.`)
          );
        }

        filesToProcess = result.specFiles;
      }

      if (filesToProcess.length === 0) {
        console.error(chalk.yellow('No specs found.'));
        process.exit(0);
      }

      const views: unknown[] = [];

      for (const specFile of filesToProcess) {
        const view = await generateView(
          specFile,
          options.audience as ViewAudience,
          adapters
        );
        views.push(view);
      }

      if (options.json) {
        // If single file and original behavior expected single object?
        // But now we support multiple. Array output seems safer for consistency?
        // Or if single file input -> single object output?
        if (
          filesToProcess.length === 1 &&
          specFiles &&
          specFiles.length === 1
        ) {
          console.log(JSON.stringify(views[0], null, 2));
        } else {
          console.log(JSON.stringify(views, null, 2));
        }
      } else {
        views.forEach((v, i) => {
          if (views.length > 1)
            console.log(chalk.bold(`\n📄 ${filesToProcess[i]}`));
          console.log(v);
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
