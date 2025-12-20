/**
 * Quickstart service.
 *
 * Orchestrates the installation of minimal necessary packages
 * for ContractSpec to work across CLI, VS Code, and JetBrains.
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { FsAdapter } from '../../ports/fs';
import type {
  QuickstartOptions,
  QuickstartResult,
  QuickstartPromptCallbacks,
  PackageInstallResult,
  QuickstartDependency,
} from './types';
import {
  getDependencies,
  getProductionDependencies,
  getDevDependencies,
} from './dependencies';
import {
  detectPackageManager,
  getInstallCommand,
  type PackageManager,
} from '../../adapters/workspace';

const execAsync = promisify(exec);

/**
 * Default prompt callbacks that accept all defaults.
 */
const defaultPrompts: QuickstartPromptCallbacks = {
  confirm: async () => true,
  select: async (_msg, options) => options[0]?.value ?? ('' as never),
};

/**
 * Run the ContractSpec quickstart installation.
 */
export async function runQuickstart(
  fs: FsAdapter,
  options: QuickstartOptions,
  prompts: QuickstartPromptCallbacks = defaultPrompts
): Promise<QuickstartResult> {
  const dependencies = getDependencies(options.mode);
  const prodDeps = getProductionDependencies(dependencies);
  const devDeps = getDevDependencies(dependencies);

  const installed: PackageInstallResult[] = [];
  const skipped: PackageInstallResult[] = [];
  const errors: PackageInstallResult[] = [];

  // Check if package.json exists
  const packageJsonPath = fs.join(options.workspaceRoot, 'package.json');
  const hasPackageJson = await fs.exists(packageJsonPath);

  if (!hasPackageJson) {
    return {
      success: false,
      installed: [],
      skipped: [],
      errors: [
        {
          name: 'package.json',
          action: 'error',
          message: 'No package.json found. Run `npm init` first.',
        },
      ],
      summary: 'No package.json found in workspace root.',
    };
  }

  // Read current package.json to check existing dependencies
  const packageJsonContent = await fs.readFile(packageJsonPath);
  const packageJson = JSON.parse(packageJsonContent) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const existingDeps = new Set([
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ]);

  // Detect package manager
  const packageManager = detectPackageManager(options.workspaceRoot);

  // Filter dependencies based on what's already installed
  const toInstallProd = prodDeps.filter((dep) => {
    if (existingDeps.has(dep.name) && !options.force) {
      skipped.push({
        name: dep.name,
        action: 'skipped',
        message: 'Already installed',
        dev: false,
      });
      return false;
    }
    return true;
  });

  const toInstallDev = devDeps.filter((dep) => {
    if (existingDeps.has(dep.name) && !options.force) {
      skipped.push({
        name: dep.name,
        action: 'skipped',
        message: 'Already installed',
        dev: true,
      });
      return false;
    }
    return true;
  });

  // Dry run - just report what would be installed
  if (options.dryRun) {
    const wouldInstall = [...toInstallProd, ...toInstallDev];
    return {
      success: true,
      installed: wouldInstall.map((dep) => ({
        name: dep.name,
        action: 'installed',
        message: `Would install: ${dep.description}`,
        dev: dep.dev,
      })),
      skipped,
      errors: [],
      summary: `Dry run: would install ${wouldInstall.length} package(s), skip ${skipped.length}.`,
    };
  }

  // Confirm installation if interactive
  if (
    !options.skipPrompts &&
    (toInstallProd.length > 0 || toInstallDev.length > 0)
  ) {
    const total = toInstallProd.length + toInstallDev.length;
    const confirmed = await prompts.confirm(
      `Install ${total} package(s) using ${packageManager}?`
    );
    if (!confirmed) {
      return {
        success: true,
        installed: [],
        skipped: [
          ...skipped,
          ...toInstallProd.map((d) => ({
            name: d.name,
            action: 'skipped' as const,
            message: 'User cancelled',
          })),
          ...toInstallDev.map((d) => ({
            name: d.name,
            action: 'skipped' as const,
            message: 'User cancelled',
            dev: true,
          })),
        ],
        errors: [],
        summary: 'Installation cancelled by user.',
      };
    }
  }

  // Install production dependencies
  if (toInstallProd.length > 0) {
    const results = await installPackages(
      toInstallProd,
      packageManager,
      options.workspaceRoot,
      false
    );
    for (const result of results) {
      if (result.action === 'installed') {
        installed.push(result);
      } else {
        errors.push(result);
      }
    }
  }

  // Install dev dependencies
  if (toInstallDev.length > 0) {
    const results = await installPackages(
      toInstallDev,
      packageManager,
      options.workspaceRoot,
      true
    );
    for (const result of results) {
      if (result.action === 'installed') {
        installed.push(result);
      } else {
        errors.push(result);
      }
    }
  }

  const success = errors.length === 0;
  const summary = success
    ? `Successfully installed ${installed.length} package(s), skipped ${skipped.length}.`
    : `Installed ${installed.length}, skipped ${skipped.length}, failed ${errors.length}.`;

  return {
    success,
    installed,
    skipped,
    errors,
    summary,
  };
}

/**
 * Install a set of packages using the detected package manager.
 */
async function installPackages(
  dependencies: QuickstartDependency[],
  packageManager: PackageManager,
  cwd: string,
  isDev: boolean
): Promise<PackageInstallResult[]> {
  const results: PackageInstallResult[] = [];
  const packageNames = dependencies.map((dep) =>
    dep.version ? `${dep.name}@${dep.version}` : dep.name
  );

  try {
    const baseCommand = getInstallCommand(packageManager, isDev);
    const command = `${baseCommand} ${packageNames.join(' ')}`;

    await execAsync(command, {
      cwd,
      timeout: 120000, // 2 minutes timeout
    });

    // All packages installed successfully
    for (const dep of dependencies) {
      results.push({
        name: dep.name,
        action: 'installed',
        message: dep.description,
        dev: isDev,
      });
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    for (const dep of dependencies) {
      results.push({
        name: dep.name,
        action: 'error',
        message: `Failed to install: ${msg}`,
        dev: isDev,
      });
    }
  }

  return results;
}

/**
 * Check if ContractSpec is already set up in the workspace.
 */
export async function isContractSpecInstalled(
  fs: FsAdapter,
  workspaceRoot: string
): Promise<boolean> {
  const packageJsonPath = fs.join(workspaceRoot, 'package.json');

  try {
    const content = await fs.readFile(packageJsonPath);
    const packageJson = JSON.parse(content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    return '@lssm/lib.contracts' in allDeps;
  } catch {
    return false;
  }
}

/**
 * Get a summary of what would be installed.
 */
export function formatQuickstartPreview(mode: 'minimal' | 'full'): string {
  const deps = getDependencies(mode);
  const lines: string[] = [];

  lines.push(`ContractSpec ${mode} installation:`);
  lines.push('');

  const prodDeps = getProductionDependencies(deps);
  if (prodDeps.length > 0) {
    lines.push('Dependencies:');
    for (const dep of prodDeps) {
      lines.push(`  • ${dep.name} - ${dep.description}`);
    }
  }

  const devDeps = getDevDependencies(deps);
  if (devDeps.length > 0) {
    lines.push('');
    lines.push('Dev Dependencies:');
    for (const dep of devDeps) {
      lines.push(`  • ${dep.name} - ${dep.description}`);
    }
  }

  return lines.join('\n');
}
