/**
 * Grouping and filtering utilities for ContractSpec workspace analysis.
 * Provides services to filter and group scan results.
 */

import type {
  SpecScanResult,
  FeatureScanResult,
} from '../types/analysis-types';
import type { Stability } from '../types/spec-types';

/**
 * Filter criteria for spec scan results.
 */
export interface SpecFilter {
  /** Filter by tags (item must have at least one matching tag) */
  tags?: string[];
  /** Filter by owners (item must have at least one matching owner) */
  owners?: string[];
  /** Filter by stability levels */
  stability?: Stability[];
  /** Filter by spec type */
  specType?: SpecScanResult['specType'][];
  /** Filter by name pattern (glob) */
  namePattern?: string;
}

/**
 * Grouping key function type.
 */
export type GroupKeyFn<T> = (item: T) => string;

/**
 * Grouped items result.
 */
export interface GroupedItems<T> {
  key: string;
  items: T[];
}

/**
 * Pre-built grouping strategies for spec scan results.
 */
export const SpecGroupingStrategies = {
  /** Group by first tag. */
  byTag: (item: SpecScanResult): string => item.tags?.[0] ?? 'untagged',

  /** Group by first owner. */
  byOwner: (item: SpecScanResult): string => item.owners?.[0] ?? 'unowned',

  /** Group by domain (first segment of name). */
  byDomain: (item: SpecScanResult): string => {
    const name = item.name ?? '';
    if (name.includes('.')) {
      return name.split('.')[0] ?? 'default';
    }
    return 'default';
  },

  /** Group by stability. */
  byStability: (item: SpecScanResult): string => item.stability ?? 'stable',

  /** Group by spec type. */
  bySpecType: (item: SpecScanResult): string => item.specType,

  /** Group by file directory. */
  byDirectory: (item: SpecScanResult): string => {
    const parts = item.filePath.split('/');
    // Return parent directory
    return parts.slice(0, -1).join('/') || '.';
  },
};

/**
 * Filter specs by criteria.
 */
export function filterSpecs(
  specs: SpecScanResult[],
  filter: SpecFilter
): SpecScanResult[] {
  return specs.filter((spec) => {
    // Filter by tags
    if (filter.tags?.length) {
      const hasMatchingTag = filter.tags.some((tag) =>
        spec.tags?.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    // Filter by owners
    if (filter.owners?.length) {
      const hasMatchingOwner = filter.owners.some((owner) =>
        spec.owners?.includes(owner)
      );
      if (!hasMatchingOwner) return false;
    }

    // Filter by stability
    if (filter.stability?.length) {
      if (!filter.stability.includes(spec.stability ?? 'stable')) {
        return false;
      }
    }

    // Filter by spec type
    if (filter.specType?.length) {
      if (!filter.specType.includes(spec.specType)) {
        return false;
      }
    }

    // Filter by name pattern
    if (filter.namePattern) {
      const name = spec.name ?? '';
      const pattern = filter.namePattern
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      const regex = new RegExp(`^${pattern}$`, 'i');
      if (!regex.test(name)) return false;
    }

    return true;
  });
}

/**
 * Group specs by key function.
 */
export function groupSpecs<T>(
  items: T[],
  keyFn: GroupKeyFn<T>
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const key = keyFn(item);
    const existing = groups.get(key);
    if (existing) {
      existing.push(item);
    } else {
      groups.set(key, [item]);
    }
  }

  return groups;
}

/**
 * Group specs and return as array.
 */
export function groupSpecsToArray<T>(
  items: T[],
  keyFn: GroupKeyFn<T>
): GroupedItems<T>[] {
  const map = groupSpecs(items, keyFn);
  return Array.from(map.entries())
    .map(([key, items]) => ({ key, items }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Get unique tags from spec results.
 */
export function getUniqueSpecTags(specs: SpecScanResult[]): string[] {
  const tags = new Set<string>();
  for (const spec of specs) {
    for (const tag of spec.tags ?? []) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

/**
 * Get unique owners from spec results.
 */
export function getUniqueSpecOwners(specs: SpecScanResult[]): string[] {
  const owners = new Set<string>();
  for (const spec of specs) {
    for (const owner of spec.owners ?? []) {
      owners.add(owner);
    }
  }
  return Array.from(owners).sort();
}

/**
 * Get unique domains from spec results.
 */
export function getUniqueSpecDomains(specs: SpecScanResult[]): string[] {
  const domains = new Set<string>();
  for (const spec of specs) {
    domains.add(SpecGroupingStrategies.byDomain(spec));
  }
  return Array.from(domains).sort();
}

/**
 * Filter features by criteria.
 */
export function filterFeatures(
  features: FeatureScanResult[],
  filter: SpecFilter
): FeatureScanResult[] {
  return features.filter((feature) => {
    // Filter by tags
    if (filter.tags?.length) {
      const hasMatchingTag = filter.tags.some((tag) =>
        feature.tags?.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    // Filter by owners
    if (filter.owners?.length) {
      const hasMatchingOwner = filter.owners.some((owner) =>
        feature.owners?.includes(owner)
      );
      if (!hasMatchingOwner) return false;
    }

    // Filter by stability
    if (filter.stability?.length) {
      if (!filter.stability.includes(feature.stability ?? 'stable')) {
        return false;
      }
    }

    // Filter by name pattern
    if (filter.namePattern) {
      const pattern = filter.namePattern
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      const regex = new RegExp(`^${pattern}$`, 'i');
      if (!regex.test(feature.key)) return false;
    }

    return true;
  });
}
