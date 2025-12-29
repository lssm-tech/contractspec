/**
 * CLI installation health checks.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { FsAdapter } from '../../../ports/fs';
import type { CheckContext, CheckResult, FixResult } from '../types';

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
    await execAsync('bunx contractspec --version', {
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
      details: 'Could not run "bunx contractspec --version"',
      fix: {
        description: 'Install ContractSpec CLI globally',
        apply: async (): Promise<FixResult> => {
          try {
            await execAsync(
              'npm install -g @contractspec/app.cli-contractspec',
              {
                cwd: ctx.workspaceRoot,
                timeout: 60000,
              }
            );
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
    const { stdout } = await execAsync('bunx contractspec --version', {
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

    // Check if CLI exists in workspace (monorepo source)
    if (ctx.isMonorepo && ctx.packageRoot === ctx.workspaceRoot) {
      const cliPath = fs.join(ctx.workspaceRoot, 'packages/apps/cli-contractspec');
      if (await fs.exists(cliPath)) {
        return {
          category: 'cli',
          name: 'Local Installation',
          status: 'pass',
          message: 'CLI is part of the workspace (source)',
        };
      }
    }

    const content = await fs.readFile(packageJsonPath);
    const pkg = JSON.parse(content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const hasDep =
      pkg.dependencies?.['@contractspec/app.cli-contractspec'] !== undefined ||
      pkg.devDependencies?.['@contractspec/app.cli-contractspec'] !== undefined;

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
      details:
        'Consider adding @contractspec/app.cli-contractspec to devDependencies',
      fix: {
        description: 'Add CLI as a dev dependency',
        apply: async (): Promise<FixResult> => {
          try {
            await execAsync(
              'npm install -D @contractspec/app.cli-contractspec',
              {
                cwd: ctx.workspaceRoot,
                timeout: 60000,
              }
            );
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
