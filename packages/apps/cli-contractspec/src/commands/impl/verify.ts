/**
 * impl verify command
 *
 * Verify implementations against their specs.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import type {
  VerificationReport,
  VerificationTier,
} from '@contractspec/lib.contracts-spec/llm';
import {
  createConsoleLoggerAdapter,
  createFileSystemCacheStorage,
  createNodeFsAdapter,
  createVerificationCacheService,
  createVerifyService,
  listSpecs,
  loadWorkspaceConfig,
  resolveAllImplementations,
  type ResolvedImplementation,
  type SpecImplementationResult,
  VerificationCacheService,
} from '@contractspec/bundle.workspace';
import type { ImplVerifyOptions } from './types';
import type { SpecScanResult } from '@contractspec/module.workspace';
import type { Log, Result } from 'sarif';

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
function outputSingleImplementationText(
  implementationReportResult: SpecImplementationReportResult
): void {
  console.log(
    `\n  ${chalk.bold(implementationReportResult.implementationPath)}`
  );
  if (implementationReportResult.isImplementationCached) {
    console.log(chalk.gray('    (cached result)'));
  }

  implementationReportResult.reports.entries().forEach(([tier, report]) => {
    const statusIcon = report.passed ? chalk.green('✓') : chalk.red('✗');
    const tierName = tier
      .replace('_', ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    console.log(
      `\n    ${statusIcon} ${chalk.bold(tierName)} (${report.score}%)`
    );

    if (report.issues.length > 0) {
      for (const issue of report.issues) {
        console.log(`      ${severityIcon(issue.severity)} ${issue.message}`);
        if (issue.suggestion) {
          console.log(
            `        ${chalk.gray('→')} ${chalk.gray(issue.suggestion)}`
          );
        }
      }
    }
  });

  // Overall result
  const allPassed = Array.from(
    implementationReportResult.reports.values()
  ).every((r) => r.passed);
  const avgScore = Math.round(
    Array.from(implementationReportResult.reports.values()).reduce(
      (sum, r) => sum + r.score,
      0
    ) / implementationReportResult.reports.size
  );

  if (allPassed) {
    console.log(chalk.green(`    ✓ All checks passed (${avgScore}%)`));
  } else {
    console.log(chalk.red(`    ✗ Some checks failed (${avgScore}%)`));
  }
}

function outputText(results: SpecsImplementationReportsResult): void {
  console.log(`\n${chalk.bold('Specs implementation result')}`);
  if (results.areSpecAllCached) {
    console.log(chalk.gray('  (cached result)'));
  }

  results.reports.forEach((specReport) => {
    console.log(`\n${chalk.bold(specReport.specPath)}`);
    if (specReport.isSpecCached) {
      console.log(chalk.gray('  (cached result)'));
    }

    specReport.reports.forEach((implementationReport) => {
      outputSingleImplementationText(implementationReport);
    });

    if (specReport.hasSucceed) {
      console.log(chalk.green(`  ✓ All checks passed`));
    } else {
      console.log(chalk.red(`  ✗ Some checks failed`));
      // console.log(chalk.red(`  ✗ Some checks failed (${avgScore}%)`));
    }
  });
}

/**
 * Output verification result as JSON
 */
function formatOutputSingleImplementationJson(
  reportResult: SpecImplementationReportResult
) {
  return {
    implementationPath: reportResult.implementationPath,
    isImplementationCached: reportResult.isImplementationCached,
    reports: Object.fromEntries(reportResult.reports),
    passed: Array.from(reportResult.reports.values()).every((r) => r.passed),
    score: Math.round(
      Array.from(reportResult.reports.values()).reduce(
        (sum, r) => sum + r.score,
        0
      ) / reportResult.reports.size
    ),
  };
}
function outputJson(results: SpecsImplementationReportsResult): void {
  const result = results.reports.values().map((resultReport) => ({
    specPath: resultReport.specPath,
    isSpecCached: resultReport.isSpecCached,
    reports: resultReport.reports.map(formatOutputSingleImplementationJson),
  }));
  console.log(JSON.stringify(result, null, 2));
}

/**
 * Output verification result as SARIF
 */
function outputSarif(results: SpecsImplementationReportsResult): void {
  const errorResults = results.reports.flatMap<Result>((specReport) => {
    return specReport.reports.flatMap<Result>((implementationReport) => {
      return [...implementationReport.reports.values()].flatMap<Result>(
        (report) => {
          return report.issues.map<Result>(
            (reportIssue): Result => ({
              ruleId: 'impl-verify',
              level:
                reportIssue.severity === 'error'
                  ? 'error'
                  : reportIssue.severity === 'warning'
                    ? 'warning'
                    : 'note',
              message: { text: reportIssue.message },
              locations: [
                {
                  physicalLocation: {
                    artifactLocation: {
                      uri:
                        reportIssue.location?.file ??
                        implementationReport.implementationPath,
                    },
                    region: reportIssue.location?.line
                      ? { startLine: reportIssue.location?.line }
                      : undefined,
                  },
                },
              ],
            })
          );
        }
      );
    });
  });

  const sarif: Log = {
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
        results: errorResults,
      },
    ],
  };

  console.log(JSON.stringify(sarif, null, 2));
}

type SpecImplementationReport = Map<VerificationTier, VerificationReport>;
interface SpecImplementationReportResult {
  implementationPath: string;
  isImplementationCached: boolean;
  hasSucceed: boolean;
  reports: SpecImplementationReport;
}
interface SpecImplementationReportsResult {
  isSpecCached: boolean;
  specPath: string;
  hasSucceed: boolean;
  reports: SpecImplementationReportResult[];
}

