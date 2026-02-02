/**
 * CI Check service.
 *
 * Orchestrates all validation checks for CI/CD pipelines.
 * Returns structured results suitable for multiple output formats.
 */

import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';

import type {
  CICheckCategorySummary,
  CICheckOptions,
  CICheckResult,
  CIIssue,
} from './types';

import {
  runCoverageChecks,
  runDepsChecks,
  runDoctorChecks,
  runDriftChecks,
  runHandlerChecks,
  runImplementationChecks,
  runIntegrityChecks,
  runLayerChecks,
  runStructureChecks,
  runTestChecks,
  runTestRefsChecks,
} from './checks';

import { createCategorySummary, getChecksToRun, getGitInfo } from './utils';
import { listSpecs } from '../list';

/**
 * Run all CI checks and return structured results.
 */
export async function runCIChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: CICheckOptions = {}
): Promise<CICheckResult> {
  const startTime = Date.now();
  const { fs, logger } = adapters;

  const issues: CIIssue[] = [];
  const categorySummaries: CICheckCategorySummary[] = [];

  // Determine which checks to run
  const checksToRun = getChecksToRun(options);

  logger.info('Starting CI checks...', { checks: checksToRun });

  // Discover spec files
  const specFiles = await listSpecs(adapters, {
    pattern: options.pattern as string | undefined,
    type: ['feature', 'test-spec'],
  });

  // Run spec structure validation
  if (checksToRun.includes('structure')) {
    const categoryStart = Date.now();
    const structureIssues = await runStructureChecks(specFiles);
    issues.push(...structureIssues);
    categorySummaries.push(
      createCategorySummary(
        'structure',
        structureIssues,
        Date.now() - categoryStart
      )
    );
  }

  // Run integrity analysis
  if (checksToRun.includes('integrity')) {
    const categoryStart = Date.now();
    const integrityIssues = await runIntegrityChecks(adapters, options);
    issues.push(...integrityIssues);
    categorySummaries.push(
      createCategorySummary(
        'integrity',
        integrityIssues,
        Date.now() - categoryStart
      )
    );
  }

  // Run dependency analysis
  if (checksToRun.includes('deps')) {
    const categoryStart = Date.now();
    const depsIssues = await runDepsChecks(adapters, options);
    issues.push(...depsIssues);
    categorySummaries.push(
      createCategorySummary('deps', depsIssues, Date.now() - categoryStart)
    );
  }

  // Run doctor checks (skip AI in CI)
  if (checksToRun.includes('doctor')) {
    const categoryStart = Date.now();
    const doctorIssues = await runDoctorChecks(adapters, options);
    issues.push(...doctorIssues);
    categorySummaries.push(
      createCategorySummary('doctor', doctorIssues, Date.now() - categoryStart)
    );
  }

  // Run handler checks
  if (checksToRun.includes('handlers') || options.checkHandlers) {
    const categoryStart = Date.now();
    const handlerIssues = await runHandlerChecks(adapters, specFiles);
    issues.push(...handlerIssues);
    categorySummaries.push(
      createCategorySummary(
        'handlers',
        handlerIssues,
        Date.now() - categoryStart
      )
    );
  }

  // Run test checks
  if (checksToRun.includes('tests') || options.checkTests) {
    const categoryStart = Date.now();
    const testIssues = await runTestChecks(adapters, specFiles);
    issues.push(...testIssues);
    categorySummaries.push(
      createCategorySummary('tests', testIssues, Date.now() - categoryStart)
    );
  }

  // Run test-refs checks (validate OperationSpec.tests references)
  if (checksToRun.includes('test-refs')) {
    const categoryStart = Date.now();
    const testRefIssues = await runTestRefsChecks(specFiles);
    issues.push(...testRefIssues);
    categorySummaries.push(
      createCategorySummary(
        'test-refs',
        testRefIssues,
        Date.now() - categoryStart
      )
    );
  }

  // Run coverage checks (validate TestSpec.coverage requirements)
  if (checksToRun.includes('coverage')) {
    const categoryStart = Date.now();
    const coverageIssues = await runCoverageChecks(
      adapters,
      specFiles,
      options
    );
    issues.push(...coverageIssues);
    categorySummaries.push(
      createCategorySummary(
        'coverage',
        coverageIssues,
        Date.now() - categoryStart
      )
    );
  }

  // Run implementation checks
  if (checksToRun.includes('implementation')) {
    const categoryStart = Date.now();
    const implIssues = await runImplementationChecks(
      adapters,
      specFiles,
      options
    );
    issues.push(...implIssues);
    categorySummaries.push(
      createCategorySummary(
        'implementation',
        implIssues,
        Date.now() - categoryStart
      )
    );
  }

  // Run layers checks
  if (checksToRun.includes('layers')) {
    const categoryStart = Date.now();
    const layerIssues = await runLayerChecks(adapters, options);
    issues.push(...layerIssues);
    categorySummaries.push(
      createCategorySummary('layers', layerIssues, Date.now() - categoryStart)
    );
  }

  // Run drift checks
  if (checksToRun.includes('drift')) {
    const categoryStart = Date.now();
    const driftIssues = await runDriftChecks(adapters, options);
    issues.push(...driftIssues);
    categorySummaries.push(
      createCategorySummary('drift', driftIssues, Date.now() - categoryStart)
    );
  }

  // Calculate totals
  const totalErrors = issues.filter((i) => i.severity === 'error').length;
  const totalWarnings = issues.filter((i) => i.severity === 'warning').length;
  const totalNotes = issues.filter((i) => i.severity === 'note').length;

  // Determine success (no errors, or no warnings if failOnWarnings)
  const success = options.failOnWarnings
    ? totalErrors === 0 && totalWarnings === 0
    : totalErrors === 0;

  // Try to get git info
  const gitInfo = await getGitInfo(fs);

  const result: CICheckResult = {
    success,
    totalErrors,
    totalWarnings,
    totalNotes,
    issues,
    categories: categorySummaries,
    durationMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    ...gitInfo,
  };

  logger.info('CI checks complete', {
    success,
    errors: totalErrors,
    warnings: totalWarnings,
    durationMs: result.durationMs,
  });

  return result;
}
