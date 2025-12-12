import { Command } from 'commander';
import chalk from 'chalk';
import { existsSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { getErrorMessage } from '../../utils/errors';
import { computeSemanticDiff } from './semantic';
import { diffText } from './text';

export const diffCommand = new Command('diff')
  .description('Compare contract specs and show differences')
  .arguments('<spec1> <spec2>')
  .option('--breaking', 'Only show breaking semantic changes')
  .option('--semantic', 'Show semantic differences (metadata-level)')
  .option('--json', 'Output as JSON for scripting')
  .option('--baseline <ref>', 'Compare spec1 against git ref (branch/commit)')
  .action(async (spec1, spec2, options) => {
    const baseline: string | undefined = options.baseline;

    try {
      const aPath = spec1 as string;

      if (!existsSync(aPath)) {
        console.error(chalk.red(`File not found: ${aPath}`));
        process.exit(1);
      }

      let bPath = spec2 as string;
      let aContent = readFileSync(aPath, 'utf-8');
      let bContent: string;

      if (baseline) {
        bPath = `${baseline}:${aPath}`;
        try {
          bContent = execSync(`git show ${baseline}:${aPath}`, {
            encoding: 'utf-8',
            stdio: ['ignore', 'pipe', 'pipe'],
          });
        } catch (error) {
          console.error(chalk.red(`Could not load baseline version: ${getErrorMessage(error)}`));
          process.exit(1);
        }
      } else {
        if (!existsSync(bPath)) {
          console.error(chalk.red(`File not found: ${bPath}`));
          process.exit(1);
        }
        bContent = readFileSync(bPath, 'utf-8');
      }

      if (options.semantic) {
        const diffs = computeSemanticDiff(aContent, aPath, bContent, bPath, {
          breakingOnly: Boolean(options.breaking),
        });

        if (options.json) {
          console.log(
            JSON.stringify(
              { spec1: aPath, spec2: bPath, differences: diffs },
              null,
              2
            )
          );
          return;
        }

        console.log(
          chalk.bold(`\n📋 Semantic Comparison: ${aPath} ↔ ${bPath}`)
        );
        console.log(chalk.gray(`Differences: ${diffs.length}`));
        console.log('');

        if (diffs.length === 0) {
          console.log(chalk.green('✅ No semantic differences found'));
          return;
        }

        for (const diff of diffs) {
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
      const result = baseline
        ? diffText(aPath, aPath, aContent, bContent)
        : diffText(aPath, bPath);

      if (options.json) {
        console.log(
          JSON.stringify(
            { spec1: aPath, spec2: bPath, diff: result.output },
            null,
            2
          )
        );
        return;
      }

      console.log(chalk.bold(`\n📋 Comparing: ${aPath} ↔ ${bPath}\n`));
      console.log(result.output.trim().length ? result.output : chalk.gray('(no output)'));
    } catch (error) {
      console.error(chalk.red(`Error comparing specs: ${getErrorMessage(error)}`));
      process.exit(1);
    }
  });
