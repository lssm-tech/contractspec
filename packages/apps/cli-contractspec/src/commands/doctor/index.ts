/**
 * Doctor command.
 *
 * Diagnoses and fixes ContractSpec installation issues.
 * Supports monorepos with package-level context.
 */

import { Command } from 'commander';
import { writeFile } from 'node:fs/promises';
import chalk from 'chalk';
import ora from 'ora';
import {
  ALL_CHECK_CATEGORIES,
  CHECK_CATEGORY_LABELS,
  type CheckCategory,
  createConsoleLoggerAdapter,
  createNodeFsAdapter,
  findPackageRoot,
  findWorkspaceRoot,
  getPackageName,
  isMonorepo,
  runDoctor,
} from '@contractspec/bundle.workspace';
import { getOpenApiSources } from '../../utils/config-writer';

type DoctorOutputFormat = 'text' | 'json';

/**
 * Parse comma-separated categories.
 */
function parseCategories(value: string): CheckCategory[] {
  const validCategories = new Set(ALL_CHECK_CATEGORIES);
  const categories: CheckCategory[] = [];

  for (const c of value.split(',')) {
    const trimmed = c.trim() as CheckCategory;
    if (validCategories.has(trimmed)) {
      categories.push(trimmed);
    } else {
      console.warn(chalk.yellow(`Warning: Unknown category '${trimmed}'`));
    }
  }

  return categories;
}

