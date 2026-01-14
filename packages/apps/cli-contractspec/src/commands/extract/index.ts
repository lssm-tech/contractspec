import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import {
  createNodeAdapters,
  extractContracts,
} from '@contractspec/bundle.workspace';

export const extractCommand = new Command('extract')
  .description('Extract draft contracts from existing sources (OpenAPI, etc.)')
  .option(
    '-s, --source <path>',
    'Source file (OpenAPI JSON/YAML) to extract from'
  )
  .option(
    '-o, --output <dir>',
    'Output directory for draft contracts',
    '.contractspec/work/drafts'
  )
  .action(async (options) => {
    try {
      const adapters = createNodeAdapters({ silent: true });
      const cwd = process.cwd();
      const outputDir = path.resolve(cwd, options.output);

      console.log(chalk.bold.blue('\n📥 ContractSpec Extractor\n'));

      const result = await extractContracts(
        adapters,
        {
          source: options.source,
          outputDir: outputDir,
        },
        cwd
      );

      console.log(
        chalk.green(`\n✅ Extracted draft contracts to ${outputDir}`)
      );
      console.log(chalk.gray(`   Imported: ${result.imported}`));
      console.log(chalk.gray(`   Skipped:  ${result.skipped}`));
      console.log(chalk.gray(`   Errors:   ${result.errors}`));

      console.log(chalk.gray('\nNext steps:'));
      console.log(chalk.gray(`  1. Review drafts in ${outputDir}`));
      console.log(chalk.gray(`  2. Move to contracts/ directory when ready.`));
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
