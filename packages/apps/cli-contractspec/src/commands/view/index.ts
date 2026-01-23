import { Command } from 'commander';
import chalk from 'chalk';
import {
  createNodeAdapters,
  generateView,
  listSpecs,
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
        // We need config, but it's not passed to action directly in Command setup usually without .hook or context
        // Assuming we can load it or passed as global option?
        // Wait, validateCommand received `config` because it was hooked in index.ts
        // But viewCommand is defined using .action().

        // We'll load config locally if needed or assume defaults
        // Adapters has fs, we can try to load config
        // Actually, we can just use defaults for listSpecs if config is missing
        const specs = await listSpecs({ fs: adapters.fs });
        filesToProcess = specs.map((s) => s.filePath);
        console.error(chalk.gray(`Found ${filesToProcess.length} contracts.`));
      }

      // Filter to only changed specs if baseline is provided
      if (options.baseline) {
        const changedFiles = await adapters.git.diffFiles(options.baseline);

        if (changedFiles.length === 0) {
          console.error(chalk.green('No contract changes detected.'));
          process.exit(0);
        }

        console.error(
          chalk.gray(
            `Found ${changedFiles.length} changed files since ${options.baseline}.`
          )
        );

        // Filter to specs that match changed files
        filesToProcess = filesToProcess.filter((specPath) =>
          changedFiles.some(
            (changed) =>
              specPath.endsWith(changed) ||
              changed.endsWith(specPath) ||
              specPath.includes(changed) ||
              changed.includes(specPath)
          )
        );

        if (filesToProcess.length === 0) {
          console.error(chalk.green('No contract specs changed.'));
          process.exit(0);
        }

        console.error(
          chalk.gray(`${filesToProcess.length} contract specs changed.`)
        );
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
