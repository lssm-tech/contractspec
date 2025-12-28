/**
 * impl verify command
 *
 * Verify implementations against their specs.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import type {
  VerificationTier,
  VerificationReport,
} from '@lssm/lib.contracts/llm';
import {
  createNodeFsAdapter,
  createConsoleLoggerAdapter,
  loadWorkspaceConfig,
  resolveImplementations,
  createVerifyService,
  createVerificationCacheService,
  createFileSystemCacheStorage,
} from '@lssm/bundle.contractspec-workspace';
import type { ImplVerifyOptions } from './types';

/**
 * Map tier option to verification tiers
 */
function getTiers(tier?: string): VerificationTier[] {
  switch (tier) {
    case 'structure':
      return ['structure'];
    case 'behavior':
      return ['structure', 'behavior'];
    case 'ai':
      return ['structure', 'behavior', 'ai_review'];
    case 'all':
      return ['structure', 'behavior', 'ai_review'];
    default:
      return ['structure', 'behavior'];
  }
}

/**
 * Format issue severity
 */
function severityIcon(severity: string): string {
  switch (severity) {
    case 'error':
      return chalk.red('✗');
    case 'warning':
      return chalk.yellow('⚠');
    case 'info':
      return chalk.blue('ℹ');
    default:
      return chalk.gray('•');
  }
}

/**
 * Output verification result as text
 */
