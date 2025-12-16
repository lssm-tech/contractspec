/**
 * CI Check service.
 *
 * Orchestrates all validation checks for CI/CD pipelines.
 * Returns structured results suitable for multiple output formats.
 */

import {
  validateSpecStructure,
  isFeatureFile,
} from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import { analyzeIntegrity } from '../integrity';
import { analyzeDeps } from '../deps';
import { runDoctor } from '../doctor/doctor-service';
import { validateImplementationFiles } from '../validate-implementation';
import { loadWorkspaceConfig } from '../config';
import type {
  CICheckCategory,
  CICheckCategorySummary,
  CICheckOptions,
  CICheckResult,
  CIIssue,
} from './types';

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
  const files = await fs.glob({ pattern: options.pattern });
  const specFiles = files.filter(
    (f) => !isFeatureFile(f) && !f.includes('.test.') && !f.includes('.spec.')
  );

  // Run spec structure validation
  if (checksToRun.includes('structure')) {
    const categoryStart = Date.now();
    const structureIssues = await runStructureChecks(adapters, specFiles);
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

/**
 * Determine which checks to run based on options.
 */
function getChecksToRun(options: CICheckOptions): CICheckCategory[] {
  const allCategories: CICheckCategory[] = [
    'structure',
    'integrity',
    'deps',
    'doctor',
  ];

  // Add optional checks if explicitly requested
  if (options.checkHandlers) {
    allCategories.push('handlers');
  }
  if (options.checkTests) {
    allCategories.push('tests');
  }

  // If specific checks are requested, use those
  if (options.checks && options.checks.length > 0) {
    return options.checks;
  }

  // Otherwise, use all minus skipped
  if (options.skip && options.skip.length > 0) {
    return allCategories.filter((c) => !options.skip?.includes(c));
  }

  return allCategories;
}

/**
 * Run spec structure validation checks.
 */
async function runStructureChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[]
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  for (const file of specFiles) {
    const content = await fs.readFile(file);
    const fileName = fs.basename(file);

    const result = validateSpecStructure(content, fileName);

    for (const error of result.errors) {
      issues.push({
        ruleId: 'spec-structure-error',
        severity: 'error',
        message: error,
        category: 'structure',
        file,
      });
    }

    for (const warning of result.warnings) {
      issues.push({
        ruleId: 'spec-structure-warning',
        severity: 'warning',
        message: warning,
        category: 'structure',
        file,
      });
    }
  }

  return issues;
}

/**
 * Run integrity analysis checks.
 */
async function runIntegrityChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: CICheckOptions
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  const result = await analyzeIntegrity(adapters, {
    pattern: options.pattern,
    all: true,
  });

  for (const issue of result.issues) {
    issues.push({
      ruleId: `integrity-${issue.type}`,
      severity: issue.severity === 'error' ? 'error' : 'warning',
      message: issue.message,
      category: 'integrity',
      file: issue.file,
      context: {
        specName: issue.specName,
        specType: issue.specType,
        featureKey: issue.featureKey,
        ref: issue.ref,
      },
    });
  }

  return issues;
}

/**
 * Run dependency analysis checks.
 */
async function runDepsChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: CICheckOptions
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  const result = await analyzeDeps(adapters, {
    pattern: options.pattern,
  });

  // Report circular dependencies as errors
  for (const cycle of result.cycles) {
    issues.push({
      ruleId: 'deps-circular',
      severity: 'error',
      message: `Circular dependency detected: ${cycle.join(' → ')}`,
      category: 'deps',
      context: { cycle },
    });
  }

  // Report missing dependencies as errors
  for (const item of result.missing) {
    for (const missing of item.missing) {
      issues.push({
        ruleId: 'deps-missing',
        severity: 'error',
        message: `Missing dependency: ${item.contract} requires ${missing}`,
        category: 'deps',
        context: { contract: item.contract, missing },
      });
    }
  }

  return issues;
}

/**
 * Run doctor checks (skipping AI in CI).
 */
