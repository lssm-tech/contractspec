import { Command } from 'commander';
import chalk from 'chalk';
import {
  compareSpecs,
  createNodeAdapters,
} from '@contractspec/bundle.workspace';
import { getErrorMessage } from '../../utils/errors';
import { diffText } from './text';

export const diffCommand = new Command('diff')
  .description('Compare contract specs and show differences')
  .arguments('<spec1> <spec2>')
  .option('--breaking', 'Only show breaking semantic changes')
  .option('--semantic', 'Show semantic differences (metadata-level)')
  .option('--json', 'Output as JSON for scripting')
  .option('--baseline <ref>', 'Compare spec1 against git ref (branch/commit)')
  .action(runDiffCommand);

export interface DiffCommandOptions {
  breaking?: boolean;
  semantic?: boolean;
  json?: boolean;
  baseline?: string;
}

export async function runDiffCommand(
  spec1: string,
  spec2: string,
  options: DiffCommandOptions
) {
  const baseline: string | undefined = options.baseline as string | undefined;

  try {
    const adapters = createNodeAdapters({ silent: true });
    const aPath = spec1 as string;
    const bPath = spec2 as string;

    // Check if first file exists
    const exists = await adapters.fs.exists(aPath);
    if (!exists) {
      console.error(chalk.red(`File not found: ${aPath}`));
      process.exit(1);
    }

    if (options.semantic) {
      const result = await compareSpecs(aPath, bPath, adapters, {
        baseline,
        breakingOnly: Boolean(options.breaking),
      });

      if (options.json) {
        const output = {
          schemaVersion: '1.0',
          spec1: result.spec1,
          spec2: result.spec2,
          mode: 'semantic',
          differences: result.differences.map((d) => ({
            type: d.type,
            path: d.path,
            description: d.description,
            oldValue: d.oldValue,
            newValue: d.newValue,
          })),
        };
        console.log(JSON.stringify(output, null, 2));
        return;
      }

      console.log(
        chalk.bold(
          `\n📋 Semantic Comparison: ${result.spec1} ↔ ${result.spec2}`
        )
      );

      console.log(chalk.gray(`Differences: ${result.differences.length}`));

      console.log('');

      if (result.differences.length === 0) {
        console.log(chalk.green('✅ No semantic differences found'));
        return;
      }

      for (const diff of result.differences) {
        const icon =
          diff.type === 'breaking'
            ? '💥'
            : diff.type === 'added'
              ? '➕'
              : diff.type === 'removed'
                ? '➖'
                : '✏️';

        const color =
          diff.type === 'breaking'
            ? chalk.red
            : diff.type === 'added'
              ? chalk.green
              : diff.type === 'removed'
                ? chalk.red
                : chalk.yellow;

        console.log(`${icon} ${color(diff.path)}: ${diff.description}`);
        if (typeof diff.oldValue !== 'undefined') {
          console.log(`  ${chalk.red('-')} ${JSON.stringify(diff.oldValue)}`);
        }
        if (typeof diff.newValue !== 'undefined') {
          console.log(`  ${chalk.green('+')} ${JSON.stringify(diff.newValue)}`);
        }
      }

      return;
    }

    // text diff
    const aContent = await adapters.fs.readFile(aPath);
    let bContent: string;
    let actualBPath: string;

    if (baseline) {
      bContent = await adapters.git.showFile(baseline, aPath);
      actualBPath = `${baseline}:${aPath}`;
    } else {
      const existsB = await adapters.fs.exists(bPath);
      if (!existsB) {
        console.error(chalk.red(`File not found: ${bPath}`));
        process.exit(1);
      }
      bContent = await adapters.fs.readFile(bPath);
      actualBPath = bPath;
    }

    const result = baseline
      ? diffText(aPath, aPath, aContent, bContent)
      : diffText(aPath, actualBPath, aContent, bContent);

    if (options.json) {
      const output = {
        schemaVersion: '1.0',
        spec1: aPath,
        spec2: actualBPath,
        mode: 'text',
        diff: result.output,
      };
      console.log(JSON.stringify(output, null, 2));
      return;
    }

    console.log(chalk.bold(`\n📋 Comparing: ${aPath} ↔ ${actualBPath}\n`));

    console.log(
      result.output.trim().length ? result.output : chalk.gray('(no output)')
    );
  } catch (error) {
    console.error(
      chalk.red(`Error comparing specs: ${getErrorMessage(error)}`)
    );
    process.exit(1);
  }
}
