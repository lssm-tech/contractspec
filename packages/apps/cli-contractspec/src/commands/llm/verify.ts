/**
 * LLM Verify Command
 *
 * Verify implementations against specs using tiered verification.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import type { VerificationTier } from '@contractspec/lib.contracts/llm';
import { loadSpecFromSource } from '@contractspec/module.workspace';
import {
  verifyImplementationAgainstParsedSpec,
  formatVerificationReport,
} from '@contractspec/bundle.workspace';

export const verifyLLMCommand = new Command('verify')
  .description('Verify an implementation against its spec')
  .argument('<spec-file>', 'Path to the spec file')
  .argument('<impl-file>', 'Path to the implementation file')
  .option(
    '-t, --tier <tier>',
    'Verification tier: 1 (structure), 2 (behavior), 3 (ai), all',
    'all'
  )
  .option(
    '--fail-fast',
    'Stop on first tier failure (not implemented for static check yet)'
  )
  .option('--json', 'Output as JSON')
  .action(async (specFile, implFile, options) => {
    try {
      console.log(
        chalk.blue(`\n🔍 Verifying ${implFile} against ${specFile}...\n`)
      );

      const fullPath = resolve(process.cwd(), specFile);
      if (!existsSync(fullPath)) {
        throw new Error(`Spec file not found: ${specFile}`);
      }

      // Load with static analysis
      const specs = await loadSpecFromSource(fullPath);
      if (specs.length === 0) {
        throw new Error('No spec definitions found');
      }
      const spec = specs[0];
      if (!spec) {
        throw new Error('No spec definitions found');
      }

      const implPath = resolve(process.cwd(), implFile);
      if (!existsSync(implPath)) {
        throw new Error(`Implementation file not found: ${implFile}`);
      }
      const implementationCode = readFileSync(implPath, 'utf-8');

      // Determine tiers to run
      // Note: 'ai_review' is not supported in static mode yet
      let tiers: VerificationTier[];
      switch (options.tier) {
        case '1':
          tiers = ['structure'];
          break;
        case '2':
          tiers = ['structure', 'behavior'];
          break;
        case '3':
        case 'all':
        default:
          tiers = ['structure', 'behavior'];
          if (options.tier === '3' || options.tier === 'all') {
            console.log(
              chalk.yellow(
                'Note: AI verification (Tier 3) is currently disabled in CLI static mode. Running tiers 1 & 2.'
              )
            );
          }
          break;
      }

      const issues = verifyImplementationAgainstParsedSpec(
        spec,
        implementationCode,
        tiers
      );

      // Determine pass/fail
      const errorCount = issues.filter((i) => i.severity === 'error').length;
      const warningCount = issues.filter(
        (i) => i.severity === 'warning'
      ).length;
      const passed = errorCount === 0;

      if (options.json) {
        console.log(
          JSON.stringify(
            {
              passed,
              issues,
              summary: { errors: errorCount, warnings: warningCount },
            },
            null,
            2
          )
        );
      } else {
        // Print formatted results
        console.log(formatVerificationReport(spec, issues));

        // Summary line
        console.log('');
        if (passed) {
          console.log(chalk.green(`✓ Verification passed`));
        } else {
          console.log(chalk.red(`✗ Verification failed`));
        }
      }

      // Exit with appropriate code
      process.exit(passed ? 0 : 1);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
