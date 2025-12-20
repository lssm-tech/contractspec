/**
 * LLM Verify Command
 *
 * Verify implementations against specs using tiered verification.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import type { VerificationTier } from '@lssm/lib.contracts/llm';
import { createVerifyService } from '@lssm/bundle.contractspec-workspace';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadSpec(specPath: string): Promise<any> {
  const fullPath = resolve(process.cwd(), specPath);

  if (!existsSync(fullPath)) {
    throw new Error(`Spec file not found: ${specPath}`);
  }

  try {
    const module = await import(fullPath);
    for (const [, value] of Object.entries(module)) {
      if (
        value &&
        typeof value === 'object' &&
        'meta' in value &&
        'io' in value
      ) {
        return value;
      }
    }
    throw new Error('No spec found in module');
  } catch (error) {
    throw new Error(
      `Failed to load spec: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export const verifyLLMCommand = new Command('verify')
  .description('Verify an implementation against its spec')
  .argument('<spec-file>', 'Path to the spec file')
  .argument('<impl-file>', 'Path to the implementation file')
  .option(
    '-t, --tier <tier>',
    'Verification tier: 1 (structure), 2 (behavior), 3 (ai), all',
    'all'
  )
  .option('--fail-fast', 'Stop on first tier failure')
  .option('--json', 'Output as JSON')
  .option('--ai-key <key>', 'API key for AI verification (tier 3)')
  .option(
    '--ai-provider <provider>',
    'AI provider: anthropic, openai',
    'anthropic'
  )
  .action(async (specFile, implFile, options) => {
    try {
      console.log(
        chalk.blue(`\n🔍 Verifying ${implFile} against ${specFile}...\n`)
      );

      const spec = await loadSpec(specFile);

      const implPath = resolve(process.cwd(), implFile);
      if (!existsSync(implPath)) {
        throw new Error(`Implementation file not found: ${implFile}`);
      }
      const implementationCode = readFileSync(implPath, 'utf-8');

      // Determine tiers to run
      let tiers: VerificationTier[];
      switch (options.tier) {
        case '1':
          tiers = ['structure'];
          break;
        case '2':
          tiers = ['structure', 'behavior'];
          break;
        case '3':
          tiers = ['structure', 'behavior', 'ai_review'];
          break;
        case 'all':
        default:
          tiers = ['structure', 'behavior'];
          if (options.aiKey) {
            tiers.push('ai_review');
          }
          break;
      }

      const verifyService = createVerifyService({
        aiApiKey: options.aiKey,
        aiProvider: options.aiProvider,
      });

      const result = await verifyService.verify(spec, implementationCode, {
        tiers,
        failFast: options.failFast,
        includeSuggestions: true,
      });

      if (options.json) {
        // Convert Map to plain object for JSON
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reports: Record<string, any> = {};
        for (const [tier, report] of result.reports) {
          reports[tier] = report;
        }
        console.log(
          JSON.stringify(
            {
              passed: result.passed,
              score: result.score,
              duration: result.duration,
              reports,
              allIssues: result.allIssues,
            },
            null,
            2
          )
        );
      } else {
        // Print formatted results
        console.log(verifyService.formatAsMarkdown(result));

        // Summary line
        console.log('');
        if (result.passed) {
          console.log(
            chalk.green(`✓ Verification passed (score: ${result.score}/100)`)
          );
        } else {
          console.log(
            chalk.red(`✗ Verification failed (score: ${result.score}/100)`)
          );
        }
        console.log(chalk.gray(`Duration: ${result.duration}ms`));
      }

      // Exit with appropriate code
      process.exit(result.passed ? 0 : 1);
    } catch (error) {
      console.error(
        chalk.red('\n❌ Error:'),
        error instanceof Error ? error.message : String(error)
      );
      process.exit(1);
    }
  });
