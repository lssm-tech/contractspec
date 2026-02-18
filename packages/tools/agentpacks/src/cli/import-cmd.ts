import chalk from 'chalk';
import { importFromRulesync } from '../importers/rulesync.js';

interface ImportOptions {
  from: string;
  output?: string;
}

/**
 * Run the import command.
 */
export function runImport(projectRoot: string, options: ImportOptions): void {
  const { from, output } = options;

  switch (from) {
    case 'rulesync': {
      console.log(chalk.dim('Importing from .rulesync/ ...'));
      const result = importFromRulesync(projectRoot, output);

      if (result.warnings.length > 0) {
        for (const w of result.warnings) {
          console.log(chalk.yellow(`  warn: ${w}`));
        }
        return;
      }

      console.log(
        chalk.green(
          `Imported ${result.filesImported.length} file(s) to ${result.packDir}`
        )
      );

      if (result.configGenerated) {
        console.log(
          chalk.green('Generated agentpacks.jsonc from rulesync.jsonc')
        );
      }

      console.log(
        chalk.cyan('\nNext steps:'),
        '\n  1. Review the imported pack at',
        chalk.bold(result.packDir),
        '\n  2. Run',
        chalk.bold('agentpacks generate'),
        'to generate tool configs'
      );
      break;
    }

    default:
      console.log(chalk.red(`Unknown import source: "${from}"`));
      console.log(chalk.dim('Supported sources: rulesync'));
      break;
  }
}
