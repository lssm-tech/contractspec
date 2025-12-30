/**
 * CICD doctor command.
 *
 * Diagnoses GitHub Actions workflow configuration.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const WORKFLOW_PATH = '.github/workflows/contractspec.yml';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fix?: string;
}

export const doctorCommand = new Command('doctor')
  .description('Diagnose CI/CD workflow configuration')
  .option('-v, --verbose', 'Verbose output', false)
  .action(async (options) => {
    const cwd = process.cwd();
    const workflowPath = resolve(cwd, WORKFLOW_PATH);

    console.log(chalk.bold('\n🩺 ContractSpec CI/CD Doctor\n'));

    const spinner = ora('Checking workflow...').start();
    const results: DiagnosticResult[] = [];

    try {
      // Check 1: Workflow file exists
      if (!existsSync(workflowPath)) {
        results.push({
          name: 'Workflow file',
          status: 'fail',
          message: `Workflow not found at ${WORKFLOW_PATH}`,
          fix: 'Run `contractspec cicd install` to create workflow',
        });

        spinner.stop();
        displayResults(results, options.verbose);
        process.exit(1);
      }

      results.push({
        name: 'Workflow file',
        status: 'pass',
        message: `Found at ${WORKFLOW_PATH}`,
      });

      // Read workflow content
      const content = readFileSync(workflowPath, 'utf-8');

      // Check 2: Valid YAML structure
      try {
        // Basic YAML validation - check for required keys
        if (!content.includes('name:') || !content.includes('jobs:')) {
          throw new Error('Missing required YAML keys');
        }
        results.push({
          name: 'YAML structure',
          status: 'pass',
          message: 'Valid YAML structure',
        });
      } catch {
        results.push({
          name: 'YAML structure',
          status: 'fail',
          message: 'Invalid YAML structure',
          fix: 'Check YAML syntax and re-run install',
        });
      }

      // Check 3: ContractSpec action is used
      if (content.includes('lssm-tech/contractspec-action')) {
        results.push({
          name: 'ContractSpec action',
          status: 'pass',
          message: 'Using ContractSpec GitHub Action',
        });

        // Check version
        const versionMatch = content.match(/contractspec-action@(v\d+|main)/);
        if (versionMatch) {
          const version = versionMatch[1];
          if (version === 'v1' || version === 'main') {
            results.push({
              name: 'Action version',
              status: 'pass',
              message: `Using version: ${version}`,
            });
          } else {
            results.push({
              name: 'Action version',
              status: 'warn',
              message: `Using version: ${version}`,
              fix: 'Consider updating to @v1 for latest features',
            });
          }
        }
      } else {
        results.push({
          name: 'ContractSpec action',
          status: 'warn',
          message: 'ContractSpec action not detected',
          fix: 'Re-run `contractspec cicd install`',
        });
      }

      // Check 4: Validate mode exists
      if (content.includes('mode: validate')) {
        results.push({
          name: 'Validation job',
          status: 'pass',
          message: 'Validation checks configured',
        });
      } else {
        results.push({
          name: 'Validation job',
          status: 'warn',
          message: 'No validation job detected',
          fix: 'Add mode: validate to enable validation checks',
        });
      }

      // Check 5: Impact mode exists
      if (content.includes('mode: impact')) {
        results.push({
          name: 'Impact detection',
          status: 'pass',
          message: 'Impact detection configured',
        });
      } else {
        results.push({
          name: 'Impact detection',
          status: 'warn',
          message: 'Impact detection not configured',
          fix: 'Add mode: impact to detect breaking changes',
        });
      }

      // Check 6: Permissions
      if (content.includes('permissions:')) {
        results.push({
          name: 'Permissions',
          status: 'pass',
          message: 'Explicit permissions configured',
        });
      } else {
        results.push({
          name: 'Permissions',
          status: 'warn',
          message: 'No explicit permissions set',
          fix: 'Add permissions block for security best practice',
        });
      }

      // Check 7: Checkout with fetch-depth for impact detection
      if (content.includes('mode: impact')) {
        if (content.includes('fetch-depth: 0')) {
          results.push({
            name: 'Git history',
            status: 'pass',
            message: 'Full git history fetched for impact detection',
          });
        } else {
          results.push({
            name: 'Git history',
            status: 'warn',
            message: 'fetch-depth not set for impact detection',
            fix: 'Add fetch-depth: 0 to actions/checkout for accurate diffs',
          });
        }
      }

      spinner.stop();
      displayResults(results, options.verbose);

      // Summary
      const passed = results.filter((r) => r.status === 'pass').length;
      const warnings = results.filter((r) => r.status === 'warn').length;
      const failures = results.filter((r) => r.status === 'fail').length;

      console.log(chalk.bold('\n📊 Summary:'));
      console.log(
        `  ${chalk.green(`${passed} passed`)}, ` +
          `${chalk.yellow(`${warnings} warnings`)}, ` +
          `${chalk.red(`${failures} failures`)}`
      );
      console.log();

      if (failures > 0) {
        console.log(
          chalk.red.bold('✗ Issues found. Address failures to enable CI/CD.\n')
        );
        process.exit(1);
      } else if (warnings > 0) {
        console.log(
          chalk.yellow.bold(
            '⚠ Workflow is functional but has recommendations.\n'
          )
        );
      } else {
        console.log(
          chalk.green.bold('✓ CI/CD workflow is properly configured!\n')
        );
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

/**
 * Display diagnostic results.
 */
function displayResults(results: DiagnosticResult[], verbose: boolean): void {
  console.log(chalk.bold('\n📋 Results:\n'));

  // Group by status
  const failures = results.filter((r) => r.status === 'fail');
  const warnings = results.filter((r) => r.status === 'warn');
  const passes = results.filter((r) => r.status === 'pass');

  if (failures.length > 0) {
    console.log(chalk.red.bold('Failures:'));
    for (const result of failures) {
      console.log(`  ${chalk.red('✗')} ${result.name}`);
      console.log(`    ${chalk.gray(result.message)}`);
      if (result.fix) {
        console.log(`    ${chalk.yellow('Fix:')} ${result.fix}`);
      }
    }
    console.log();
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow.bold('Warnings:'));
    for (const result of warnings) {
      console.log(`  ${chalk.yellow('⚠')} ${result.name}`);
      console.log(`    ${chalk.gray(result.message)}`);
      if (result.fix) {
        console.log(`    ${chalk.cyan('Tip:')} ${result.fix}`);
      }
    }
    console.log();
  }

  if (passes.length > 0) {
    console.log(chalk.green.bold('Passed:'));
    for (const result of passes) {
      console.log(`  ${chalk.green('✓')} ${result.name}`);
      if (verbose) {
        console.log(`    ${chalk.gray(result.message)}`);
      }
    }
    console.log();
  }
}
