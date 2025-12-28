/**
 * Workspace info service.
 *
 * Provides workspace detection and configuration loading
 * with support for monorepos.
 */

import {
  getWorkspaceInfo,
  findWorkspaceRoot,
  findPackageRoot,
  detectPackageManager,
  type WorkspaceInfo,
  type PackageManager,
} from '../adapters/workspace';
import type { FsAdapter } from '../ports/fs';

/**
 * Monorepo configuration options.
 */
export interface MonorepoConfig {
  /**
   * Package patterns to include (glob).
   */
  packages?: string[];

  /**
   * Package patterns to exclude (glob).
   */
  excludePackages?: string[];

  /**
   * Whether to search recursively in all packages.
   */
  recursive?: boolean;
}

/**
 * Extended workspace info with configuration.
 */
export interface ExtendedWorkspaceInfo extends WorkspaceInfo {
  /**
   * Monorepo-specific configuration.
   */
  monorepoConfig?: MonorepoConfig;

  /**
   * Path to workspace .contractsrc.json (if exists).
   */
  workspaceConfigPath?: string;

  /**
   * Path to package .contractsrc.json (if exists).
   */
  packageConfigPath?: string;
}

/**
 * Get extended workspace information including config paths.
 */
export async function getExtendedWorkspaceInfo(
  fs: FsAdapter,
  startDir?: string
): Promise<ExtendedWorkspaceInfo> {
  const baseInfo = getWorkspaceInfo(startDir);

  // Check for config files
  const workspaceConfigPath = fs.join(
    baseInfo.workspaceRoot,
    '.contractsrc.json'
  );
  const packageConfigPath = fs.join(baseInfo.packageRoot, '.contractsrc.json');

  const hasWorkspaceConfig = await fs.exists(workspaceConfigPath);
  const hasPackageConfig =
    baseInfo.workspaceRoot !== baseInfo.packageRoot
      ? await fs.exists(packageConfigPath)
      : false;

  // Load monorepo config from workspace config if exists
  let monorepoConfig: MonorepoConfig | undefined;

  if (hasWorkspaceConfig) {
    try {
      const content = await fs.readFile(workspaceConfigPath);
      const config = JSON.parse(content);
      if (config.packages || config.excludePackages || config.recursive) {
        monorepoConfig = {
          packages: config.packages,
          excludePackages: config.excludePackages,
          recursive: config.recursive,
        };
      }
    } catch {
      // Ignore parse errors
    }
  }

  return {
    ...baseInfo,
    monorepoConfig,
    workspaceConfigPath: hasWorkspaceConfig ? workspaceConfigPath : undefined,
    packageConfigPath: hasPackageConfig ? packageConfigPath : undefined,
  };
}

/**
 * Find all .contractsrc.json files in a monorepo.
 *
 * Returns paths in order of priority (workspace first, then packages).
 */
export async function findAllConfigFiles(
  fs: FsAdapter,
  workspaceRoot: string
): Promise<string[]> {
  const configFiles: string[] = [];

  // Workspace root config (highest priority for defaults)
  const rootConfig = fs.join(workspaceRoot, '.contractsrc.json');
  if (await fs.exists(rootConfig)) {
    configFiles.push(rootConfig);
  }

  // Find configs in packages
  const packageConfigs = await fs.glob({
    pattern: '**/.contractsrc.json',
    ignore: ['node_modules/**', '.git/**'],
  });

  for (const config of packageConfigs) {
    if (config !== rootConfig) {
      configFiles.push(config);
    }
  }

  return configFiles;
}

/**
 * Merge workspace and package configurations.
 *
 * Package config overrides workspace config.
 */
export async function mergeMonorepoConfigs(
  fs: FsAdapter,
  workspaceConfigPath: string | undefined,
  packageConfigPath: string | undefined
): Promise<Record<string, unknown>> {
  let merged: Record<string, unknown> = {};

  // Load workspace config as base
  if (workspaceConfigPath && (await fs.exists(workspaceConfigPath))) {
    try {
      const content = await fs.readFile(workspaceConfigPath);
      merged = JSON.parse(content);
    } catch {
      // Ignore parse errors
    }
  }

  // Overlay package config
  if (packageConfigPath && (await fs.exists(packageConfigPath))) {
    try {
      const content = await fs.readFile(packageConfigPath);
      const packageConfig = JSON.parse(content);

      // Deep merge (package overrides workspace)
      merged = deepMerge(merged, packageConfig);
    } catch {
      // Ignore parse errors
    }
  }

  return merged;
}

/**
 * Deep merge two objects.
 */
function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const result = { ...base };

  for (const key of Object.keys(override)) {
    const baseValue = base[key];
    const overrideValue = override[key];

    if (
      typeof baseValue === 'object' &&
      baseValue !== null &&
      !Array.isArray(baseValue) &&
      typeof overrideValue === 'object' &&
      overrideValue !== null &&
      !Array.isArray(overrideValue)
    ) {
      result[key] = deepMerge(
        baseValue as Record<string, unknown>,
        overrideValue as Record<string, unknown>
      );
    } else {
      result[key] = overrideValue;
    }
  }

  return result;
}

/**
 * Format workspace info for display.
 */
export function formatWorkspaceInfo(info: ExtendedWorkspaceInfo): string {
  const lines: string[] = [];

  lines.push(`Package Manager: ${info.packageManager}`);
  lines.push(`Workspace Root: ${info.workspaceRoot}`);

  if (info.isMonorepo) {
    lines.push(`Monorepo: Yes`);
    lines.push(`Package Root: ${info.packageRoot}`);

    if (info.packageName) {
      lines.push(`Current Package: ${info.packageName}`);
    }

    if (info.packages && info.packages.length > 0) {
      lines.push(`Package Patterns: ${info.packages.join(', ')}`);
    }
  } else {
    lines.push(`Monorepo: No`);
  }

  if (info.workspaceConfigPath) {
    lines.push(`Workspace Config: ${info.workspaceConfigPath}`);
  }

  if (info.packageConfigPath) {
    lines.push(`Package Config: ${info.packageConfigPath}`);
  }

  return lines.join('\n');
}

// Re-export types and utilities
export {
  getWorkspaceInfo,
  findWorkspaceRoot,
  findPackageRoot,
  detectPackageManager,
  type WorkspaceInfo,
  type PackageManager,
};
