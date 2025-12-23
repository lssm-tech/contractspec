/**
 * Registry utilities for filtering and grouping ContractSpec items.
 * Provides shared logic used across all registry types.
 */

import type { Stability } from './ownership';

/**
 * Filter criteria for registry items.
 * All criteria are optional and combined with AND logic.
 */
export interface RegistryFilter {
  /** Filter by tags (item must have at least one matching tag) */
  tags?: string[];
  /** Filter by owners (item must have at least one matching owner) */
  owners?: string[];
  /** Filter by stability levels */
  stability?: Stability[];
  /** Filter by domain (first segment of name) */
  domain?: string;
  /** Filter by name pattern (glob or regex) */
  namePattern?: string;
}

/**
 * Item with standard metadata for filtering.
 */
export interface FilterableItem {
  meta: {
    name?: string;
    key?: string;
    tags?: string[];
    owners?: string[];
    stability?: Stability;
    domain?: string;
  };
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
 * Pre-built grouping strategies for common use cases.
 */
export const GroupingStrategies = {
  /**
   * Group by first tag.
   */
  byTag: <T extends FilterableItem>(item: T): string =>
    item.meta.tags?.[0] ?? 'untagged',

  /**
   * Group by all tags (item appears in multiple groups).
   */
  byAllTags: <T extends FilterableItem>(item: T): string[] =>
    item.meta.tags?.length ? item.meta.tags : ['untagged'],

  /**
   * Group by first owner.
   */
  byOwner: <T extends FilterableItem>(item: T): string =>
    item.meta.owners?.[0] ?? 'unowned',

  /**
   * Group by domain (first segment of name).
   */
  byDomain: <T extends FilterableItem>(item: T): string => {
    const name = item.meta.name ?? item.meta.key ?? '';
    return name.split('.')[0] ?? 'default';
  },

  /**
   * Group by stability level.
   */
  byStability: <T extends FilterableItem>(item: T): string =>
    item.meta.stability ?? 'stable',

  /**
   * Create URL path grouping strategy with configurable depth.
   */
  byUrlPath:
    (level: number) =>
    (item: { path?: string }): string => {
      if (!item.path) return 'root';
      const segments = item.path.split('/').filter(Boolean);
      return segments.slice(0, level).join('/') || 'root';
    },
};

/**
 * Filter items by criteria.
 * All criteria are combined with AND logic.
 */
export function filterBy<T extends FilterableItem>(
  items: T[],
  filter: RegistryFilter
): T[] {
  return items.filter((item) => {
    // Filter by tags
    if (filter.tags?.length) {
      const hasMatchingTag = filter.tags.some((tag) =>
        item.meta.tags?.includes(tag)
      );
      if (!hasMatchingTag) return false;
    }

    // Filter by owners
    if (filter.owners?.length) {
      const hasMatchingOwner = filter.owners.some((owner) =>
        item.meta.owners?.includes(owner)
      );
      if (!hasMatchingOwner) return false;
    }

    // Filter by stability
    if (filter.stability?.length) {
      if (!filter.stability.includes(item.meta.stability ?? 'stable')) {
        return false;
      }
    }

    // Filter by domain
    if (filter.domain) {
      const itemDomain = GroupingStrategies.byDomain(item);
      if (itemDomain !== filter.domain) return false;
    }

    // Filter by name pattern
    if (filter.namePattern) {
      const name = item.meta.name ?? item.meta.key ?? '';
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
 * Group items by key function.
 */
export function groupBy<T>(items: T[], keyFn: GroupKeyFn<T>): Map<string, T[]> {
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
 * Group items by key function, returning array format.
 */
export function groupByToArray<T>(
  items: T[],
  keyFn: GroupKeyFn<T>
): GroupedItems<T>[] {
  const map = groupBy(items, keyFn);
  return Array.from(map.entries()).map(([key, items]) => ({ key, items }));
}

/**
 * Group items where one item can belong to multiple groups.
 * Useful for byAllTags grouping.
 */
export function groupByMultiple<T>(
  items: T[],
  keysFn: (item: T) => string[]
): Map<string, T[]> {
  const groups = new Map<string, T[]>();

  for (const item of items) {
    const keys = keysFn(item);
    for (const key of keys) {
      const existing = groups.get(key);
      if (existing) {
        existing.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
  }

  return groups;
}

/**
 * Get unique tags from a collection of items.
 */
export function getUniqueTags<T extends FilterableItem>(items: T[]): string[] {
  const tags = new Set<string>();
  for (const item of items) {
    for (const tag of item.meta.tags ?? []) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

/**
 * Get unique owners from a collection of items.
 */
export function getUniqueOwners<T extends FilterableItem>(
  items: T[]
): string[] {
  const owners = new Set<string>();
  for (const item of items) {
    for (const owner of item.meta.owners ?? []) {
      owners.add(owner);
    }
  }
  return Array.from(owners).sort();
}

/**
 * Get unique domains from a collection of items.
 */
export function getUniqueDomains<T extends FilterableItem>(
  items: T[]
): string[] {
  const domains = new Set<string>();
  for (const item of items) {
    domains.add(GroupingStrategies.byDomain(item));
  }
  return Array.from(domains).sort();
}
