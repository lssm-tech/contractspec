/**
 * Layer validation checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import type { LoggerAdapter } from '../../../ports/logger';
import { discoverLayers } from '../../layer-discovery';
import type { CICheckOptions, CIIssue } from '../types';

/**
 * Run layer validation checks.
 */
export async function runLayerChecks(
  adapters: { fs: FsAdapter; logger: LoggerAdapter },
  _options: CICheckOptions
): Promise<CIIssue[]> {
  const issues: CIIssue[] = [];

  // Discover all layers
  const result = await discoverLayers(adapters, {});

  // Validate features
  for (const [key, feature] of result.inventory.features) {
    // Check required meta fields
    if (!feature.key) {
      issues.push({
        ruleId: 'layer-feature-missing-key',
        severity: 'error',
        message: `Feature missing required 'key' field`,
        category: 'layers',
        file: feature.filePath,
        context: { key },
      });
    }

    if (!feature.owners?.length) {
      issues.push({
        ruleId: 'layer-feature-missing-owners',
        severity: 'warning',
        message: `Feature '${key}' missing 'owners' field`,
        category: 'layers',
        file: feature.filePath,
        context: { key },
      });
    }

    // Check for empty features
    if (
      feature.operations.length === 0 &&
      feature.events.length === 0 &&
      feature.presentations.length === 0
    ) {
      issues.push({
        ruleId: 'layer-feature-empty',
        severity: 'warning',
        message: `Feature '${key}' has no operations, events, or presentations`,
        category: 'layers',
        file: feature.filePath,
        context: { key },
      });
    }
  }

  // Validate examples
  for (const [key, example] of result.inventory.examples) {
    // Check required entrypoints
    if (!example.entrypoints.packageName) {
      issues.push({
        ruleId: 'layer-example-missing-package',
        severity: 'error',
        message: `Example '${key}' missing 'packageName' in entrypoints`,
        category: 'layers',
        file: example.filePath,
        context: { key },
      });
    }

    // Check required surfaces
    if (
      !example.surfaces.templates &&
      !example.surfaces.sandbox.enabled &&
      !example.surfaces.studio.enabled &&
      !example.surfaces.mcp.enabled
    ) {
      issues.push({
        ruleId: 'layer-example-no-surfaces',
        severity: 'warning',
        message: `Example '${key}' has no enabled surfaces`,
        category: 'layers',
        file: example.filePath,
        context: { key },
      });
    }
  }

  // Validate workspace configs
  for (const config of result.inventory.workspaceConfigs.values()) {
    if (!config.valid) {
      for (const error of config.errors) {
        issues.push({
          ruleId: 'layer-workspace-config-invalid',
          severity: 'error',
          message: `Invalid workspace config: ${error}`,
          category: 'layers',
          file: config.file,
        });
      }
    }
  }

  return issues;
}