async function runDoctorChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: CICheckOptions
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  const workspaceRoot = options.workspaceRoot ?? process.cwd();

  const result = await runDoctor(adapters, {
    workspaceRoot,
    skipAi: true, // Always skip AI in CI
    categories: ['cli', 'config', 'deps', 'workspace'], // Skip AI and MCP
  });

  for (const check of result.checks) {
    if (check.status === 'fail') {
      issues.push({
        ruleId: `doctor-${check.category}-${check.name.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'error',
        message: `${check.name}: ${check.message}`,
        category: 'doctor',
        context: { details: check.details },
      });
    } else if (check.status === 'warn') {
      issues.push({
        ruleId: `doctor-${check.category}-${check.name.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'warning',
        message: `${check.name}: ${check.message}`,
        category: 'doctor',
        context: { details: check.details },
      });
    }
  }

  return issues;
}

/**
 * Run handler implementation checks.
 */
async function runHandlerChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[]
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  const config = await loadWorkspaceConfig(fs);

  for (const specFile of specFiles) {
    // Only check operation specs
    if (!specFile.includes('.contracts.')) continue;

    const result = await validateImplementationFiles(specFile, { fs }, config, {
      checkHandlers: true,
      outputDir: config.outputDir,
    });

    for (const error of result.errors) {
      issues.push({
        ruleId: 'handler-missing',
        severity: 'warning', // Handler missing is a warning, not error
        message: error,
        category: 'handlers',
        file: specFile,
      });
    }

    for (const warning of result.warnings) {
      issues.push({
        ruleId: 'handler-warning',
        severity: 'warning',
        message: warning,
        category: 'handlers',
        file: specFile,
      });
    }
  }

  return issues;
}

/**
 * Run test coverage checks.
 */
async function runTestChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[]
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  const config = await loadWorkspaceConfig(fs);

  for (const specFile of specFiles) {
    // Only check operation specs
    if (!specFile.includes('.contracts.')) continue;

    const result = await validateImplementationFiles(specFile, { fs }, config, {
      checkTests: true,
      outputDir: config.outputDir,
    });

    for (const error of result.errors) {
      issues.push({
        ruleId: 'test-missing',
        severity: 'warning', // Test missing is a warning, not error
        message: error,
        category: 'tests',
        file: specFile,
      });
    }

    for (const warning of result.warnings) {
      issues.push({
        ruleId: 'test-warning',
        severity: 'warning',
        message: warning,
        category: 'tests',
        file: specFile,
      });
    }
  }

  return issues;
}

/**
 * Create a category summary from issues.
 */
function createCategorySummary(
  category: CICheckCategory,
  issues: CIIssue[],
  durationMs: number
): CICheckCategorySummary {
  const categoryLabels: Record<CICheckCategory, string> = {
    structure: 'Spec Structure Validation',
    integrity: 'Contract Integrity Analysis',
    deps: 'Dependency Analysis',
    doctor: 'Installation Health',
    handlers: 'Handler Implementation',
    tests: 'Test Coverage',
  };

  const errors = issues.filter((i) => i.severity === 'error').length;
  const warnings = issues.filter((i) => i.severity === 'warning').length;
  const notes = issues.filter((i) => i.severity === 'note').length;

  return {
    category,
    label: categoryLabels[category],
    errors,
    warnings,
    notes,
    passed: errors === 0,
    durationMs,
  };
}

/**
 * Get git information if available.
 */
async function getGitInfo(
  fs: FsAdapter
): Promise<{ commitSha?: string; branch?: string }> {
  try {
    // Try to read from .git/HEAD and refs
    const gitHeadPath = '.git/HEAD';
    if (!(await fs.exists(gitHeadPath))) {
      return {};
    }

    const headContent = await fs.readFile(gitHeadPath);
    const refMatch = headContent.match(/^ref: (.+)$/m);

    if (refMatch) {
      const branch = refMatch[1]?.replace('refs/heads/', '');
      const refPath = `.git/${refMatch[1]}`;

      if (await fs.exists(refPath)) {
        const commitSha = (await fs.readFile(refPath)).trim();
        return { commitSha, branch };
      }

      return { branch };
    }

    // Detached HEAD - content is the SHA
    const commitSha = headContent.trim();
    return { commitSha };
  } catch {
    return {};
  }
}
