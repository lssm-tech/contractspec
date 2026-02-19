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
import { loadConfig } from '../../utils/config';
import {
  ALL_CI_CHECK_CATEGORIES,
  type CICheckCategory,
  type CICheckOptions,
  createNodeAdapters,
  formatters,
  runCIChecks,
} from '@contractspec/bundle.workspace';

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
  checkDrift?: boolean;
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

/**
 * Get repository URI from GitHub Actions environment variables.
 */
function getRepositoryUri(): string | undefined {
  const githubServer = process.env['GITHUB_SERVER_URL'];
  const githubRepo = process.env['GITHUB_REPOSITORY'];
  return githubServer && githubRepo
    ? `${githubServer}/${githubRepo}`
    : undefined;
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
  .option('--check-drift', 'Include drift detection checks', false)
  .option('-v, --verbose', 'Verbose output', false)
  .action(runCiCommand);

export async function runCiCommand(options: CICommandOptions) {
  const isTextOutput = options.format === 'text' || !options.format;
  const spinner = isTextOutput ? ora('Running CI checks...').start() : null;

  try {
    const adapters = createNodeAdapters({ silent: true });

    // FORCE no-op logger for machine-readable output formats to prevent
    // any log pollution (e.g. "[INFO] Starting...") from breaking JSON parsing.
    // This is redundant with silent: true but acts as a safety belt against
    // logger implementation changes or dependency issues.
    if (!isTextOutput) {
      /* eslint-disable @typescript-eslint/no-empty-function */
      adapters.logger = {
        debug: () => {},
        info: () => {},
        warn: () => {},
        error: () => {},
        createProgress: () => ({
          start: () => {},
          update: () => {},
          succeed: () => {},
          fail: () => {},
          warn: () => {},
          stop: () => {},
        }),
      };
      /* eslint-enable @typescript-eslint/no-empty-function */
    }

    // Load configuration
    const config = await loadConfig();

    // Build check options
    const checkOptions: CICheckOptions = {
      pattern: options.pattern,
      checkHandlers: options.checkHandlers,
      checkTests: options.checkTests,
      checkDrift: options.checkDrift,
      failOnWarnings: options.failOnWarnings,
      workspaceRoot: process.cwd(),
      config,
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
      case 'sarif': {
        const sarif = formatters.formatAsSarif(result, {
          toolName: 'ContractSpec',
          toolVersion: '1.0.0',
          workingDirectory: process.cwd(),
          repositoryUri: getRepositoryUri(),
        });
        output = formatters.sarifToJson(sarif);
        break;
      }
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

    if (result.success && isTextOutput) {
      console.log();
      console.log(chalk.bold('Want evidence-backed decisions for your specs?'));
      console.log(
        '  Studio correlates product signals and compiles decisions into spec diffs and task packs.'
      );
      console.log('  Try Studio: https://www.contractspec.studio');
    }
  } catch (error) {
    spinner?.fail('CI checks failed');

    const errorMessage = error instanceof Error ? error.message : String(error);

    // For structured formats, output a valid error result
    if (options.format === 'json' || options.format === 'sarif') {
      // Construct a partial result that mimics CICheckResult enough for the formatter
      const errorResult = {
        success: false,
        totalErrors: 1,
        totalWarnings: 0,
        totalNotes: 0,
        issues: [
          {
            ruleId: 'ci-internal-error',
            severity: 'error' as const,
            message: `CI check execution failed: ${errorMessage}`,
            category: 'doctor' as const,
            file: undefined,
            line: undefined,
            context: undefined,
          },
        ],
        categories: [], // Empty categories
        durationMs: 0,
        timestamp: new Date().toISOString(),
        commitSha: undefined,
        branch: undefined,
      };

      if (options.format === 'json') {
        const output = formatters.formatAsJson(errorResult, { pretty: true });
        if (options.output) {
          await writeFile(options.output, output, 'utf-8');
        } else {
          console.log(output);
        }
      } else {
        const sarif = formatters.formatAsSarif(errorResult, {
          toolName: 'ContractSpec',
          toolVersion: '1.0.0',
          workingDirectory: process.cwd(),
          repositoryUri: getRepositoryUri(),
        });
        const output = formatters.sarifToJson(sarif);
        if (options.output) {
          await writeFile(options.output, output, 'utf-8');
        } else {
          console.log(output);
        }
      }
    } else {
      console.error(chalk.red('\n❌ Error:'), errorMessage);
    }

    process.exit(1);
  }
}

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