export const doctorCommand = new Command('doctor')
  .description('Diagnose and fix ContractSpec installation issues')
  .option(
    '-c, --checks <categories>',
    `Categories to check: ${ALL_CHECK_CATEGORIES.join(', ')}`,
    ''
  )
  .option('-f, --fix', 'Auto-apply fixes without prompting', false)
  .option('--skip-ai', 'Skip AI provider checks', false)
  .option('--format <format>', 'Output format: text, json (default: text)', 'text')
  .option('-o, --output <file>', 'Write results to file')
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options) => {
    const outputFormat = (options.format ?? 'text') as DoctorOutputFormat;
    const isTextOutput = outputFormat === 'text';
    const cwd = process.cwd();

    // Detect workspace structure
    const workspaceRoot = findWorkspaceRoot(cwd);
    const packageRoot = findPackageRoot(cwd);
    const monorepo = isMonorepo(workspaceRoot);
    const packageName = monorepo ? getPackageName(packageRoot) : undefined;

    if (isTextOutput) {
      console.log(chalk.bold('\n🩺 ContractSpec Doctor\n'));
    }

    // Display monorepo context
    if (monorepo && isTextOutput) {
      console.log(chalk.cyan('📦 Monorepo detected'));
      console.log(chalk.gray(`   Workspace root: ${workspaceRoot}`));
      if (packageRoot !== workspaceRoot) {
        console.log(chalk.gray(`   Package root:   ${packageRoot}`));
        if (packageName) {
          console.log(chalk.gray(`   Package name:   ${packageName}`));
        }
      }
      console.log();
    }

    // Parse categories
    let categories: CheckCategory[] | undefined;
    if (options.checks) {
      categories = parseCategories(options.checks);
      if (categories.length === 0) {
        categories = undefined;
      }
    }

    // Show what we're checking
    const checkList = categories ?? ALL_CHECK_CATEGORIES;
    const filteredList = options.skipAi
      ? checkList.filter((c) => c !== 'ai')
      : checkList;

    if (isTextOutput) {
      console.log(chalk.gray('Checking:'));
      for (const cat of filteredList) {
        console.log(`  ${chalk.cyan('•')} ${CHECK_CATEGORY_LABELS[cat]}`);
      }
      console.log();
    }

    const spinner = isTextOutput
      ? ora('Running health checks...').start()
      : null;

    try {
      const fs = createNodeFsAdapter(workspaceRoot);
      const logger = createConsoleLoggerAdapter();

      const result = await runDoctor(
        { fs, logger },
        {
          workspaceRoot,
          categories,
          autoFix: options.fix,
          skipAi: options.skipAi,
          verbose: options.verbose,
        }
      );

      spinner?.stop();

      if (!isTextOutput) {
        const openApiSources = await getOpenApiSources();
        const output = JSON.stringify(
          {
            schemaVersion: '1.0',
            workspace: {
              workspaceRoot,
              packageRoot,
              isMonorepo: monorepo,
              packageName,
            },
            summary: {
              passed: result.passed,
              warnings: result.warnings,
              failures: result.failures,
              skipped: result.skipped,
              healthy: result.healthy,
            },
            openApiSources,
            checks: result.checks,
          },
          null,
          2
        );

        if (options.output) {
          await writeFile(options.output, output, 'utf-8');
        } else {
          console.log(output);
        }

        if (!result.healthy) {
          process.exit(1);
        }
        return;
      }

      // Show results grouped by status
      console.log(chalk.bold('\n📋 Results:\n'));

      // Show failures first
      const failures = result.checks.filter((c) => c.status === 'fail');
      if (failures.length > 0) {
        console.log(chalk.red.bold('Failures:'));
        for (const check of failures) {
          console.log(`  ${chalk.red('✗')} ${check.name}`);
          console.log(`    ${chalk.gray(check.message)}`);
          if (check.details) {
            console.log(`    ${chalk.dim(check.details)}`);
          }
          if (check.fix) {
            console.log(`    ${chalk.yellow('Fix:')} ${check.fix.description}`);
          }
        }
        console.log();
      }

      // Show warnings
      const warnings = result.checks.filter((c) => c.status === 'warn');
      if (warnings.length > 0) {
        console.log(chalk.yellow.bold('Warnings:'));
        for (const check of warnings) {
          console.log(`  ${chalk.yellow('⚠')} ${check.name}`);
          console.log(`    ${chalk.gray(check.message)}`);
          if (check.details) {
            console.log(`    ${chalk.dim(check.details)}`);
          }
          if (check.fix) {
            console.log(`    ${chalk.yellow('Fix:')} ${check.fix.description}`);
          }
        }
        console.log();
      }

      // Show passes (condensed)
      const passes = result.checks.filter((c) => c.status === 'pass');
      if (passes.length > 0) {
        console.log(chalk.green.bold('Passed:'));
        for (const check of passes) {
          console.log(`  ${chalk.green('✓')} ${check.name}`);
          if (options.verbose) {
            console.log(`    ${chalk.gray(check.message)}`);
          }
        }
        console.log();
      }

      // Show skipped (if verbose)
      if (options.verbose) {
        const skipped = result.checks.filter((c) => c.status === 'skip');
        if (skipped.length > 0) {
          console.log(chalk.gray.bold('Skipped:'));
          for (const check of skipped) {
            console.log(`  ${chalk.gray('○')} ${check.name}`);
            console.log(`    ${chalk.dim(check.message)}`);
          }
          console.log();
        }
      }

      // Summary
      console.log(chalk.bold('Summary:'));
      console.log(
        `  ${chalk.green(`${result.passed} passed`)}, ` +
          `${chalk.yellow(`${result.warnings} warnings`)}, ` +
          `${chalk.red(`${result.failures} failures`)}, ` +
          `${chalk.gray(`${result.skipped} skipped`)}`
      );
      console.log();

      if (result.healthy) {
        console.log(
          chalk.green.bold('✓ Your ContractSpec installation is healthy!\n')
        );
      } else {
        console.log(
          chalk.red.bold('✗ Issues found. Run with --fix to auto-repair.\n')
        );
      }

      // Check OpenAPI sources configuration
      const openApiSources = await getOpenApiSources();
      if (openApiSources.length === 0) {
        console.log(chalk.yellow('\n⚠️ No OpenAPI sources configured.'));
        console.log(
          chalk.gray(
            `   Run ${chalk.cyan('contractspec init')} or edit ${chalk.cyan('.contractsrc.json')} to configure OpenAPI sources.`
          )
        );
      } else {
        console.log(
          chalk.green(
            `\n✓ ${openApiSources.length} OpenAPI source(s) configured`
          )
        );
        for (const source of openApiSources) {
          const location = source.url ?? source.file ?? 'unknown';
          console.log(chalk.gray(`   • ${source.name}: ${location}`));
        }
      }

      if (!result.healthy) {
        process.exit(1);
      }
    } catch (error) {
      spinner?.fail('Doctor check failed');
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
