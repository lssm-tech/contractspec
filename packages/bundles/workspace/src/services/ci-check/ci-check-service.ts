/**
 * CI Check service.
 *
 * Orchestrates all validation checks for CI/CD pipelines.
 * Returns structured results suitable for multiple output formats.
 */

import {
  isFeatureFile,
  scanAllSpecsFromSource,
  validateSpecStructure,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import { analyzeIntegrity, type SpecLocation } from '../integrity';
import { analyzeDeps } from '../deps';
import { runDoctor } from '../doctor/doctor-service';
import { validateImplementationFiles } from '../validate/implementation-validator';
import { loadWorkspaceConfig } from '../config';
import { resolveAllImplementations } from '../implementation/resolver';
import { discoverLayers } from '../layer-discovery';
import { validateTestRefs } from '../test-link';
import { createParser, detectFormat, validateCoverage } from '../coverage';

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

  // Run test-refs checks (validate OperationSpec.tests references)
  if (checksToRun.includes('test-refs')) {
    const categoryStart = Date.now();
    const testRefIssues = await runTestRefsChecks(adapters, specFiles);
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
  if (options.implementation) {
    allCategories.push('implementation');
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
    const result = validateSpecStructure(content, file);

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
        specKey: issue.specKey,
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
    if (!specFile.includes('.operation.')) continue;

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
    if (!specFile.includes('.operation.')) continue;

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
 * Run test reference validation checks.
 *
 * Validates that all tests referenced in OperationSpec.tests actually exist.
 * Missing references are reported as ERRORS (blocking CI) to enforce contract integrity.
 */
async function runTestRefsChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[]
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  // Build inventory of test specs
  const testSpecIndex = new Map<string, SpecLocation>();
  const specsByFile = new Map<
    string,
    {
      key: string;
      version: string;
      testRefs?: { key: string; version: string }[];
    }[]
  >();

  // Scan all spec files to build inventory
  for (const specFile of specFiles) {
    const content = await fs.readFile(specFile);
    const scans = scanAllSpecsFromSource(content, specFile);

    for (const scan of scans) {
      if (!scan.key || !scan.version) continue;

      // Build test spec index
      if (scan.specType === 'test-spec') {
        const testKey = `${scan.key}.v${scan.version}`;
        testSpecIndex.set(testKey, {
          key: scan.key,
          version: scan.version,
          file: specFile,
          type: 'test-spec',
        });
      }

      // Track specs with test refs for validation
      if (scan.testRefs && scan.testRefs.length > 0) {
        if (!specsByFile.has(specFile)) {
          specsByFile.set(specFile, []);
        }
        specsByFile.get(specFile)?.push({
          key: scan.key,
          version: scan.version,
          testRefs: scan.testRefs,
        });
      }
    }
  }

  // Validate test references for each spec
  for (const [specFile, specs] of specsByFile) {
    for (const spec of specs) {
      if (!spec.testRefs) continue;

      const result = validateTestRefs(
        specFile,
        spec.key,
        spec.version,
        spec.testRefs,
        testSpecIndex,
        { treatMissingAsError: true }
      );

      // Report errors for missing test references
      for (const error of result.errors) {
        issues.push({
          ruleId: 'test-ref-missing',
          severity: 'error', // ERRORS - block CI for contract integrity
          message: error,
          category: 'test-refs',
          file: specFile,
          context: {
            specKey: spec.key,
            specVersion: spec.version,
            missingTests: result.missingTests,
          },
        });
      }
    }
  }

  return issues;
}

/**
 * Run coverage goal enforcement checks.
 *
 * Validates that TestSpec.coverage requirements are met by actual coverage data.
 * Requires a coverage report file to exist (from a previous test run).
 */
async function runCoverageChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[],
  options: CICheckOptions
): Promise<CIIssue[]> {
  const { fs, logger } = adapters;
  const issues: CIIssue[] = [];

  // Try to find coverage report
  const coverageDir = options.workspaceRoot
    ? `${options.workspaceRoot}/coverage`
    : './coverage';

  const possiblePaths = [
    `${coverageDir}/coverage-final.json`,
    `${coverageDir}/coverage.json`,
    `${coverageDir}/coverage-summary.json`,
  ];

  let coverageContent: string | undefined;
  let coveragePath: string | undefined;

  for (const path of possiblePaths) {
    const exists = await fs.exists(path);
    if (exists) {
      coverageContent = await fs.readFile(path);
      coveragePath = path;
      break;
    }
  }

  if (!coverageContent) {
    logger.info('No coverage report found, skipping coverage checks');
    return issues;
  }

  // Parse coverage report
  const format = detectFormat(coveragePath ?? 'coverage.json');
  const parser = createParser(format);
  const coverageReport = parser.parse(coverageContent);

  // Scan for test specs with coverage requirements
  for (const specFile of specFiles) {
    if (!specFile.includes('.test-spec.')) continue;

    const content = await fs.readFile(specFile);
    const scans = scanAllSpecsFromSource(content, specFile);

    for (const scan of scans) {
      if (scan.specType !== 'test-spec' || !scan.key || !scan.version) continue;

      // Extract coverage requirements (simplified - actual extraction would need more parsing)
      const coverageMatch = content.match(/coverage\s*:\s*\{([^}]+)\}/);
      if (!coverageMatch || !coverageMatch[1]) continue;

      // Parse coverage requirements
      const coverageBlock = coverageMatch[1];
      const requirements: Record<string, number> = {};

      const statementsMatch = coverageBlock.match(/statements\s*:\s*(\d+)/);
      if (statementsMatch && statementsMatch[1])
        requirements.statements = parseInt(statementsMatch[1], 10);

      const branchesMatch = coverageBlock.match(/branches\s*:\s*(\d+)/);
      if (branchesMatch && branchesMatch[1])
        requirements.branches = parseInt(branchesMatch[1], 10);

      const functionsMatch = coverageBlock.match(/functions\s*:\s*(\d+)/);
      if (functionsMatch && functionsMatch[1])
        requirements.functions = parseInt(functionsMatch[1], 10);

      const linesMatch = coverageBlock.match(/lines\s*:\s*(\d+)/);
      if (linesMatch && linesMatch[1])
        requirements.lines = parseInt(linesMatch[1], 10);

      if (Object.keys(requirements).length === 0) continue;

      // Validate coverage against requirements
      const result = validateCoverage(
        scan.key,
        scan.version,
        requirements,
        coverageReport.total
      );

      // Report failures as errors
      for (const failure of result.failures) {
        issues.push({
          ruleId: 'coverage-below-threshold',
          severity: 'error',
          message: failure.message,
          category: 'coverage',
          file: specFile,
          context: {
            specKey: scan.key,
            specVersion: scan.version,
            metric: failure.metric,
            required: failure.required,
            actual: failure.actual,
          },
        });
      }
    }
  }

  return issues;
}

