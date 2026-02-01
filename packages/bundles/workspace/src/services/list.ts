/**
 * List specs service.
 */

import {
  scanSpecSource,
  type SpecScanResult,
} from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';
import micromatch from 'micromatch';
import { isTestFile } from '../utils';
import type { MaybeArray } from '@contractspec/lib.utils-typescript';
import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts';

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
  type?: MaybeArray<string>;

  /**
   * Workspace configuration
   */
  config?: ResolvedContractsrcConfig;
}

/**
 * List all spec files in the workspace.
 */
export async function listSpecs(
  adapters: { fs: FsAdapter; scan?: typeof scanSpecSource },
  options: ListSpecsOptions = {}
): Promise<SpecScanResult[]> {
  const { fs, scan = scanSpecSource } = adapters;

  // Use pattern if provided, otherwise let fs.glob use its defaults (DEFAULT_SPEC_PATTERNS)
  // This aligns listSpecs behavior with the CI command behavior
  const pattern = options.pattern;
  const files = await fs.glob({ pattern });
  const results: SpecScanResult[] = [];
  const specTypesToSearch = Array.isArray(options.type)
    ? options.type
    : [options.type];

  for (const file of files) {
    // Skip node_modules and dist
    if (file.includes('node_modules') || file.includes('/dist/')) {
      continue;
    }

    // If excluding packages via config
    if (
      options.config?.excludePackages &&
      micromatch.isMatch(file, options.config.excludePackages, {
        contains: true,
      })
    ) {
      continue;
    }

    // Exclude test files
    if (isTestFile(file, options.config)) {
      continue;
    }

    try {
      const content = await fs.readFile(file);
      const result = scan(content, file);

      if (result.specType === 'unknown') {
        continue;
      }

      if (options.type && !specTypesToSearch.includes(result.specType)) {
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