function outputText(
  specName: string,
  reports: Map<VerificationTier, VerificationReport>,
  cached: boolean
): void {
  console.log(`\n${chalk.bold(specName)}`);
  if (cached) {
    console.log(chalk.gray('  (cached result)'));
  }

  for (const [tier, report] of reports) {
    const statusIcon = report.passed ? chalk.green('✓') : chalk.red('✗');
    const tierName = tier
      .replace('_', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    console.log(`\n  ${statusIcon} ${chalk.bold(tierName)} (${report.score}%)`);

    if (report.issues.length > 0) {
      for (const issue of report.issues) {
        console.log(`    ${severityIcon(issue.severity)} ${issue.message}`);
        if (issue.suggestion) {
          console.log(
            `      ${chalk.gray('→')} ${chalk.gray(issue.suggestion)}`
          );
        }
      }
    }
  }

  // Overall result
  const allPassed = Array.from(reports.values()).every((r) => r.passed);
  const avgScore = Math.round(
    Array.from(reports.values()).reduce((sum, r) => sum + r.score, 0) /
      reports.size
  );

  console.log();
  if (allPassed) {
    console.log(chalk.green(`  ✓ All checks passed (${avgScore}%)`));
  } else {
    console.log(chalk.red(`  ✗ Some checks failed (${avgScore}%)`));
  }
}

/**
 * Output verification result as JSON
 */
function outputJson(
  specName: string,
  reports: Map<VerificationTier, VerificationReport>,
  cached: boolean
): void {
  const result = {
    specName,
    cached,
    reports: Object.fromEntries(reports),
    passed: Array.from(reports.values()).every((r) => r.passed),
    score: Math.round(
      Array.from(reports.values()).reduce((sum, r) => sum + r.score, 0) /
        reports.size
    ),
  };
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Output verification result as SARIF
 */
function outputSarif(
  specPath: string,
  reports: Map<VerificationTier, VerificationReport>
): void {
  const allIssues = Array.from(reports.values()).flatMap((r) => r.issues);

  const sarif = {
    $schema:
      'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
    version: '2.1.0',
    runs: [
      {
        tool: {
          driver: {
            name: 'ContractSpec',
            version: '1.0.0',
            rules: [
              {
                id: 'impl-verify',
                shortDescription: { text: 'Implementation verification' },
              },
            ],
          },
        },
        results: allIssues.map((issue) => ({
          ruleId: 'impl-verify',
          level:
            issue.severity === 'error'
              ? 'error'
              : issue.severity === 'warning'
                ? 'warning'
                : 'note',
          message: { text: issue.message },
          locations: issue.location
            ? [
                {
                  physicalLocation: {
                    artifactLocation: { uri: issue.location.file ?? specPath },
                    region: issue.location.line
                      ? { startLine: issue.location.line }
                      : undefined,
                  },
                },
              ]
            : [],
        })),
      },
    ],
  };

  console.log(JSON.stringify(sarif, null, 2));
}

/**
 * Run verify command
 */
async function runVerify(
  specPath: string,
  options: ImplVerifyOptions
): Promise<void> {
  const spinner = ora('Verifying implementation...').start();

  try {
    const fs = createNodeFsAdapter();
    const logger = createConsoleLoggerAdapter();
    const config = await loadWorkspaceConfig(fs);
    const adapters = { fs, logger };

    // Resolve implementations
    const resolved = await resolveImplementations(specPath, adapters, config);

    if (resolved.implementations.length === 0) {
      spinner.fail('No implementations found');
      console.log(
        chalk.yellow(
          'Run "contractspec impl list" to see expected implementations.'
        )
      );
      process.exitCode = 1;
      return;
    }

    // Find a valid implementation to verify
    const implToVerify = resolved.implementations.find(
      (i) => i.exists && i.type !== 'test'
    );

    if (!implToVerify) {
      spinner.fail('No existing implementation files found');
      process.exitCode = 1;
      return;
    }

    // Set up cache
    const cacheStorage = createFileSystemCacheStorage();
    const cacheService = createVerificationCacheService(cacheStorage);

    // Read spec and implementation content
    const specContent = await fs.readFile(specPath);
    const implContent = await fs.readFile(implToVerify.path);

    // Check cache
    const tiers = getTiers(options.tier);
    let cached = false;
    const reports = new Map<VerificationTier, VerificationReport>();

    if (!options.noCache) {
      // Check cache for each tier
      for (const tier of tiers) {
        const cacheKey = cacheService.createKey(specContent, implContent, tier);
        const cacheResult = await cacheService.lookup(cacheKey);
        if (cacheResult.hit) {
          reports.set(tier, cacheResult.entry.result);
          cached = true;
        }
      }
    }

    // Run verification for uncached tiers
    const uncachedTiers = tiers.filter((t) => !reports.has(t));

    if (uncachedTiers.length > 0) {
      spinner.text = 'Running verification checks...';

      // Create verify service
      const verifyService = createVerifyService({
        aiApiKey: process.env.CONTRACTSPEC_AI_API_KEY,
        aiProvider:
          (process.env.CONTRACTSPEC_AI_PROVIDER as 'anthropic' | 'openai') ??
          'anthropic',
      });

      // We need to load the spec to verify
      // For now, use a simplified verification approach
      const result = await verifyService.verify(
        {
          meta: {
            name: resolved.specKey,
            version: resolved.specVersion,
            kind: 'command',
          },
        } as never,
        implContent,
        { tiers: uncachedTiers, failFast: options.failFast }
      );

      // Store results
      for (const [tier, report] of result.reports) {
        reports.set(tier, report);

        // Cache the result
        if (!options.noCache) {
          const cacheKey = cacheService.createKey(
            specContent,
            implContent,
            tier
          );
          await cacheService.store(cacheKey, report, {
            specName: resolved.specKey,
            implPath: implToVerify.path,
          });
        }
      }
    }

    spinner.stop();

    // Output results
    switch (options.format) {
      case 'json':
        outputJson(resolved.specKey, reports, cached);
        break;
      case 'sarif':
        outputSarif(specPath, reports);
        break;
      default:
        outputText(resolved.specKey, reports, cached);
    }

    // Exit with error if verification failed
    const allPassed = Array.from(reports.values()).every((r) => r.passed);
    if (!allPassed) {
      process.exitCode = 1;
    }
  } catch (error) {
    spinner.fail('Verification failed');
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exitCode = 1;
  }
}

/**
 * Create the verify command
 */
export function createVerifyCommand(): Command {
  return new Command('verify')
    .description('Verify implementation against spec')
    .argument('<spec>', 'Path to spec file')
    .option(
      '-t, --tier <tier>',
      'Verification tier: structure, behavior, ai, all',
      'behavior'
    )
    .option('--no-cache', 'Bypass cache and re-run verification')
    .option('--fail-fast', 'Stop on first failure')
    .option('-f, --format <format>', 'Output format: text, json, sarif', 'text')
    .action(async (spec: string, options: ImplVerifyOptions) => {
      await runVerify(spec, options);
    });
}
