/**
 * Doctor command.
 *
 * Diagnoses and fixes ContractSpec installation issues.
 * Supports monorepos with package-level context.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { confirm, input, password } from '@inquirer/prompts';
import {
  runDoctor,
  ALL_CHECK_CATEGORIES,
  CHECK_CATEGORY_LABELS,
  createNodeFsAdapter,
  createConsoleLoggerAdapter,
  findWorkspaceRoot,
  findPackageRoot,
  isMonorepo,
  getPackageName,
  type CheckCategory,
} from '@lssm/bundle.contractspec-workspace';
import { getOpenApiSources, upsertOpenApiSource } from '../../utils/config-writer';
import type { OpenApiSource } from '../../utils/config';

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
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options) => {
    const cwd = process.cwd();

    // Detect workspace structure
    const workspaceRoot = findWorkspaceRoot(cwd);
    const packageRoot = findPackageRoot(cwd);
    const monorepo = isMonorepo(workspaceRoot);
    const packageName = monorepo ? getPackageName(packageRoot) : undefined;

    console.log(chalk.bold('\n🩺 ContractSpec Doctor\n'));

    // Display monorepo context
    if (monorepo) {
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

    console.log(chalk.gray('Checking:'));
    for (const cat of filteredList) {
      console.log(`  ${chalk.cyan('•')} ${CHECK_CATEGORY_LABELS[cat]}`);
    }
    console.log();

    const spinner = ora('Running health checks...').start();

    try {
      const fs = createNodeFsAdapter(workspaceRoot);
      const logger = createConsoleLoggerAdapter();

      // Pause spinner during prompts if interactive
      const prompts = options.fix
        ? undefined
        : {
            confirm: async (message: string) => {
              spinner.stop();
              const result = await confirm({ message });
              spinner.start();
              return result;
            },
            input: async (message: string, opts?: { password?: boolean }) => {
              spinner.stop();
              const result = opts?.password
                ? await password({ message, mask: '*' })
                : await input({ message });
              spinner.start();
              return result;
            },
          };

      const result = await runDoctor(
        { fs, logger },
        {
          workspaceRoot,
          categories,
          autoFix: options.fix,
          skipAi: options.skipAi,
          verbose: options.verbose,
        },
        prompts
      );

      spinner.stop();

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

        if (!options.fix) {
          const wantsConfigure = await confirm({
            message: 'Would you like to configure an OpenAPI source now?',
          });

          if (wantsConfigure) {
            const sourceName = await input({
              message: 'Enter a friendly name for this source:',
              default: 'api',
            });

            const sourceUrl = await input({
              message: 'Enter OpenAPI spec URL or file path:',
            });

            if (sourceUrl.trim()) {
              const newSource: OpenApiSource = {
                name: sourceName,
                syncMode: 'sync',
              };

              if (sourceUrl.startsWith('http://') || sourceUrl.startsWith('https://')) {
                newSource.url = sourceUrl;
              } else {
                newSource.file = sourceUrl;
              }

              await upsertOpenApiSource(newSource);
              console.log(chalk.green(`\n✅ Saved OpenAPI source '${sourceName}' to .contractsrc.json`));
              console.log(chalk.gray(`   Run ${chalk.cyan('contractspec openapi sync')} to import specs`));
            }
          }
        } else {
          console.log(chalk.gray('   Run ${chalk.cyan("contractspec init")} to configure OpenAPI sources'));
        }
      } else {
        console.log(chalk.green(`\n✓ ${openApiSources.length} OpenAPI source(s) configured`));
        for (const source of openApiSources) {
          const location = source.url ?? source.file ?? 'unknown';
          console.log(chalk.gray(`   • ${source.name}: ${location}`));
        }
      }

      if (!result.healthy) {
        process.exit(1);
      }
    } catch (error) {
      spinner.fail('Doctor check failed');
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
