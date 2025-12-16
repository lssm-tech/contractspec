/**
 * Dependencies health checks.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { FsAdapter } from '../../../ports/fs';
import type { CheckResult, CheckContext } from '../types';

const execAsync = promisify(exec);

/**
 * Run dependency-related health checks.
 */
export async function runDepsChecks(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check Node.js availability
  results.push(await checkNodeJs(ctx));

  // Check Bun availability
  results.push(await checkBun(ctx));

  // Check package manager
  results.push(await checkPackageManager(fs, ctx));

  // Check if node_modules exists
  results.push(await checkNodeModules(fs, ctx));

  return results;
}

/**
 * Check if Node.js is available.
 */
async function checkNodeJs(ctx: CheckContext): Promise<CheckResult> {
  try {
    const { stdout } = await execAsync('node --version', {
      cwd: ctx.workspaceRoot,
      timeout: 5000,
    });

    const version = stdout.trim();

    return {
      category: 'deps',
      name: 'Node.js',
      status: 'pass',
      message: `Node.js ${version} available`,
    };
  } catch {
    return {
      category: 'deps',
      name: 'Node.js',
      status: 'fail',
      message: 'Node.js not found',
      details: 'Install Node.js from https://nodejs.org',
    };
  }
}

/**
 * Check if Bun is available.
 */
async function checkBun(ctx: CheckContext): Promise<CheckResult> {
  try {
    const { stdout } = await execAsync('bun --version', {
      cwd: ctx.workspaceRoot,
      timeout: 5000,
    });

    const version = stdout.trim();

    return {
      category: 'deps',
      name: 'Bun Runtime',
      status: 'pass',
      message: `Bun ${version} available`,
    };
  } catch {
    return {
      category: 'deps',
      name: 'Bun Runtime',
      status: 'warn',
      message: 'Bun not found (optional but recommended)',
      details: 'Install Bun from https://bun.sh for faster execution',
    };
  }
}

/**
 * Detect and check the package manager.
 */
async function checkPackageManager(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  // Check for lock files to determine package manager
  const lockFiles = [
    { file: 'bun.lockb', name: 'bun' },
    { file: 'pnpm-lock.yaml', name: 'pnpm' },
    { file: 'yarn.lock', name: 'yarn' },
    { file: 'package-lock.json', name: 'npm' },
  ];

  let detectedManager: string | null = null;

  for (const { file, name } of lockFiles) {
    const lockPath = fs.join(ctx.workspaceRoot, file);
    if (await fs.exists(lockPath)) {
      detectedManager = name;
      break;
    }
  }

  if (!detectedManager) {
    return {
      category: 'deps',
      name: 'Package Manager',
      status: 'warn',
      message: 'No lock file found',
      details: 'Run npm install, yarn, pnpm install, or bun install',
    };
  }

  // Verify the package manager is available
  try {
    await execAsync(`${detectedManager} --version`, {
      cwd: ctx.workspaceRoot,
      timeout: 5000,
    });

    return {
      category: 'deps',
      name: 'Package Manager',
      status: 'pass',
      message: `Using ${detectedManager}`,
    };
  } catch {
    return {
      category: 'deps',
      name: 'Package Manager',
      status: 'fail',
      message: `${detectedManager} detected but not available`,
      details: `Install ${detectedManager} or use a different package manager`,
    };
  }
}

/**
 * Check if node_modules exists.
 */
async function checkNodeModules(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const nodeModulesPath = fs.join(ctx.workspaceRoot, 'node_modules');

  const exists = await fs.exists(nodeModulesPath);
  if (exists) {
    return {
      category: 'deps',
      name: 'Dependencies Installed',
      status: 'pass',
      message: 'node_modules directory exists',
    };
  }

  return {
    category: 'deps',
    name: 'Dependencies Installed',
    status: 'fail',
    message: 'node_modules not found',
    details: 'Run your package manager install command',
    fix: {
      description: 'Install dependencies',
      apply: async () => {
        try {
          // Try bun first, then npm
          try {
            await execAsync('bun install', {
              cwd: ctx.workspaceRoot,
              timeout: 120000,
            });
            return { success: true, message: 'Installed with bun' };
          } catch {
            await execAsync('npm install', {
              cwd: ctx.workspaceRoot,
              timeout: 120000,
            });
            return { success: true, message: 'Installed with npm' };
          }
        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          return { success: false, message: `Failed: ${msg}` };
        }
      },
    },
  };
}

