/**
 * impl status command
 *
 * Check implementation status of specs.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
  createNodeFsAdapter,
  createConsoleLoggerAdapter,
  loadWorkspaceConfig,
  resolveImplementations,
  resolveAllImplementations,
  getImplementationSummary,
  type SpecImplementationResult,
} from '@lssm/bundle.contractspec-workspace';
import type { ImplStatusOptions } from './types';

/**
 * Format status icon
 */
function statusIcon(status: SpecImplementationResult['status']): string {
  switch (status) {
    case 'implemented':
      return chalk.green('✓');
    case 'partial':
      return chalk.yellow('◐');
    case 'missing':
      return chalk.red('✗');
    default:
      return chalk.gray('?');
  }
}

/**
 * Format status text
 */
function statusText(status: SpecImplementationResult['status']): string {
  switch (status) {
    case 'implemented':
      return chalk.green('implemented');
    case 'partial':
      return chalk.yellow('partial');
    case 'missing':
      return chalk.red('missing');
    default:
      return chalk.gray('unknown');
  }
}

/**
 * Output results as text
 */
function outputText(results: SpecImplementationResult[]): void {
  for (const result of results) {
    console.log(
      `\n${statusIcon(result.status)} ${chalk.bold(result.specKey)} v${result.specVersion}`
    );
    console.log(`  ${chalk.gray('Type:')} ${result.specType}`);
    console.log(`  ${chalk.gray('Status:')} ${statusText(result.status)}`);
    console.log(`  ${chalk.gray('Path:')} ${result.specPath}`);

    if (result.implementations.length > 0) {
      console.log(`  ${chalk.gray('Implementations:')}`);
      for (const impl of result.implementations) {
        const existsIcon = impl.exists ? chalk.green('✓') : chalk.red('✗');
        const sourceTag = chalk.gray(`[${impl.source}]`);
        console.log(`    ${existsIcon} ${impl.path} ${sourceTag}`);
      }
    } else {
      console.log(
        `  ${chalk.gray('Implementations:')} ${chalk.yellow('none found')}`
      );
    }
  }

  // Summary
  const summary = getImplementationSummary(results);
  console.log('\n' + chalk.bold('Summary:'));
  console.log(`  Total specs: ${summary.total}`);
  console.log(`  ${chalk.green('Implemented:')} ${summary.implemented}`);
  console.log(`  ${chalk.yellow('Partial:')} ${summary.partial}`);
  console.log(`  ${chalk.red('Missing:')} ${summary.missing}`);
  console.log(`  Coverage: ${summary.coverage}%`);
}

/**
 * Output results as JSON
 */
function outputJson(results: SpecImplementationResult[]): void {
  const summary = getImplementationSummary(results);
  console.log(JSON.stringify({ results, summary }, null, 2));
}

/**
 * Output results as table
 */
function outputTable(results: SpecImplementationResult[]): void {
  console.log('\n' + chalk.bold('Implementation Status'));
  console.log('─'.repeat(80));
  console.log(
    `${chalk.gray('Status'.padEnd(10))} ${chalk.gray('Spec Name'.padEnd(40))} ${chalk.gray('Type'.padEnd(15))} ${chalk.gray('Impls')}`
  );
  console.log('─'.repeat(80));

  for (const result of results) {
    const status = statusText(result.status).padEnd(20); // Includes ANSI codes, so pad more
    const name = result.specKey.substring(0, 38).padEnd(40);
    const type = result.specType.padEnd(15);
    const implCount = `${result.implementations.filter((i) => i.exists).length}/${result.implementations.length}`;
    console.log(`${status} ${name} ${type} ${implCount}`);
  }

  console.log('─'.repeat(80));
  const summary = getImplementationSummary(results);
  console.log(
    `\nTotal: ${summary.total} | Implemented: ${summary.implemented} | Partial: ${summary.partial} | Missing: ${summary.missing} | Coverage: ${summary.coverage}%`
  );
}

/**
 * Run status command
 */
async function runStatus(options: ImplStatusOptions): Promise<void> {
  const spinner = ora('Checking implementation status...').start();

  try {
    const fs = createNodeFsAdapter();
    const logger = createConsoleLoggerAdapter();
    const config = await loadWorkspaceConfig(fs);
    const adapters = { fs, logger };

    let results: SpecImplementationResult[];

    if (options.spec) {
      // Single spec
      const result = await resolveImplementations(
        options.spec,
        adapters,
        config
      );
      results = [result];
    } else {
      // All specs
      //   const pattern = options.pattern ?? config.pattern ?? '**/*.contracts.ts';
      const pattern = options.pattern ?? '**/*.contracts.ts';
      const specFiles = await fs.glob({ pattern });
      results = await resolveAllImplementations(specFiles, adapters, config);
    }

    spinner.stop();

    // Output results
    switch (options.format) {
      case 'json':
        outputJson(results);
        break;
      case 'table':
        outputTable(results);
        break;
      default:
        outputText(results);
    }

    // Exit with error if any specs are missing implementations
    const summary = getImplementationSummary(results);
    if (summary.missing > 0 && options.all) {
      process.exitCode = 1;
    }
  } catch (error) {
    spinner.fail('Failed to check implementation status');
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exitCode = 1;
  }
}

/**
 * Create the status command
 */
export function createStatusCommand(): Command {
  return new Command('status')
    .description('Check implementation status of specs')
    .option('-s, --spec <path>', 'Path to specific spec file')
    .option('-a, --all', 'Check all specs in workspace')
    .option('-p, --pattern <glob>', 'Glob pattern for spec files')
    .option('-f, --format <format>', 'Output format: text, json, table', 'text')
    .action(async (options: ImplStatusOptions) => {
      await runStatus(options);
    });
}
