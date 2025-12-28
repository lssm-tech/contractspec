/**
 * Layer health checks.
 *
 * Validates contract layers (features, examples, app-configs, workspace-configs).
 */

import type { FsAdapter } from '../../../ports/fs';
import type { CheckContext, CheckResult } from '../types';
import { discoverLayers } from '../../layer-discovery';

/**
 * Run all layer health checks.
 */
export async function runLayerChecks(
  fs: FsAdapter,
  _ctx: CheckContext
): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Discover layers
  const discovery = await discoverLayers(
    {
      fs,
      logger: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        info: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        warn: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        error: () => {},
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        debug: () => {},
        createProgress: () => ({
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          start: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          update: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          succeed: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          fail: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          warn: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          stop: () => {},
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          finish: () => {},
        }),
      },
    },
    {}
  );

  // Check: Has features
  results.push(checkHasFeatures(discovery.stats.features));

  // Check: Has examples
  results.push(checkHasExamples(discovery.stats.examples));

  // Check: Features have owners
  results.push(checkFeatureOwners(discovery.inventory.features));

  // Check: Examples have valid entrypoints
  results.push(checkExampleEntrypoints(discovery.inventory.examples));

  // Check: Workspace configs are valid
  results.push(checkWorkspaceConfigs(discovery.inventory.workspaceConfigs));

  return results;
}

/**
 * Check if workspace has features defined.
 */
function checkHasFeatures(count: number): CheckResult {
  if (count > 0) {
    return {
      category: 'layers',
      name: 'Features Defined',
      status: 'pass',
      message: `Found ${count} feature module(s)`,
    };
  }

  return {
    category: 'layers',
    name: 'Features Defined',
    status: 'warn',
    message: 'No feature modules found',
    details: 'Create a .feature.ts file to organize your specs into features',
  };
}

/**
 * Check if workspace has examples defined.
 */
function checkHasExamples(count: number): CheckResult {
  if (count > 0) {
    return {
      category: 'layers',
      name: 'Examples Defined',
      status: 'pass',
      message: `Found ${count} example(s)`,
    };
  }

  return {
    category: 'layers',
    name: 'Examples Defined',
    status: 'skip',
    message: 'No examples found (optional)',
    details: 'Create an example.ts file to package reusable templates',
  };
}

/**
 * Check if features have owners defined.
 */
function checkFeatureOwners(
  features: Map<string, { owners?: string[]; filePath: string }>
): CheckResult {
  const missingOwners: string[] = [];

  for (const [key, feature] of features) {
    if (!feature.owners?.length) {
      missingOwners.push(key);
    }
  }

  if (missingOwners.length === 0) {
    return {
      category: 'layers',
      name: 'Feature Owners',
      status: features.size > 0 ? 'pass' : 'skip',
      message:
        features.size > 0
          ? 'All features have owners defined'
          : 'No features to check',
    };
  }

  return {
    category: 'layers',
    name: 'Feature Owners',
    status: 'warn',
    message: `${missingOwners.length} feature(s) missing owners`,
    details: `Features: ${missingOwners.slice(0, 3).join(', ')}${missingOwners.length > 3 ? '...' : ''}`,
  };
}

/**
 * Check if examples have valid entrypoints.
 */
function checkExampleEntrypoints(
  examples: Map<
    string,
    { entrypoints: { packageName: string }; filePath: string }
  >
): CheckResult {
  const missingPackage: string[] = [];

  for (const [key, example] of examples) {
    if (!example.entrypoints.packageName) {
      missingPackage.push(key);
    }
  }

  if (missingPackage.length === 0) {
    return {
      category: 'layers',
      name: 'Example Entrypoints',
      status: examples.size > 0 ? 'pass' : 'skip',
      message:
        examples.size > 0
          ? 'All examples have valid entrypoints'
          : 'No examples to check',
    };
  }

  return {
    category: 'layers',
    name: 'Example Entrypoints',
    status: 'fail',
    message: `${missingPackage.length} example(s) missing packageName`,
    details: `Examples: ${missingPackage.join(', ')}`,
  };
}

/**
 * Check if workspace configs are valid.
 */
function checkWorkspaceConfigs(
  configs: Map<string, { valid: boolean; errors: string[]; file: string }>
): CheckResult {
  const invalid: string[] = [];

  for (const [, config] of configs) {
    if (!config.valid) {
      invalid.push(config.file);
    }
  }

  if (configs.size === 0) {
    return {
      category: 'layers',
      name: 'Workspace Configs',
      status: 'skip',
      message: 'No .contractsrc.json files found',
    };
  }

  if (invalid.length === 0) {
    return {
      category: 'layers',
      name: 'Workspace Configs',
      status: 'pass',
      message: `All ${configs.size} workspace config(s) are valid`,
    };
  }

  return {
    category: 'layers',
    name: 'Workspace Configs',
    status: 'fail',
    message: `${invalid.length} workspace config(s) invalid`,
    details: `Files: ${invalid.join(', ')}`,
  };
}