interface SpecsImplementationReportsResult {
  areSpecAllCached: boolean;
  hasSucceed: boolean;
  reports: SpecImplementationReportsResult[];
}

export const verifySpecImplementation = async (
  options: ImplVerifyOptions,
  spinner: Ora,
  verificationCacheService: VerificationCacheService,
  spec: SpecScanResult,
  specImplementation: ResolvedImplementation
): Promise<SpecImplementationReportResult> => {
  // Check cache
  const tiers = getTiers(options.tier);
  let isImplementationCached = true;
  const reports: SpecImplementationReport = new Map<
    VerificationTier,
    VerificationReport
  >();

  if (!options.noCache) {
    // Check cache for each tier
    for (const tier of tiers) {
      const cacheKey = verificationCacheService.createKey(
        spec.sourceBlock || '',
        specImplementation.implementationSourceContent || '',
        tier
      );
      const cacheResult = await verificationCacheService.lookup(cacheKey);
      if (cacheResult.hit) {
        reports.set(tier, cacheResult.entry.result);
      } else {
        isImplementationCached = false;
      }
    }
  }

  // Run verification for uncached tiers
  const uncachedTiers = tiers.filter((t) => !reports.has(t));
  if (uncachedTiers.length === 0) {
    return {
      hasSucceed: reports
        .values()
        .reduce((acc: boolean, r) => acc && r.passed, true),
      isImplementationCached,
      reports,
      implementationPath: specImplementation.path,
    };
  }

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
        name: spec.key,
        version: spec.version,
        kind: 'command',
      },
    } as never,
    specImplementation.implementationSourceContent || '',
    { tiers: uncachedTiers, failFast: options.failFast }
  );

  // Store results
  let hasSucceed = true;
  for (const [tier, report] of result.reports) {
    reports.set(tier, report);

    if (!report.passed) {
      hasSucceed = false;
    }

    // Cache the result
    if (!options.noCache) {
      const cacheKey = verificationCacheService.createKey(
        spec.sourceBlock || '',
        specImplementation.implementationSourceContent || '',
        tier
      );
      await verificationCacheService.store(cacheKey, report, {
        specName: spec.key,
        implPath: specImplementation.path,
      });
    }
  }
  return {
    isImplementationCached,
    reports,
    hasSucceed,
    implementationPath: specImplementation.path,
  };
};

export const verifySpecImplementations = async (
  options: ImplVerifyOptions,
  spinner: Ora,
  verificationCacheService: VerificationCacheService,
  spec: SpecScanResult,
  specImplementations: SpecImplementationResult
): Promise<SpecImplementationReportsResult> => {
  const reports: SpecImplementationReportResult[] =
    new Array<SpecImplementationReportResult>();
  let isSpecCached = true;
  let hasSucceed = true;

  for (const specImplementation of specImplementations.implementations) {
    const implementationValidationResult = await verifySpecImplementation(
      options,
      spinner,
      verificationCacheService,
      spec,
      specImplementation
    );
    if (!implementationValidationResult.hasSucceed) {
      hasSucceed = false;
    }
    if (!implementationValidationResult.isImplementationCached) {
      isSpecCached = false;
    }
    reports.push(implementationValidationResult);
  }

  return { isSpecCached, hasSucceed, reports, specPath: spec.filePath };
};

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

    const specs = await listSpecs(adapters, {
      pattern: specPath || options.spec,
    });
    const resolvedSpecs = await resolveAllImplementations(
      specs,
      adapters,
      config
    );

    const specsWithImplementation = resolvedSpecs.reduce<
      SpecImplementationResult[]
    >((acc, spec) => {
      const haveImplementation = spec.implementations.some(
        (implementation) =>
          implementation.exists && implementation.type !== 'test'
      );
      if (haveImplementation) {
        acc.push(spec);
      }
      return acc;
    }, []);
    if (!specsWithImplementation.length) {
      spinner.fail('No implementations found (test implementations excluded)');
      console.log(
        chalk.yellow(
          'Run "contractspec impl list" to see expected implementations.'
        )
      );
      process.exitCode = 1;
      return;
    }

    // Set up cache
    const cacheStorage = createFileSystemCacheStorage();
    const cacheService = createVerificationCacheService(cacheStorage);

    const results: SpecsImplementationReportsResult = {
      areSpecAllCached: true,
      hasSucceed: true,
      reports: new Array<SpecImplementationReportsResult>(),
    };
    for (const specWithImplementation of specsWithImplementation) {
      const spec = specs.find(
        (spec) =>
          spec.key === specWithImplementation.specKey &&
          spec.version === specWithImplementation.specVersion
      );
      if (!spec) {
        throw new Error(
          `Should not happen: spec ${specWithImplementation.specKey} not found.`
        );
      }

      const specReports = await verifySpecImplementations(
        options,
        spinner,
        cacheService,
        spec,
        specWithImplementation
      );
      results.reports.push(specReports);
      if (!specReports.hasSucceed) {
        results.hasSucceed = false;
      }
      if (!specReports.isSpecCached) {
        results.areSpecAllCached = false;
      }
    }

    spinner.stop();

    // Output results
    switch (options.format) {
      case 'json':
        outputJson(results);
        break;
      case 'sarif':
        outputSarif(results);
        break;
      default:
        outputText(results);
    }

    // Exit with error if verification failed
    if (!results.hasSucceed) {
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
