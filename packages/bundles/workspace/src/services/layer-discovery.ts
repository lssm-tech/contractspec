/**
 * Layer discovery service.
 *
 * Discovers all contract layer files in a workspace:
 * - Features (*.feature.ts)
 * - Examples (example.ts, *.example.ts)
 * - App Configs (*.app-config.ts, *.blueprint.ts)
 * - Workspace Config (.contractsrc.json)
 */

import {
  isFeatureFile,
  scanFeatureSource,
  isExampleFile,
  scanExampleSource,
  type FeatureScanResult,
  type ExampleScanResult,
  type SpecScanResult,
  scanAllSpecsFromSource,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { LoggerAdapter } from '../ports/logger';

/**
 * Location of a layer file in the codebase.
 */
export interface LayerLocation {
  key: string;
  version?: string;
  file: string;
  type: 'feature' | 'example' | 'app-config' | 'workspace-config';
}

/**
 * Inventory of all discovered layers.
 */
export interface LayerInventory {
  /** Discovered features */
  features: Map<string, FeatureScanResult>;
  /** Discovered examples */
  examples: Map<string, ExampleScanResult>;
  /** Discovered app configs */
  appConfigs: Map<string, SpecScanResult>;
  /** Discovered workspace configs */
  workspaceConfigs: Map<string, WorkspaceConfigInfo>;
}

/**
 * Workspace config information.
 */
export interface WorkspaceConfigInfo {
  file: string;
  config: Record<string, unknown>;
  valid: boolean;
  errors: string[];
}

/**
 * Options for layer discovery.
 */
export interface LayerDiscoveryOptions {
  /** Glob pattern for file discovery */
  pattern?: string;
  /** Scan all packages in monorepo */
  all?: boolean;
}

/**
 * Result of layer discovery.
 */
export interface LayerDiscoveryResult {
  inventory: LayerInventory;
  stats: {
    features: number;
    examples: number;
    appConfigs: number;
    workspaceConfigs: number;
    total: number;
  };
}

/**
 * Create an empty layer inventory.
 */
export function createEmptyLayerInventory(): LayerInventory {
  return {
    features: new Map(),
    examples: new Map(),
    appConfigs: new Map(),
    workspaceConfigs: new Map(),
  };
}

/**
 * Discover all contract layers in a workspace.
 */
export async function discoverLayers(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  options: LayerDiscoveryOptions = {}
): Promise<LayerDiscoveryResult> {
  const { fs, logger } = adapters;
  const inventory = createEmptyLayerInventory();

  // Default pattern for spec files
  const pattern = options.pattern ?? '**/*.{ts,tsx}';

  // Find all TypeScript files
  logger.info('Scanning for contract layer files...');
  const files = await fs.glob({ pattern });

  // Process each file
  for (const file of files) {
    // Skip node_modules and dist
    if (file.includes('node_modules') || file.includes('/dist/')) {
      continue;
    }

    try {
      const code = await fs.readFile(file);

      // Check for feature files
      if (isFeatureFile(file)) {
        const result = scanFeatureSource(code, file);
        inventory.features.set(result.key, result);
        continue;
      }

      // Check for example files
      if (isExampleFile(file)) {
        const result = scanExampleSource(code, file);
        inventory.examples.set(result.key, result);
        continue;
      }

      // Check for app-config files
      if (file.includes('.app-config.') || file.includes('.blueprint.')) {
        const specs = scanAllSpecsFromSource(code, file);
        for (const spec of specs) {
          if (spec.specType === 'app-config' && spec.key) {
            inventory.appConfigs.set(spec.key, spec);
          }
        }
      }
    } catch {
      // Skip files that can't be read
    }
  }

  // Find workspace config files
  try {
    const configFiles = await fs.glob({ pattern: '**/.contractsrc.json' });
    for (const configFile of configFiles) {
      if (configFile.includes('node_modules')) continue;

      try {
        const content = await fs.readFile(configFile);
        const config = JSON.parse(content) as Record<string, unknown>;
        inventory.workspaceConfigs.set(configFile, {
          file: configFile,
          config,
          valid: true,
          errors: [],
        });
      } catch (e) {
        inventory.workspaceConfigs.set(configFile, {
          file: configFile,
          config: {},
          valid: false,
          errors: [e instanceof Error ? e.message : 'Parse error'],
        });
      }
    }
  } catch {
    // Glob failed, no config files found
  }

  const stats = {
    features: inventory.features.size,
    examples: inventory.examples.size,
    appConfigs: inventory.appConfigs.size,
    workspaceConfigs: inventory.workspaceConfigs.size,
    total:
      inventory.features.size +
      inventory.examples.size +
      inventory.appConfigs.size +
      inventory.workspaceConfigs.size,
  };

  logger.info(
    `Discovered ${stats.features} features, ${stats.examples} examples, ` +
      `${stats.appConfigs} app configs, ${stats.workspaceConfigs} workspace configs`
  );

  return { inventory, stats };
}

/**
 * Get all layers as a flat list with locations.
 */
export function getAllLayerLocations(
  inventory: LayerInventory
): LayerLocation[] {
  const locations: LayerLocation[] = [];

  for (const [key, feature] of inventory.features) {
    locations.push({
      key,
      file: feature.filePath,
      type: 'feature',
    });
  }

  for (const [key, example] of inventory.examples) {
    locations.push({
      key,
      version: example.version,
      file: example.filePath,
      type: 'example',
    });
  }

  for (const [key, appConfig] of inventory.appConfigs) {
    locations.push({
      key,
      version: appConfig.version,
      file: appConfig.filePath,
      type: 'app-config',
    });
  }

  for (const [, config] of inventory.workspaceConfigs) {
    locations.push({
      key: config.file,
      file: config.file,
      type: 'workspace-config',
    });
  }

  return locations;
}
