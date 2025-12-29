/**
 * Workspace structure health checks.
 *
 * Monorepo-aware checks for contracts and output directories.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { CheckContext, CheckResult, FixResult } from '../types';

/**
 * Common contract directory paths to check.
 */
const CONTRACT_PATHS = ['src/contracts', 'contracts', 'src/specs', 'specs'];

/**
 * Run workspace-related health checks.
 */
export async function runWorkspaceChecks(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check monorepo status first (informational)
  results.push(checkMonorepoStatus(ctx));

  // Check if this is a valid workspace (has package.json)
  results.push(await checkValidWorkspace(fs, ctx));

  // Check if contracts directory exists (monorepo-aware)
  results.push(await checkContractsDirectory(fs, ctx));

  // Check if any contract files exist
  results.push(await checkContractFiles(fs, ctx));

  // Check output directory (monorepo-aware)
  results.push(await checkOutputDirectory(fs, ctx));

  return results;
}

/**
 * Report monorepo detection status.
 */
function checkMonorepoStatus(ctx: CheckContext): CheckResult {
  if (ctx.isMonorepo) {
    const pkgInfo = ctx.packageName ? ` in package "${ctx.packageName}"` : '';
    const locationInfo =
      ctx.packageRoot !== ctx.workspaceRoot
        ? ` (package root: ${ctx.packageRoot})`
        : '';
    return {
      category: 'workspace',
      name: 'Monorepo Detection',
      status: 'pass',
      message: `Monorepo detected${pkgInfo}`,
      details: ctx.verbose
        ? `Workspace root: ${ctx.workspaceRoot}${locationInfo}`
        : undefined,
    };
  }

  return {
    category: 'workspace',
    name: 'Monorepo Detection',
    status: 'pass',
    message: 'Single project (not a monorepo)',
  };
}

/**
 * Check if this is a valid workspace.
 */
async function checkValidWorkspace(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  // In monorepo, check both workspace root and package root
  const pathsToCheck = ctx.isMonorepo
    ? [ctx.packageRoot, ctx.workspaceRoot]
    : [ctx.workspaceRoot];

  for (const root of pathsToCheck) {
    const packageJsonPath = fs.join(root, 'package.json');
    if (await fs.exists(packageJsonPath)) {
      return {
        category: 'workspace',
        name: 'Valid Workspace',
        status: 'pass',
        message: 'package.json found',
        details:
          ctx.verbose && ctx.isMonorepo ? `Found at: ${root}` : undefined,
      };
    }
  }

  return {
    category: 'workspace',
    name: 'Valid Workspace',
    status: 'fail',
    message: 'No package.json found',
    details: 'This does not appear to be a Node.js/TypeScript project',
  };
}

/**
 * Check if contracts directory exists.
 *
 * In monorepo: checks current package first, then workspace root.
 */
async function checkContractsDirectory(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  // Determine where to look and where to create
  const searchRoots = ctx.isMonorepo
    ? [ctx.packageRoot, ctx.workspaceRoot]
    : [ctx.workspaceRoot];

  // Prefer creating in package root for monorepos
  const targetRoot = ctx.isMonorepo ? ctx.packageRoot : ctx.workspaceRoot;

  // Check each possible location
  for (const root of searchRoots) {
    for (const path of CONTRACT_PATHS) {
      const fullPath = fs.join(root, path);
      if (await fs.exists(fullPath)) {
        const relativeTo = root === ctx.packageRoot ? 'package' : 'workspace';
        return {
          category: 'workspace',
          name: 'Contracts Directory',
          status: 'pass',
          message: `Contracts directory found: ${path}`,
          details: ctx.isMonorepo ? `Found at ${relativeTo} level` : undefined,
        };
      }
    }
  }

  // Not found - check if we are at monorepo root
  if (ctx.isMonorepo && ctx.packageRoot === ctx.workspaceRoot) {
    return {
      category: 'workspace',
      name: 'Contracts Directory',
      status: 'pass',
      message: 'Monorepo root detected (contracts expected in packages)',
    };
  }

  // Not found - suggest creating in appropriate location
  const createPath = ctx.isMonorepo ? 'src/contracts' : 'src/contracts';
  const locationHint = ctx.isMonorepo
    ? ` in package "${ctx.packageName ?? ctx.packageRoot}"`
    : '';

  return {
    category: 'workspace',
    name: 'Contracts Directory',
    status: 'warn',
    message: 'No contracts directory found',
    details: `Create ${createPath}/${locationHint} to organize your specs`,
    fix: {
      description: `Create ${createPath}/ directory${locationHint}`,
      apply: async (): Promise<FixResult> => {
        try {
          const contractsDir = fs.join(targetRoot, 'src', 'contracts');
          await fs.mkdir(contractsDir);
          return { success: true, message: `Created ${createPath}/` };
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          return { success: false, message: `Failed: ${msg}` };
        }
      },
    },
  };
}

