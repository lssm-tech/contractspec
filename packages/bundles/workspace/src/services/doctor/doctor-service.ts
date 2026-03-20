/**
 * Doctor service.
 *
 * Orchestrates health checks and applies fixes.
 */

import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import type {
  CheckCategory,
  CheckResult,
  CheckContext,
  DoctorOptions,
  DoctorResult,
  DoctorPromptCallbacks,
} from './types';
import { ALL_CHECK_CATEGORIES, CHECK_CATEGORY_LABELS } from './types';
import {
  runCliChecks,
  runConfigChecks,
  runMcpChecks,
  runDepsChecks,
  runWorkspaceChecks,
  runAiChecks,
  runLayerChecks,
} from './checks/index';
import {
  findPackageRoot,
  findWorkspaceRoot,
  isMonorepo,
  getPackageName,
} from '../../adapters/workspace';

interface DoctorCheckRunners {
  runCliChecks: typeof runCliChecks;
  runConfigChecks: typeof runConfigChecks;
  runMcpChecks: typeof runMcpChecks;
  runDepsChecks: typeof runDepsChecks;
  runWorkspaceChecks: typeof runWorkspaceChecks;
  runAiChecks: typeof runAiChecks;
  runLayerChecks: typeof runLayerChecks;
}

interface DoctorWorkspaceResolvers {
  findWorkspaceRoot: typeof findWorkspaceRoot;
  findPackageRoot: typeof findPackageRoot;
  isMonorepo: typeof isMonorepo;
  getPackageName: typeof getPackageName;
}

interface DoctorDependencies {
  checks: DoctorCheckRunners;
  workspace: DoctorWorkspaceResolvers;
}

const defaultDoctorDependencies: DoctorDependencies = {
  checks: {
    runCliChecks,
    runConfigChecks,
    runMcpChecks,
    runDepsChecks,
    runWorkspaceChecks,
    runAiChecks,
    runLayerChecks,
  },
  workspace: {
    findWorkspaceRoot,
    findPackageRoot,
    isMonorepo,
    getPackageName,
  },
};

/**
 * Default prompt callbacks that always decline fixes.
 */
const defaultPrompts: DoctorPromptCallbacks = {
  confirm: async () => false,
  input: async () => '',
};

/**
 * Run all health checks and optionally apply fixes.
 */
export async function runDoctor(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: DoctorOptions,
  prompts: DoctorPromptCallbacks = defaultPrompts,
  dependencies: DoctorDependencies = defaultDoctorDependencies
): Promise<DoctorResult> {
  const { fs, logger } = adapters;
  const categories = options.categories ?? ALL_CHECK_CATEGORIES;
  const { checks, workspace } = dependencies;

  // Detect monorepo context
  const workspaceRoot = workspace.findWorkspaceRoot(options.workspaceRoot);
  const packageRoot = workspace.findPackageRoot(options.workspaceRoot);
  const monorepo = workspace.isMonorepo(workspaceRoot);
  const packageName = monorepo
    ? workspace.getPackageName(packageRoot)
    : undefined;

  const ctx: CheckContext = {
    workspaceRoot,
    packageRoot,
    isMonorepo: monorepo,
    packageName,
    verbose: options.verbose ?? false,
  };

  // Log monorepo context if detected
  if (monorepo) {
    const pkgInfo = packageName ? ` (package: ${packageName})` : '';
    logger.info(`Detected monorepo${pkgInfo}`);
  }

  const allResults: CheckResult[] = [];

  // Run checks for each category
  for (const category of categories) {
    if (options.skipAi && category === 'ai') {
      continue;
    }

    logger.info(`Checking ${CHECK_CATEGORY_LABELS[category]}...`);

    const categoryResults = await runCategoryChecks(
      category,
      fs,
      ctx,
      prompts,
      checks
    );

    // Apply fixes if enabled
    for (const result of categoryResults) {
      if (
        result.fix &&
        (result.status === 'fail' || result.status === 'warn')
      ) {
        const shouldFix = options.autoFix
          ? true
          : await prompts.confirm(
              `Fix "${result.name}"? ${result.fix.description}`
            );

        if (shouldFix) {
          logger.info(`Applying fix: ${result.fix.description}`);
          const fixResult = await result.fix.apply();

          if (fixResult.success) {
            logger.info(`✓ ${fixResult.message}`);
            // Update status to pass after successful fix
            result.status = 'pass';
            result.message = `Fixed: ${fixResult.message}`;
            result.fix = undefined;
          } else {
            logger.warn(`✗ ${fixResult.message}`);
          }
        }
      }

      allResults.push(result);
    }
  }

  // Calculate summary
  const passed = allResults.filter((r) => r.status === 'pass').length;
  const warnings = allResults.filter((r) => r.status === 'warn').length;
  const failures = allResults.filter((r) => r.status === 'fail').length;
  const skipped = allResults.filter((r) => r.status === 'skip').length;

  return {
    checks: allResults,
    passed,
    warnings,
    failures,
    skipped,
    healthy: failures === 0,
  };
}

/**
 * Run checks for a specific category.
 */
async function runCategoryChecks(
  category: CheckCategory,
  fs: FsAdapter,
  ctx: CheckContext,
  prompts: DoctorPromptCallbacks,
  checks: DoctorCheckRunners
): Promise<CheckResult[]> {
  switch (category) {
    case 'cli':
      return checks.runCliChecks(fs, ctx);
    case 'config':
      return checks.runConfigChecks(fs, ctx);
    case 'mcp':
      return checks.runMcpChecks(fs, ctx);
    case 'deps':
      return checks.runDepsChecks(fs, ctx);
    case 'workspace':
      return checks.runWorkspaceChecks(fs, ctx);
    case 'ai':
      return checks.runAiChecks(fs, ctx, prompts);
    case 'layers':
      return checks.runLayerChecks(fs, ctx);
    default:
      return [];
  }
}

/**
 * Get a summary string for the doctor result.
 */
export function formatDoctorSummary(result: DoctorResult): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('=== Health Check Summary ===');
  lines.push('');

  if (result.healthy) {
    lines.push('✓ All checks passed!');
  } else {
    lines.push('✗ Some issues found');
  }

  lines.push('');
  lines.push(`  Passed:   ${result.passed}`);
  lines.push(`  Warnings: ${result.warnings}`);
  lines.push(`  Failures: ${result.failures}`);
  lines.push(`  Skipped:  ${result.skipped}`);

  return lines.join('\n');
}

/**
 * Format a single check result for display.
 */
export function formatCheckResult(result: CheckResult): string {
  const icon =
    result.status === 'pass'
      ? '✓'
      : result.status === 'warn'
        ? '⚠'
        : result.status === 'fail'
          ? '✗'
          : '○';

  let line = `${icon} ${result.name}: ${result.message}`;

  if (result.details) {
    line += `\n    ${result.details}`;
  }

  if (result.fix) {
    line += `\n    Fix available: ${result.fix.description}`;
  }

  return line;
}
