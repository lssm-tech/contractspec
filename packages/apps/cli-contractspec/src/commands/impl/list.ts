/**
 * impl list command
 *
 * List implementation mappings for specs.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
  createConsoleLoggerAdapter,
  createNodeFsAdapter,
  loadWorkspaceConfig,
  type ResolvedImplementation,
  resolveImplementations,
  type SpecImplementationResult,
} from '@lssm/bundle.contractspec-workspace';
import type { ImplListOptions } from './types';

/**
 * Format source badge
 */
function sourceBadge(source: ResolvedImplementation['source']): string {
  switch (source) {
    case 'explicit':
      return chalk.blue('[explicit]');
    case 'discovered':
      return chalk.cyan('[discovered]');
    case 'convention':
      return chalk.gray('[convention]');
    default:
      return chalk.gray('[unknown]');
  }
}

/**
 * Format type badge
 */
function typeBadge(type: ResolvedImplementation['type']): string {
  switch (type) {
    case 'handler':
      return chalk.magenta('handler');
    case 'component':
      return chalk.green('component');
    case 'form':
      return chalk.yellow('form');
    case 'test':
      return chalk.blue('test');
    case 'service':
      return chalk.cyan('service');
    default:
      return chalk.gray('other');
  }
}

/**
 * Output as text
 */
function outputText(result: SpecImplementationResult): void {
  console.log(`\n${chalk.bold(result.specKey)} v${result.specVersion}`);
  console.log(`  ${chalk.gray('Type:')} ${result.specType}`);
  console.log(`  ${chalk.gray('Path:')} ${result.specPath}`);
  console.log(
    `  ${chalk.gray('Hash:')} ${result.specHash?.substring(0, 12) ?? 'n/a'}`
  );
  console.log();

  if (result.implementations.length === 0) {
    console.log(chalk.yellow('  No implementations found.'));
    return;
  }

  console.log('  ' + chalk.bold('Implementations:'));
  for (const impl of result.implementations) {
    const existsIcon = impl.exists ? chalk.green('✓') : chalk.red('✗');
    const typeStr = typeBadge(impl.type);
    const sourceStr = sourceBadge(impl.source);
    const hashStr = impl.contentHash
      ? chalk.gray(`(${impl.contentHash.substring(0, 8)})`)
      : '';

    console.log(`    ${existsIcon} ${impl.path}`);
    console.log(`      ${typeStr} ${sourceStr} ${hashStr}`);
    if (impl.description) {
      console.log(`      ${chalk.gray(impl.description)}`);
    }
  }
}

/**
 * Output as JSON
 */
function outputJson(result: SpecImplementationResult): void {
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Output as table
 */
function outputTable(result: SpecImplementationResult): void {
  console.log(
    `\n${chalk.bold(result.specKey)} v${result.specVersion} (${result.specType})`
  );
  console.log('─'.repeat(80));
  console.log(
    `${chalk.gray('Exists'.padEnd(8))} ${chalk.gray('Type'.padEnd(12))} ${chalk.gray('Source'.padEnd(14))} ${chalk.gray('Path')}`
  );
  console.log('─'.repeat(80));

  for (const impl of result.implementations) {
    const exists = impl.exists ? chalk.green('yes') : chalk.red('no');
    const type = impl.type.padEnd(12);
    const source = impl.source.padEnd(14);
    console.log(`${exists.padEnd(8)} ${type} ${source} ${impl.path}`);
  }

  console.log('─'.repeat(80));
}

/**
 * Run list command
 */
async function runList(
  specPath: string,
  options: ImplListOptions
): Promise<void> {
  const spinner = ora('Loading implementation mappings...').start();

  try {
    const fs = createNodeFsAdapter();
    const logger = createConsoleLoggerAdapter();
    const config = await loadWorkspaceConfig(fs);
    const adapters = { fs, logger };

    const result = await resolveImplementations(specPath, adapters, config, {
      includeExplicit: true,
      includeDiscovered: options.includeDiscovered ?? true,
      includeConvention: options.includeConvention ?? true,
      computeHashes: true,
    });

    spinner.stop();

    // Output result
    switch (options.format) {
      case 'json':
        outputJson(result);
        break;
      case 'table':
        outputTable(result);
        break;
      default:
        outputText(result);
    }
  } catch (error) {
    spinner.fail('Failed to list implementations');
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exitCode = 1;
  }
}

/**
 * Create the list command
 */
export function createListCommand(): Command {
  return new Command('list')
    .description('List implementation mappings for a spec')
    .argument('<spec>', 'Path to spec file')
    .option(
      '--include-discovered',
      'Include auto-discovered implementations',
      true
    )
    .option(
      '--include-convention',
      'Include convention-based implementations',
      true
    )
    .option('-f, --format <format>', 'Output format: text, json, table', 'text')
    .action(async (spec: string, options: ImplListOptions) => {
      await runList(spec, options);
    });
}
