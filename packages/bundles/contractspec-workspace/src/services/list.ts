/**
 * List specs service.
 */

import {
  scanSpecSource,
  type SpecScanResult,
} from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../ports/fs';

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
}

/**
 * List all spec files in the workspace.
 */
export async function listSpecs(
  adapters: { fs: FsAdapter },
  options: ListSpecsOptions = {}
): Promise<SpecScanResult[]> {
  const { fs } = adapters;

  const files = await fs.glob({ pattern: options.pattern });
  const results: SpecScanResult[] = [];

  for (const file of files) {
    const content = await fs.readFile(file);
    const result = scanSpecSource(content, file);

    if (options.type && result.specType !== options.type) {
      continue;
    }

    results.push(result);
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




