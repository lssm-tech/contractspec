/**
 * Workspace and monorepo detection utilities.
 *
 * Provides utilities for detecting workspace roots, package managers,
 * and monorepo configurations across Bun, pnpm, Yarn, and npm.
 */

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

/**
 * Supported package managers.
 */
export type PackageManager = 'bun' | 'pnpm' | 'yarn' | 'npm';

/**
 * Workspace detection result.
 */
export interface WorkspaceInfo {
  /**
   * The detected package manager.
   */
  packageManager: PackageManager;

  /**
   * Root of the workspace (monorepo root or single package root).
   */
  workspaceRoot: string;

  /**
   * Root of the current package (may differ from workspaceRoot in monorepos).
   */
  packageRoot: string;

  /**
   * Whether this is a monorepo.
   */
  isMonorepo: boolean;

  /**
   * List of package paths in monorepo (relative to workspaceRoot).
   */
  packages?: string[];

  /**
   * Name of the current package (from package.json).
   */
  packageName?: string;
}

/**
 * Lock files and their corresponding package managers.
 */
const LOCK_FILES: Record<string, PackageManager> = {
  'bun.lockb': 'bun',
  'bun.lock': 'bun',
  'pnpm-lock.yaml': 'pnpm',
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
};

/**
 * Monorepo indicator files.
 */
const MONOREPO_FILES = [
  'pnpm-workspace.yaml',
  'lerna.json',
  'nx.json',
  'turbo.json',
  'rush.json',
];

/**
 * Find the nearest directory containing a package.json.
 */
export function findPackageRoot(startDir: string = process.cwd()): string {
  let current = resolve(startDir);

  while (true) {
    if (existsSync(join(current, 'package.json'))) {
      return current;
    }

    // Move up to parent
    const parent = dirname(current);
    if (parent === current) {
      // Reached filesystem root
      break;
    }
    current = parent;
  }

  // Fallback to start directory
  return startDir;
}

/**
 * Find the workspace root (monorepo root or single package root).
 *
 * Walks up the directory tree looking for:
 * 1. pnpm-workspace.yaml (pnpm monorepo)
 * 2. package.json with "workspaces" field (yarn/npm/bun monorepo)
 * 3. Lock files (bun.lockb, pnpm-lock.yaml, yarn.lock, package-lock.json)
 */
export function findWorkspaceRoot(startDir: string = process.cwd()): string {
  let current = resolve(startDir);
  let lastPackageJson: string | null = null;

  while (true) {
    // Check for monorepo indicators
    for (const file of MONOREPO_FILES) {
      if (existsSync(join(current, file))) {
        return current;
      }
    }

    // Check for package.json with workspaces
    const pkgPath = join(current, 'package.json');
    if (existsSync(pkgPath)) {
      lastPackageJson = current;

      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        if (pkg.workspaces) {
          return current;
        }
      } catch {
        // Ignore parse errors
      }
    }

    // Check for lock files at this level
    for (const lockFile of Object.keys(LOCK_FILES)) {
      if (existsSync(join(current, lockFile))) {
        return current;
      }
    }

    // Move up to parent
    const parent = dirname(current);
    if (parent === current) {
      // Reached filesystem root
      break;
    }
    current = parent;
  }

  // Return last found package.json location, or start dir
  return lastPackageJson ?? startDir;
}

/**
 * Detect the package manager in use.
 *
 * Priority:
 * 1. Lock file presence (most reliable)
 * 2. packageManager field in package.json
 * 3. COREPACK_ROOT environment variable
 * 4. Default to npm
 */