/**
 * Check if any contract files exist.
 *
 * In monorepo: searches from current package root.
 */
async function checkContractFiles(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  try {
    const patterns = [
      '**/*.operation.ts',
      '**/*.event.ts',
      '**/*.presentation.ts',
      '**/*.feature.ts',
    ];

    // In monorepo, search from package root; otherwise workspace root
    const searchRoot = ctx.isMonorepo ? ctx.packageRoot : ctx.workspaceRoot;

    const files = await fs.glob({
      patterns,
      ignore: ['node_modules/**', 'dist/**'],
      cwd: searchRoot,
    });

    if (files.length > 0) {
      const locationInfo = ctx.isMonorepo ? ' (in current package)' : '';
      return {
        category: 'workspace',
        name: 'Contract Files',
        status: 'pass',
        message: `Found ${files.length} contract file(s)${locationInfo}`,
        details: ctx.verbose ? files.slice(0, 5).join(', ') : undefined,
      };
    }

    // Pass if monorepo root and no files (likely empty root)
    if (ctx.isMonorepo && ctx.packageRoot === ctx.workspaceRoot) {
      return {
        category: 'workspace',
        name: 'Contract Files',
        status: 'pass',
        message: 'No contract files in root (expected in packages)',
      };
    }

    const hint = ctx.isMonorepo
      ? `No contract files found in package "${ctx.packageName ?? 'current'}"`
      : 'No contract files found';

    return {
      category: 'workspace',
      name: 'Contract Files',
      status: 'warn',
      message: hint,
      details: 'Create specs using "contractspec create" or VS Code command',
    };
  } catch {
    return {
      category: 'workspace',
      name: 'Contract Files',
      status: 'skip',
      message: 'Could not search for contract files',
    };
  }
}

/**
 * Find the config file, checking package level first in monorepos.
 */
async function findConfigFile(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<{
  path: string;
  root: string;
  level: 'package' | 'workspace';
} | null> {
  // In monorepo, check package level first
  if (ctx.isMonorepo && ctx.packageRoot !== ctx.workspaceRoot) {
    const pkgConfigPath = fs.join(ctx.packageRoot, '.contractsrc.json');
    if (await fs.exists(pkgConfigPath)) {
      return { path: pkgConfigPath, root: ctx.packageRoot, level: 'package' };
    }
  }

  // Check workspace level
  const wsConfigPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');
  if (await fs.exists(wsConfigPath)) {
    return { path: wsConfigPath, root: ctx.workspaceRoot, level: 'workspace' };
  }

  return null;
}

/**
 * Check if output directory is configured and exists.
 *
 * In monorepo: checks package-level config first, then workspace-level.
 * Resolves outputDir relative to the config file location.
 */
async function checkOutputDirectory(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  try {
    const configInfo = await findConfigFile(fs, ctx);

    if (!configInfo) {
      const hint = ctx.isMonorepo
        ? 'No config file found at package or workspace level'
        : 'No config file to check output directory';
      return {
        category: 'workspace',
        name: 'Output Directory',
        status: 'skip',
        message: hint,
      };
    }

    const content = await fs.readFile(configInfo.path);
    const config = JSON.parse(content) as { outputDir?: string };

    const outputDir = config.outputDir ?? './src';
    // Resolve outputDir relative to the config file's directory
    const outputPath = fs.join(configInfo.root, outputDir);

    const levelInfo = ctx.isMonorepo ? ` (${configInfo.level} level)` : '';

    const exists = await fs.exists(outputPath);
    if (exists) {
      return {
        category: 'workspace',
        name: 'Output Directory',
        status: 'pass',
        message: `Output directory exists: ${outputDir}${levelInfo}`,
        details: ctx.verbose ? `Resolved to: ${outputPath}` : undefined,
      };
    }

    // If default output directory is missing in monorepo root, it's fine
    if (
      ctx.isMonorepo &&
      ctx.packageRoot === ctx.workspaceRoot &&
      !config.outputDir
    ) {
      return {
        category: 'workspace',
        name: 'Output Directory',
        status: 'pass',
        message: 'Monorepo root detected (using package directories)',
      };
    }

    return {
      category: 'workspace',
      name: 'Output Directory',
      status: 'warn',
      message: `Output directory not found: ${outputDir}${levelInfo}`,
      details: ctx.verbose ? `Expected at: ${outputPath}` : undefined,
      fix: {
        description: `Create ${outputDir} directory`,
        apply: async (): Promise<FixResult> => {
          try {
            await fs.mkdir(outputPath);
            return { success: true, message: `Created ${outputDir}` };
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            return { success: false, message: `Failed: ${msg}` };
          }
        },
      },
    };
  } catch {
    return {
      category: 'workspace',
      name: 'Output Directory',
      status: 'skip',
      message: 'Could not check output directory',
    };
  }
}
