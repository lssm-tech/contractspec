/**
 * CLI installation health checks.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { FsAdapter } from '../../../ports/fs';
import type { CheckResult, CheckContext, FixResult } from '../types';

const execAsync = promisify(exec);

/**
 * Run CLI-related health checks.
 */
export async function runCliChecks(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check if CLI is accessible
  results.push(await checkCliAccessible(ctx));

  // Check CLI version
  results.push(await checkCliVersion(ctx));

  // Check if CLI is installed globally or locally
  results.push(await checkCliInstallLocation(fs, ctx));

  return results;
}

/**
 * Check if the CLI is accessible.
 */
async function checkCliAccessible(ctx: CheckContext): Promise<CheckResult> {
  try {
    await execAsync('npx contractspec --version', {
      cwd: ctx.workspaceRoot,
      timeout: 10000,
    });

    return {
      category: 'cli',
      name: 'CLI Accessible',
      status: 'pass',
      message: 'ContractSpec CLI is accessible',
    };
  } catch {
    return {
      category: 'cli',
      name: 'CLI Accessible',
      status: 'fail',
      message: 'ContractSpec CLI is not accessible',
      details: 'Could not run "npx contractspec --version"',
      fix: {
        description: 'Install ContractSpec CLI globally',
        apply: async (): Promise<FixResult> => {
          try {
            await execAsync('npm install -g @lssm/app.cli-contracts', {
              cwd: ctx.workspaceRoot,
              timeout: 60000,
            });
            return { success: true, message: 'CLI installed globally' };
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            return { success: false, message: `Failed to install: ${msg}` };
          }
        },
      },
    };
  }
}

/**
 * Check CLI version.
 */
async function checkCliVersion(ctx: CheckContext): Promise<CheckResult> {
  try {
    const { stdout } = await execAsync('npx contractspec --version', {
      cwd: ctx.workspaceRoot,
      timeout: 10000,
    });

    const version = stdout.trim();

    return {
      category: 'cli',
      name: 'CLI Version',
      status: 'pass',
      message: `CLI version: ${version}`,
    };
  } catch {
    return {
      category: 'cli',
      name: 'CLI Version',
      status: 'skip',
      message: 'Could not determine CLI version',
    };
  }
}

/**
 * Check if CLI is installed locally in the project.
 */
async function checkCliInstallLocation(
  fs: FsAdapter,
  ctx: CheckContext
): Promise<CheckResult> {
  const packageJsonPath = fs.join(ctx.workspaceRoot, 'package.json');

  try {
    const exists = await fs.exists(packageJsonPath);
    if (!exists) {
      return {
        category: 'cli',
        name: 'Local Installation',
        status: 'skip',
        message: 'No package.json found',
      };
    }

    const content = await fs.readFile(packageJsonPath);
    const pkg = JSON.parse(content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const hasDep =
      pkg.dependencies?.['@lssm/app.cli-contracts'] !== undefined ||
      pkg.devDependencies?.['@lssm/app.cli-contracts'] !== undefined;

    if (hasDep) {
      return {
        category: 'cli',
        name: 'Local Installation',
        status: 'pass',
        message: 'CLI is installed as a project dependency',
      };
    }

    return {
      category: 'cli',
      name: 'Local Installation',
      status: 'warn',
      message: 'CLI is not installed as a project dependency',
      details: 'Consider adding @lssm/app.cli-contracts to devDependencies',
      fix: {
        description: 'Add CLI as a dev dependency',
        apply: async (): Promise<FixResult> => {
          try {
            await execAsync('npm install -D @lssm/app.cli-contracts', {
              cwd: ctx.workspaceRoot,
              timeout: 60000,
            });
            return { success: true, message: 'CLI added as dev dependency' };
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            return { success: false, message: `Failed to install: ${msg}` };
          }
        },
      },
    };
  } catch {
    return {
      category: 'cli',
      name: 'Local Installation',
      status: 'skip',
      message: 'Could not check local installation',
    };
  }
}
