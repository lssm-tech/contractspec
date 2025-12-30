/**
 * Upgrade service.
 *
 * Analyzes and applies upgrades to ContractSpec SDK packages and configuration.
 * This service is platform-agnostic and can be used by CLI, VSCode, or other apps.
 *
 * @module services/upgrade
 */

import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import {
  detectPackageManager,
  findWorkspaceRoot,
} from '../../adapters/workspace';
import type {
  UpgradeOptions,
  UpgradeAnalysisResult,
  UpgradeApplyResult,
  PackageUpgradeInfo,
  ConfigUpgradeInfo,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Latest schema URL. */
const API_HOST = process.env['CONTRACTSPEC_API_HOST'] ?? 'api.contractspec.io';
const LATEST_SCHEMA_URL = `https://${API_HOST}/schemas/contractsrc.json`;

// ─────────────────────────────────────────────────────────────────────────────
// Adapters Type
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceAdapters {
  fs: FsAdapter;
  logger: LoggerAdapter;
}

// ─────────────────────────────────────────────────────────────────────────────
// Analysis
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyze what upgrades are available.
 */
export async function analyzeUpgrades(
  adapters: ServiceAdapters,
  options: UpgradeOptions
): Promise<UpgradeAnalysisResult> {
  const { fs, logger } = adapters;
  const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);
  const packageManager = detectPackageManager(workspaceRoot);

  logger.info('Analyzing available upgrades...', {
    workspaceRoot,
    packageManager,
  });

  const packages = await analyzePackages(fs, workspaceRoot);
  const configUpgrades = await analyzeConfig(fs, workspaceRoot);

  const hasUpgrades = packages.length > 0 || configUpgrades.length > 0;

  return {
    packageManager,
    packages,
    configUpgrades,
    hasUpgrades,
  };
}

/**
 * Analyze installed packages for potential updates.
 * Checks for all packages in the workspace that match ContractSpec patterns.
 */
async function analyzePackages(
  fs: FsAdapter,
  workspaceRoot: string
): Promise<PackageUpgradeInfo[]> {
  const packageJsonPath = fs.join(workspaceRoot, 'package.json');

  if (!(await fs.exists(packageJsonPath))) {
    return [];
  }

  try {
    const content = await fs.readFile(packageJsonPath);
    const packageJson = JSON.parse(content) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const deps = packageJson.dependencies ?? {};
    const devDeps = packageJson.devDependencies ?? {};

    const packages: PackageUpgradeInfo[] = [];
    const allDeps = { ...deps, ...devDeps };

    for (const [name, version] of Object.entries(allDeps)) {
      // Check for ContractSpec related packages
      // Matches @contractspec/*, contractspec, @lssm/* (if internal)
      if (
        name.startsWith('@contractspec/') ||
        name === 'contractspec' ||
        name.startsWith('@lssm/')
      ) {
        packages.push({
          name,
          currentVersion: version,
          isDevDependency: !!devDeps[name],
        });
      }
    }

    return packages;
  } catch {
    return [];
  }
}

/**
 * Analyze configuration for upgrade opportunities.
 */
