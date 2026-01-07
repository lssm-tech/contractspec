/**
 * List specs service.
 */

import {
  scanSpecSource,
  type SpecScanResult,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import type { ContractsrcConfig } from '@contractspec/lib.contracts/workspace-config';

/**
 * Options for listing specs.
 */
export interface ListSpecsOptions {
  /**
   * File pattern to search.
   */
  pattern?: string;

  /**
   * Filter by spec type.
   */
  type?: string;

  /**
   * Workspace configuration
   */
  config?: ContractsrcConfig;
}

/**
 * List all spec files in the workspace.
 */
export async function listSpecs(
  adapters: { fs: FsAdapter; scan?: typeof scanSpecSource },
  options: ListSpecsOptions = {}
): Promise<SpecScanResult[]> {
  const { fs, scan = scanSpecSource } = adapters;

  // Default to all TS files if no pattern provided
  const pattern = options.pattern ?? '**/*.{ts,tsx}';
  const files = await fs.glob({ pattern });
  const results: SpecScanResult[] = [];

  for (const file of files) {
    // Skip node_modules and dist
    if (file.includes('node_modules') || file.includes('/dist/')) {
      continue;
    }

    // If excluding packages via config
    if (
      options.config?.excludePackages &&
      options.config.excludePackages.some((pkg) => file.includes(pkg))
    ) {
      continue;
    }

    try {
      const content = await fs.readFile(file);
      const result = scan(content, file);

      if (result.specType === 'unknown') {
        continue;
      }

      if (options.type && result.specType !== options.type) {
        continue;
      }

      results.push(result);
    } catch {
      // Ignore read errors
    }
  }

  return results;
}

/**
 * Group specs by type.
 */
export function groupSpecsByType(
  specs: SpecScanResult[]
): Map<string, SpecScanResult[]> {
  const groups = new Map<string, SpecScanResult[]>();

  for (const spec of specs) {
    const group = groups.get(spec.specType) ?? [];
    group.push(spec);
    groups.set(spec.specType, group);
  }

  return groups;
}
