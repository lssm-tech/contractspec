/**
 * CI command.
 *
 * Runs all ContractSpec validation checks for CI/CD pipelines.
 * Supports multiple output formats: text, JSON, and SARIF.
 */

import { Command } from 'commander';
import { writeFile } from 'fs/promises';
import chalk from 'chalk';
import ora from 'ora';
import {
  runCIChecks,
  createNodeAdapters,
  type CICheckCategory,
  type CICheckOptions,
  type CIOutputFormat,
  ALL_CI_CHECK_CATEGORIES,
  CI_CHECK_CATEGORY_LABELS,
  formatters,
} from '@lssm/bundle.contractspec-workspace';

type OutputFormat = 'text' | 'json' | 'sarif';

interface CICommandOptions {
  pattern?: string;
  format?: OutputFormat;
  output?: string;
  failOnWarnings?: boolean;
  skip?: string;
  checks?: string;
  checkHandlers?: boolean;
  checkTests?: boolean;
  verbose?: boolean;
}

/**
 * Parse comma-separated check categories.
 */
function parseCheckCategories(value: string): CICheckCategory[] {
  const validCategories = new Set(ALL_CI_CHECK_CATEGORIES);
  const categories: CICheckCategory[] = [];

  for (const c of value.split(',')) {
    const trimmed = c.trim() as CICheckCategory;
    if (validCategories.has(trimmed)) {
      categories.push(trimmed);
    } else if (trimmed) {
      console.warn(
        chalk.yellow(`Warning: Unknown check category '${trimmed}'`)
      );
    }
  }

  return categories;
}

export const ciCommand = new Command('ci')
  .description('Run all CI/CD validation checks with machine-readable output')
  .option('-p, --pattern <glob>', 'Glob pattern for spec discovery')
  .option(
    '-f, --format <format>',
    'Output format: text, json, sarif (default: text)',
    'text'
  )
  .option(
    '-o, --output <file>',
    'Write results to file (stdout if not specified)'
  )
  .option(
    '--fail-on-warnings',
    'Exit with code 2 on warnings (default: errors only)',
    false
  )
  .option(
    '--skip <checks>',
    'Skip specific checks (comma-separated: structure,integrity,deps,doctor,handlers,tests)'
  )
  .option('--checks <checks>', 'Only run specific checks (comma-separated)')
  .option('--check-handlers', 'Include handler implementation checks', false)
  .option('--check-tests', 'Include test coverage checks', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options: CICommandOptions) => {
    const isTextOutput = options.format === 'text' || !options.format;
    const spinner = isTextOutput ? ora('Running CI checks...').start() : null;

    try {
      const adapters = createNodeAdapters({ silent: true });

      // Build check options
      const checkOptions: CICheckOptions = {
        pattern: options.pattern,
        checkHandlers: options.checkHandlers,
        checkTests: options.checkTests,
        failOnWarnings: options.failOnWarnings,
        workspaceRoot: process.cwd(),
      };

      // Parse check categories
      if (options.checks) {
        checkOptions.checks = parseCheckCategories(options.checks);
      }
      if (options.skip) {
        checkOptions.skip = parseCheckCategories(options.skip);
      }

      // Run checks
      const result = await runCIChecks(adapters, checkOptions);

      spinner?.stop();

      // Format output
      let output: string;
      switch (options.format) {
        case 'json':
          output = formatters.formatAsJson(result, { pretty: true });
          break;
        case 'sarif':
          const sarif = formatters.formatAsSarif(result, {
            toolName: 'ContractSpec',
            toolVersion: '1.0.0',
            workingDirectory: process.cwd(),
          });
          output = formatters.sarifToJson(sarif);
          break;
        case 'text':
        default:
          output = formatOutput(result, options.verbose ?? false);
          break;
      }

      // Write output
      if (options.output) {
        await writeFile(options.output, output, 'utf-8');
        if (isTextOutput) {
          console.log(chalk.green(`✓ Results written to ${options.output}`));
        }
      } else {
        console.log(output);
      }

      // Exit with appropriate code
      if (!result.success) {
        process.exit(1);
      } else if (options.failOnWarnings && result.totalWarnings > 0) {
        process.exit(2);
      }
    } catch (error) {
      spinner?.fail('CI checks failed');
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });

/**
 * Format result as colored text output.
 */
function formatOutput(
  result: ReturnType<typeof runCIChecks> extends Promise<infer T> ? T : never,
  verbose: boolean
): string {
  const lines = formatters.formatAsTextLines(result, {
    verbose,
    showTiming: true,
  });

  return lines
    .map((line) => {
      const indent = '  '.repeat(line.indent ?? 0);
      let text = line.text;

      switch (line.style) {
        case 'bold':
          text = chalk.bold(text);
          break;
        case 'error':
          text = chalk.red(text);
          break;
        case 'warning':
          text = chalk.yellow(text);
          break;
        case 'success':
          text = chalk.green(text);
          break;
        case 'muted':
          text = chalk.gray(text);
          break;
      }

      return indent + text;
    })
    .join('\n');
}