async function analyzeConfig(
  fs: FsAdapter,
  workspaceRoot: string
): Promise<ConfigUpgradeInfo[]> {
  const configPath = fs.join(workspaceRoot, '.contractsrc.json');

  if (!(await fs.exists(configPath))) {
    return [];
  }

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as Record<string, unknown>;

    const upgrades: ConfigUpgradeInfo[] = [];

    // Check $schema
    const currentSchema = config['$schema'] as string | undefined;
    if (!currentSchema || currentSchema !== LATEST_SCHEMA_URL) {
      upgrades.push({
        key: '$schema',
        currentValue: currentSchema,
        suggestedValue: LATEST_SCHEMA_URL,
        isNew: !currentSchema,
      });
    }

    // Check versioning
    if (!config['versioning']) {
      upgrades.push({
        key: 'versioning',
        currentValue: undefined,
        suggestedValue: getDefaultVersioningConfig(),
        isNew: true,
      });
    } else {
      const versioning = config['versioning'] as Record<string, unknown>;
      if (versioning['integrateWithChangesets'] === undefined) {
        upgrades.push({
          key: 'versioning.integrateWithChangesets',
          currentValue: undefined,
          suggestedValue: false,
          isNew: true,
        });
      }
    }

    // Check hooks
    if (!config['hooks']) {
      upgrades.push({
        key: 'hooks',
        currentValue: undefined,
        suggestedValue: getDefaultHooksConfig(),
        isNew: true,
      });
    }

    return upgrades;
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Apply Upgrades
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Apply configuration upgrades.
 *
 * Note: Package upgrades must be applied by the app layer (CLI, VSCode)
 * since they require running npm/bun/yarn commands which is platform-specific.
 */
export async function applyConfigUpgrades(
  adapters: ServiceAdapters,
  options: UpgradeOptions
): Promise<UpgradeApplyResult> {
  const { fs, logger } = adapters;
  const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);

  if (options.dryRun) {
    logger.info('Dry run - no changes will be made');
  }

  const configPath = fs.join(workspaceRoot, '.contractsrc.json');

  if (!(await fs.exists(configPath))) {
    return {
      success: false,
      packagesUpgraded: 0,
      configSectionsUpgraded: 0,
      error: 'No .contractsrc.json found',
      summary: 'No configuration file to upgrade',
    };
  }

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as Record<string, unknown>;

    let sectionsUpgraded = 0;

    // Update $schema
    const currentSchema = config['$schema'] as string | undefined;
    if (!currentSchema || currentSchema !== LATEST_SCHEMA_URL) {
      config['$schema'] = LATEST_SCHEMA_URL;
      sectionsUpgraded++;
    }

    // Add versioning if missing
    if (!config['versioning']) {
      config['versioning'] = getDefaultVersioningConfig();
      sectionsUpgraded++;
    } else {
      const versioning = config['versioning'] as Record<string, unknown>;
      if (versioning['integrateWithChangesets'] === undefined) {
        versioning['integrateWithChangesets'] = false;
        sectionsUpgraded++;
      }
    }

    // Add hooks if missing
    if (!config['hooks']) {
      config['hooks'] = getDefaultHooksConfig();
      sectionsUpgraded++;
    }

    if (sectionsUpgraded === 0) {
      return {
        success: true,
        packagesUpgraded: 0,
        configSectionsUpgraded: 0,
        summary: 'Configuration is already up to date',
      };
    }

    if (!options.dryRun) {
      await fs.writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
      logger.info('Configuration upgraded', { sectionsUpgraded });
    }

    return {
      success: true,
      packagesUpgraded: 0,
      configSectionsUpgraded: sectionsUpgraded,
      summary: options.dryRun
        ? `Would upgrade ${sectionsUpgraded} config section(s)`
        : `Upgraded ${sectionsUpgraded} config section(s)`,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      packagesUpgraded: 0,
      configSectionsUpgraded: 0,
      error: msg,
      summary: `Failed to upgrade config: ${msg}`,
    };
  }
}

/**
 * Get the command to upgrade packages.
 *
 * Returns the shell command string that the app layer should execute.
 */
export function getPackageUpgradeCommand(
  packageManager: string,
  packages: PackageUpgradeInfo[],
  useLatest: boolean
): string {
  const pkgList = useLatest
    ? packages.map((p) => `${p.name}@latest`).join(' ')
    : packages.map((p) => p.name).join(' ');

  switch (packageManager) {
    case 'bun':
      return `bun add ${pkgList}`;
    case 'pnpm':
      return `pnpm add ${pkgList}`;
    case 'yarn':
      return `yarn add ${pkgList}`;
    default:
      return `npm install ${pkgList}`;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Configs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get default versioning configuration.
 */
export function getDefaultVersioningConfig(): Record<string, unknown> {
  return {
    autoBump: false,
    bumpStrategy: 'impact',
    changelogTiers: ['spec', 'library', 'monorepo'],
    format: 'keep-a-changelog',
    commitChanges: false,
    createTags: false,
    integrateWithChangesets: true,
  };
}

/**
 * Get default hooks configuration.
 */
export function getDefaultHooksConfig(): Record<string, string[]> {
  return {
    'pre-commit': ['contractspec validate', 'contractspec integrity check'],
  };
}