/**
 * Run implementation verification checks.
 */
async function runImplementationChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  specFiles: string[],
  options: CICheckOptions
): Promise<CIIssue[]> {
  const { fs } = adapters;
  const issues: CIIssue[] = [];

  const config = await loadWorkspaceConfig(fs);
  const implOptions = options.implementation ?? {};

  // Only check operation specs by default
  const operationSpecs = specFiles.filter((f) => f.includes('.operation.'));

  // Resolve implementations for all specs
  const results = await resolveAllImplementations(
    operationSpecs,
    { fs },
    config,
    {
      computeHashes: implOptions.useCache ?? true,
    }
  );

  for (const result of results) {
    // Check if implementation is required
    if (implOptions.requireImplemented && result.status === 'missing') {
      issues.push({
        ruleId: 'impl-missing',
        severity: 'error',
        message: `Spec ${result.specKey} has no implementation`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          specVersion: result.specVersion,
          status: result.status,
        },
      });
    } else if (result.status === 'missing') {
      issues.push({
        ruleId: 'impl-missing',
        severity: 'warning',
        message: `Spec ${result.specKey} has no implementation`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          specVersion: result.specVersion,
          status: result.status,
        },
      });
    }

    // Check for partial implementations
    if (!implOptions.allowPartial && result.status === 'partial') {
      const missingImpls = result.implementations
        .filter((i) => !i.exists && i.type !== 'test')
        .map((i) => i.path);

      issues.push({
        ruleId: 'impl-partial',
        severity: 'warning',
        message: `Spec ${result.specKey} has partial implementation: missing ${missingImpls.join(', ')}`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          specVersion: result.specVersion,
          status: result.status,
          missingFiles: missingImpls,
        },
      });
    }

    // Report missing tests
    const missingTests = result.implementations.filter(
      (i) => !i.exists && i.type === 'test'
    );
    if (missingTests.length > 0) {
      issues.push({
        ruleId: 'impl-missing-tests',
        severity: 'note',
        message: `Spec ${result.specKey} missing test files: ${missingTests.map((t) => t.path).join(', ')}`,
        category: 'implementation',
        file: result.specPath,
        context: {
          specKey: result.specKey,
          missingTests: missingTests.map((t) => t.path),
        },
      });
    }
  }

  return issues;
}

