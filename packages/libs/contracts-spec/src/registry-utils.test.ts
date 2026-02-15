/**
 * Tests for registry filtering and grouping utilities.
 */
import { describe, expect, it } from 'bun:test';
import {
  type FilterableItem,
  filterBy,
  getUniqueDomains,
  getUniqueOwners,
  getUniqueTags,
  groupBy,
  groupByToArray,
  GroupingStrategies,
} from './registry-utils';

// Test fixtures
const createItem = (
  key: string,
  tags: string[] = [],
  owners: string[] = [],
  stability: 'experimental' | 'beta' | 'stable' | 'deprecated' = 'stable'
): FilterableItem => ({
  meta: { key, tags, owners, stability },
});

const testItems: FilterableItem[] = [
  createItem('auth.login', ['auth', 'public'], ['team-auth'], 'stable'),
  createItem('auth.logout', ['auth'], ['team-auth'], 'stable'),
  createItem(
    'users.create',
    ['users', 'admin'],
    ['team-users'],
    'experimental'
  ),
  createItem('users.list', ['users', 'public'], ['team-users'], 'stable'),
  createItem('payments.process', ['payments'], ['team-payments'], 'beta'),
];

describe('Registry Utils', () => {
  describe('filterBy', () => {
    it('should filter by single tag', () => {
      const result = filterBy(testItems, { tags: ['auth'] });
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.meta.key)).toContain('auth.login');
      expect(result.map((i) => i.meta.key)).toContain('auth.logout');
    });

    it('should filter by multiple tags (OR)', () => {
      const result = filterBy(testItems, { tags: ['auth', 'payments'] });
      expect(result).toHaveLength(3);
    });

    it('should filter by owner', () => {
      const result = filterBy(testItems, { owners: ['team-users'] });
      expect(result).toHaveLength(2);
    });

    it('should filter by stability', () => {
      const result = filterBy(testItems, { stability: ['stable'] });
      expect(result).toHaveLength(3);
    });

    it('should filter by domain', () => {
      const result = filterBy(testItems, { domain: 'auth' });
      expect(result).toHaveLength(2);
    });

    it('should filter by name pattern with wildcard', () => {
      const result = filterBy(testItems, { keyPattern: 'users.*' });
      expect(result).toHaveLength(2);
    });

    it('should combine multiple criteria with AND', () => {
      const result = filterBy(testItems, {
        tags: ['public'],
        stability: ['stable'],
      });
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.meta.key)).toContain('auth.login');
      expect(result.map((i) => i.meta.key)).toContain('users.list');
    });

    it('should return all items with empty criteria', () => {
      const result = filterBy(testItems, {});
      expect(result).toHaveLength(5);
    });
  });

  describe('groupBy', () => {
    it('should group items by key function', () => {
      const result = groupBy(testItems, GroupingStrategies.byDomain);
      expect(result.get('auth')).toHaveLength(2);
      expect(result.get('users')).toHaveLength(2);
      expect(result.get('payments')).toHaveLength(1);
    });

    it('should group by first tag', () => {
      const result = groupBy(testItems, GroupingStrategies.byTag);
      expect(result.get('auth')).toHaveLength(2);
      expect(result.get('users')).toHaveLength(2);
      expect(result.get('payments')).toHaveLength(1);
    });

    it('should group by owner', () => {
      const result = groupBy(testItems, GroupingStrategies.byOwner);
      expect(result.get('team-auth')).toHaveLength(2);
      expect(result.get('team-users')).toHaveLength(2);
      expect(result.get('team-payments')).toHaveLength(1);
    });

    it('should group by stability', () => {
      const result = groupBy(testItems, GroupingStrategies.byStability);
      expect(result.get('stable')).toHaveLength(3);
      expect(result.get('experimental')).toHaveLength(1);
      expect(result.get('beta')).toHaveLength(1);
    });
  });

  describe('groupByToArray', () => {
    it('should return array format', () => {
      const result = groupByToArray(testItems, GroupingStrategies.byDomain);
      expect(result).toHaveLength(3);
      const authGroup = result.find((g) => g.key === 'auth');
      expect(authGroup?.items).toHaveLength(2);
    });
  });

  describe('getUniqueTags', () => {
    it('should return unique tags sorted', () => {
      const result = getUniqueTags(testItems);
      expect(result).toEqual(['admin', 'auth', 'payments', 'public', 'users']);
    });
  });

  describe('getUniqueOwners', () => {
    it('should return unique owners sorted', () => {
      const result = getUniqueOwners(testItems);
      expect(result).toEqual(['team-auth', 'team-payments', 'team-users']);
    });
  });

  describe('getUniqueDomains', () => {
    it('should return unique domains sorted', () => {
      const result = getUniqueDomains(testItems);
      expect(result).toEqual(['auth', 'payments', 'users']);
    });
  });

  describe('GroupingStrategies.byUrlPath', () => {
    it('should group by URL path level', () => {
      const pathItems = [
        { path: '/api/v1/users' },
        { path: '/api/v1/auth' },
        { path: '/api/v2/users' },
      ];

      const level1 = groupBy(pathItems, GroupingStrategies.byUrlPath(1));
      expect(level1.get('api')).toHaveLength(3);

      const level2 = groupBy(pathItems, GroupingStrategies.byUrlPath(2));
      expect(level2.get('api/v1')).toHaveLength(2);
      expect(level2.get('api/v2')).toHaveLength(1);
    });
  });
});
