import { Command } from 'commander';
import chalk from 'chalk';
import {
  createNodeAdapters,
  generateView,
  type ViewAudience,
} from '@contractspec/bundle.workspace';

export const viewCommand = new Command('view')
  .description('Generate audience-specific views of the contract')
  .argument('<spec-file>', 'Path to spec file')
  .requiredOption('--audience <type>', 'Audience type: product, eng, qa')
  .option('--json', 'Output as JSON')
  .action(async (specFile, options) => {
    try {
      const adapters = createNodeAdapters({ silent: true });

      // Validate audience
      const validAudiences = ['product', 'eng', 'qa'];
      if (!validAudiences.includes(options.audience)) {
        throw new Error(
          `Invalid audience: ${options.audience}. Must be one of: ${validAudiences.join(', ')}`
        );
      }

      const view = await generateView(
        specFile,
        options.audience as ViewAudience,
        adapters
      );

      if (options.json) {
        console.log(JSON.stringify(view, null, 2));
      } else {
        console.log(view);
      }
    } catch (error) {
      console.error(
        chalk.red('❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
