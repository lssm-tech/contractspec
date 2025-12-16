/**
 * Workspace structure health checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { CheckResult, CheckContext, FixResult } from '../types';

/**
 * Run workspace-related health checks.
 */
export async function runWorkspaceChecks(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check if this is a valid workspace (has package.json)
  results.push(await checkValidWorkspace(fs, ctx));

  // Check if contracts directory exists
  results.push(await checkContractsDirectory(fs, ctx));

  // Check if any contract files exist
  results.push(await checkContractFiles(fs, ctx));

  // Check output directory
  results.push(await checkOutputDirectory(fs, ctx));

  return results;
}

/**
 * Check if this is a valid workspace.
 */
async function checkValidWorkspace(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const packageJsonPath = fs.join(ctx.workspaceRoot, 'package.json');

  const exists = await fs.exists(packageJsonPath);
  if (exists) {
    return {
      category: 'workspace',
      name: 'Valid Workspace',
      status: 'pass',
      message: 'package.json found',
    };
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
 */
async function checkContractsDirectory(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  // Common contract directory paths
  const possiblePaths = [
    'src/contracts',
    'contracts',
    'src/specs',
    'specs',
  ];

  for (const path of possiblePaths) {
    const fullPath = fs.join(ctx.workspaceRoot, path);
    if (await fs.exists(fullPath)) {
      return {
        category: 'workspace',
        name: 'Contracts Directory',
        status: 'pass',
        message: `Contracts directory found: ${path}`,
      };
    }
  }

  return {
    category: 'workspace',
    name: 'Contracts Directory',
    status: 'warn',
    message: 'No contracts directory found',
    details: 'Create src/contracts/ to organize your specs',
    fix: {
      description: 'Create src/contracts/ directory',
      apply: async (): Promise<FixResult> => {
        try {
          const contractsDir = fs.join(ctx.workspaceRoot, 'src', 'contracts');
          await fs.mkdir(contractsDir);
          return { success: true, message: 'Created src/contracts/' };
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
 */
async function checkContractFiles(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  try {
    const patterns = [
      '**/*.contracts.ts',
      '**/*.event.ts',
      '**/*.presentation.ts',
      '**/*.feature.ts',
    ];

    const files = await fs.glob({
      patterns,
      ignore: ['node_modules/**', 'dist/**'],
    });

    if (files.length > 0) {
      return {
        category: 'workspace',
        name: 'Contract Files',
        status: 'pass',
        message: `Found ${files.length} contract file(s)`,
        details: ctx.verbose ? files.slice(0, 5).join(', ') : undefined,
      };
    }

    return {
      category: 'workspace',
      name: 'Contract Files',
      status: 'warn',
      message: 'No contract files found',
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
 * Check if output directory is configured and exists.
 */
async function checkOutputDirectory(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const configPath = fs.join(ctx.workspaceRoot, '.contractsrc.json');

  try {
    const configExists = await fs.exists(configPath);
    if (!configExists) {
      return {
        category: 'workspace',
        name: 'Output Directory',
        status: 'skip',
        message: 'No config file to check output directory',
      };
    }

    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as { outputDir?: string };

    const outputDir = config.outputDir ?? './src';
    const outputPath = fs.join(ctx.workspaceRoot, outputDir);

    const exists = await fs.exists(outputPath);
    if (exists) {
      return {
        category: 'workspace',
        name: 'Output Directory',
        status: 'pass',
        message: `Output directory exists: ${outputDir}`,
      };
    }

    return {
      category: 'workspace',
      name: 'Output Directory',
      status: 'warn',
      message: `Output directory not found: ${outputDir}`,
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