/**
 * Run layer validation checks.
 */
async function runLayerChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  _options: CICheckOptions
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  // Discover all layers
  const result = await discoverLayers(adapters, {});

  // Validate features
  for (const [key, feature] of result.inventory.features) {
    // Check required meta fields
    if (!feature.key) {
      issues.push({
        ruleId: 'layer-feature-missing-key',
        severity: 'error',
        message: `Feature missing required 'key' field`,
        category: 'layers',
        file: feature.filePath,
        context: { key },
      });
    }

    if (!feature.owners?.length) {
      issues.push({
        ruleId: 'layer-feature-missing-owners',
        severity: 'warning',
        message: `Feature '${key}' missing 'owners' field`,
        category: 'layers',
        file: feature.filePath,
        context: { key },
      });
    }

    // Check for empty features
    if (
      feature.operations.length === 0 &&
      feature.events.length === 0 &&
      feature.presentations.length === 0
    ) {
      issues.push({
        ruleId: 'layer-feature-empty',
        severity: 'warning',
        message: `Feature '${key}' has no operations, events, or presentations`,
        category: 'layers',
        file: feature.filePath,
        context: { key },
      });
    }
  }

  // Validate examples
  for (const [key, example] of result.inventory.examples) {
    // Check required entrypoints
    if (!example.entrypoints.packageName) {
      issues.push({
        ruleId: 'layer-example-missing-package',
        severity: 'error',
        message: `Example '${key}' missing 'packageName' in entrypoints`,
        category: 'layers',
        file: example.filePath,
        context: { key },
      });
    }

    // Check required surfaces
    if (
      !example.surfaces.templates &&
      !example.surfaces.sandbox.enabled &&
      !example.surfaces.studio.enabled &&
      !example.surfaces.mcp.enabled
    ) {
      issues.push({
        ruleId: 'layer-example-no-surfaces',
        severity: 'warning',
        message: `Example '${key}' has no enabled surfaces`,
        category: 'layers',
        file: example.filePath,
        context: { key },
      });
    }
  }

  // Validate workspace configs
  for (const config of result.inventory.workspaceConfigs.values()) {
    if (!config.valid) {
      for (const error of config.errors) {
        issues.push({
          ruleId: 'layer-workspace-config-invalid',
          severity: 'error',
          message: `Invalid workspace config: ${error}`,
          category: 'layers',
          file: config.file,
        });
      }
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
    'test-refs': 'Test Reference Validation',
    coverage: 'Coverage Verification',
    implementation: 'Implementation Verification',
    layers: 'Contract Layers Validation',
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