export function detectPackageManager(
  workspaceRoot: string = process.cwd()
): PackageManager {
  // Check for lock files (in priority order)
  const lockFilePriority: PackageManager[] = ['bun', 'pnpm', 'yarn', 'npm'];

  for (const pm of lockFilePriority) {
    const lockFiles = Object.entries(LOCK_FILES).filter(
      ([, manager]) => manager === pm
    );
    for (const [lockFile] of lockFiles) {
      if (existsSync(join(workspaceRoot, lockFile))) {
        return pm;
      }
    }
  }

  // Check package.json for packageManager field
  const pkgPath = join(workspaceRoot, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.packageManager) {
        const match = pkg.packageManager.match(/^(bun|pnpm|yarn|npm)@/);
        if (match) {
          return match[1] as PackageManager;
        }
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Check environment
  if (
    process.env.BUN_INSTALL ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (globalThis as any).Bun !== 'undefined'
  ) {
    return 'bun';
  }

  // Default to npm
  return 'npm';
}

/**
 * Check if the workspace is a monorepo.
 */
export function isMonorepo(workspaceRoot: string = process.cwd()): boolean {
  // Check for monorepo indicator files
  for (const file of MONOREPO_FILES) {
    if (existsSync(join(workspaceRoot, file))) {
      return true;
    }
  }

  // Check package.json for workspaces
  const pkgPath = join(workspaceRoot, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (pkg.workspaces) {
        return true;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return false;
}

/**
 * Get workspace package patterns from package.json or pnpm-workspace.yaml.
 */
export function getWorkspacePackages(
  workspaceRoot: string
): string[] | undefined {
  // Check pnpm-workspace.yaml
  const pnpmWorkspacePath = join(workspaceRoot, 'pnpm-workspace.yaml');
  if (existsSync(pnpmWorkspacePath)) {
    try {
      const content = readFileSync(pnpmWorkspacePath, 'utf-8');
      // Simple YAML parsing for packages array
      const match = content.match(
        /packages:\s*\n((?:\s+-\s+['"]?[^\n]+['"]?\n?)+)/
      );
      if (match?.[1]) {
        const packages = match[1]
          .split('\n')
          .map((line) => line.replace(/^\s+-\s+['"]?|['"]?\s*$/g, ''))
          .filter(Boolean);
        return packages;
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Check package.json workspaces
  const pkgPath = join(workspaceRoot, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      if (Array.isArray(pkg.workspaces)) {
        return pkg.workspaces;
      }
      if (pkg.workspaces?.packages && Array.isArray(pkg.workspaces.packages)) {
        return pkg.workspaces.packages;
      }
    } catch {
      // Ignore parse errors
    }
  }

  return undefined;
}

/**
 * Get package name from package.json.
 */
export function getPackageName(packageRoot: string): string | undefined {
  const pkgPath = join(packageRoot, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
      return pkg.name;
    } catch {
      // Ignore parse errors
    }
  }
  return undefined;
}

/**
 * Get complete workspace information.
 */
export function getWorkspaceInfo(
  startDir: string = process.cwd()
): WorkspaceInfo {
  const packageRoot = findPackageRoot(startDir);
  const workspaceRoot = findWorkspaceRoot(startDir);
  const packageManager = detectPackageManager(workspaceRoot);
  const isMonorepoWorkspace = isMonorepo(workspaceRoot);
  const packages = isMonorepoWorkspace
    ? getWorkspacePackages(workspaceRoot)
    : undefined;
  const packageName = getPackageName(packageRoot);

  return {
    packageManager,
    workspaceRoot,
    packageRoot,
    isMonorepo: isMonorepoWorkspace,
    packages,
    packageName,
  };
}

/**
 * Get the run command for the detected package manager.
 */
export function getRunCommand(
  packageManager: PackageManager,
  script: string
): string {
  switch (packageManager) {
    case 'bun':
      return `bun run ${script}`;
    case 'pnpm':
      return `pnpm run ${script}`;
    case 'yarn':
      return `yarn ${script}`;
    case 'npm':
      return `npm run ${script}`;
  }
}

/**
 * Get the exec command for the detected package manager.
 */
export function getExecCommand(
  packageManager: PackageManager,
  command: string
): string {
  switch (packageManager) {
    case 'bun':
      return `bunx ${command}`;
    case 'pnpm':
      return `pnpm exec ${command}`;
    case 'yarn':
      return `yarn ${command}`;
    case 'npm':
      return `npx ${command}`;
  }
}

/**
 * Get the install command for the detected package manager.
 */
export function getInstallCommand(
  packageManager: PackageManager,
  isDev = false
): string {
  const devFlag = isDev ? (packageManager === 'npm' ? '--save-dev' : '-D') : '';

  switch (packageManager) {
    case 'bun':
      return `bun add ${devFlag}`.trim();
    case 'pnpm':
      return `pnpm add ${devFlag}`.trim();
    case 'yarn':
      return `yarn add ${devFlag}`.trim();
    case 'npm':
      return `npm install ${devFlag}`.trim();
  }
}
