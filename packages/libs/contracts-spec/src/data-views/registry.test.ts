import { describe, expect, it } from 'bun:test';
import { dataViewKey, DataViewRegistry } from './registry';
import type { DataViewSpec } from './spec';

describe('DataViewRegistry', () => {
  const createSpec = (
    key: string,
    version = '1.0.0',
    overrides?: Partial<DataViewSpec>
  ): DataViewSpec => ({
    meta: {
      key,
      version,
      title: `View ${key}`,
      description: `Description for ${key}`,
      stability: 'stable',
      owners: ['platform.core'],
      tags: ['test'],
      entity: 'entity',
    },
    source: { primary: { key: `${key}.query`, version: '1.0.0' } },
    view: { kind: 'list', fields: [] },
    ...overrides,
  });

  describe('register', () => {
    it('should register a data view', () => {
      const registry = new DataViewRegistry();
      const spec = createSpec('residents.list');

      registry.register(spec);

      expect(registry.list()).toHaveLength(1);
    });

    it('should return this for chaining', () => {
      const registry = new DataViewRegistry();
      const spec = createSpec('residents.list');

      const result = registry.register(spec);

      expect(result).toBe(registry);
    });

    it('should throw on duplicate key', () => {
      const registry = new DataViewRegistry();
      const spec1 = createSpec('duplicate.view');
      const spec2 = createSpec('duplicate.view');

      registry.register(spec1);

      expect(() => registry.register(spec2)).toThrow(/Duplicate contract/);
    });

    it('should allow same key with different versions', () => {
      const registry = new DataViewRegistry();
      registry.register(createSpec('versioned.view', '1.0.0'));
      registry.register(createSpec('versioned.view', '2.0.0'));

      expect(registry.list()).toHaveLength(2);
    });
  });

  describe('list', () => {
    it('should return empty array for new registry', () => {
      const registry = new DataViewRegistry();
      expect(registry.list()).toEqual([]);
    });

    it('should return all registered specs', () => {
      const registry = new DataViewRegistry();
      registry.register(createSpec('a'));
      registry.register(createSpec('b'));
      registry.register(createSpec('c'));

      expect(registry.list()).toHaveLength(3);
    });
  });

  describe('get', () => {
    it('should get spec by key and version', () => {
      const registry = new DataViewRegistry();
      const spec = createSpec('target.view', '1.0.0');
      registry.register(spec);

      expect(registry.get('target.view', '1.0.0')).toBe(spec);
    });

    it('should return undefined for non-existent spec', () => {
      const registry = new DataViewRegistry();
      expect(registry.get('nonexistent')).toBeUndefined();
    });

    it('should get latest version when version not specified', () => {
      const registry = new DataViewRegistry();
      registry.register(createSpec('multi.version', '1.0.0'));
      registry.register(createSpec('multi.version', '3.0.0'));
      registry.register(createSpec('multi.version', '2.0.0'));

      const latest = registry.get('multi.version');
      expect(latest?.meta.version).toBe('3.0.0');
    });
  });

  describe('filter', () => {
    it('should filter by stability', () => {
      const registry = new DataViewRegistry();
      registry.register(
        createSpec('stable.view', '1.0.0', {
          meta: {
            key: 'stable.view',
            version: '1.0.0',
            title: 'Stable',
            description: 'Stable',
            stability: 'stable',
            owners: [],
            tags: [],
            entity: 'entity',
          },
        })
      );
      registry.register(
        createSpec('beta.view', '1.0.0', {
          meta: {
            key: 'beta.view',
            version: '1.0.0',
            title: 'Beta',
            description: 'Beta',
            stability: 'beta',
            owners: [],
            tags: [],
            entity: 'entity',
          },
        })
      );

      const stable = registry.filter({ stability: ['stable'] });
      expect(stable).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(stable[0]!.meta.key).toBe('stable.view');
    });
  });

  describe('listByTag', () => {
    it('should filter by tag', () => {
      const registry = new DataViewRegistry();
      registry.register(
        createSpec('payments.view', '1.0.0', {
          meta: {
            key: 'payments.view',
            version: '1.0.0',
            title: 'Payments',
            description: 'Payments view',
            stability: 'stable',
            owners: [],
            tags: ['payments', 'finance'],
            entity: 'payment',
          },
        })
      );
      registry.register(
        createSpec('users.view', '1.0.0', {
          meta: {
            key: 'users.view',
            version: '1.0.0',
            title: 'Users',
            description: 'Users view',
            stability: 'stable',
            owners: [],
            tags: ['users'],
            entity: 'user',
          },
        })
      );

      const payments = registry.listByTag('payments');
      expect(payments).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(payments[0]!.meta.key).toBe('payments.view');
    });
  });

  describe('listByOwner', () => {
    it('should filter by owner', () => {
      const registry = new DataViewRegistry();
      registry.register(
        createSpec('team-a.view', '1.0.0', {
          meta: {
            key: 'team-a.view',
            version: '1.0.0',
            title: 'Team A',
            description: 'Team A view',
            stability: 'stable',
            owners: ['team.a'],
            tags: [],
            entity: 'entity',
          },
        })
      );
      registry.register(
        createSpec('team-b.view', '1.0.0', {
          meta: {
            key: 'team-b.view',
            version: '1.0.0',
            title: 'Team B',
            description: 'Team B view',
            stability: 'stable',
            owners: ['team.b'],
            tags: [],
            entity: 'entity',
          },
        })
      );

      const teamA = registry.listByOwner('team.a');
      expect(teamA).toHaveLength(1);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(teamA[0]!.meta.key).toBe('team-a.view');
    });
  });

  describe('groupBy', () => {
    it('should group by entity', () => {
      const registry = new DataViewRegistry();
      registry.register(
        createSpec('user.list', '1.0.0', {
          meta: {
            key: 'user.list',
            version: '1.0.0',
            title: 'User List',
            description: 'List',
            stability: 'stable',
            owners: [],
            tags: [],
            entity: 'user',
          },
        })
      );
      registry.register(
        createSpec('user.detail', '1.0.0', {
          meta: {
            key: 'user.detail',
            version: '1.0.0',
            title: 'User Detail',
            description: 'Detail',
            stability: 'stable',
            owners: [],
            tags: [],
            entity: 'user',
          },
        })
      );
      registry.register(
        createSpec('order.list', '1.0.0', {
          meta: {
            key: 'order.list',
            version: '1.0.0',
            title: 'Order List',
            description: 'List',
            stability: 'stable',
            owners: [],
            tags: [],
            entity: 'order',
          },
        })
      );

      const byEntity = registry.groupBy((spec) => spec.meta.entity);
      expect(byEntity.get('user')).toHaveLength(2);
      expect(byEntity.get('order')).toHaveLength(1);
    });
  });

  describe('getUniqueTags', () => {
    it('should return unique tags', () => {
      const registry = new DataViewRegistry();
      registry.register(
        createSpec('a', '1.0.0', {
          meta: {
            key: 'a',
            version: '1.0.0',
            title: 'A',
            description: 'A',
            stability: 'stable',
            owners: [],
            tags: ['tag1', 'tag2'],
            entity: 'e',
          },
        })
      );
      registry.register(
        createSpec('b', '1.0.0', {
          meta: {
            key: 'b',
            version: '1.0.0',
            title: 'B',
            description: 'B',
            stability: 'stable',
            owners: [],
            tags: ['tag2', 'tag3'],
            entity: 'e',
          },
        })
      );

      const tags = registry.getUniqueTags();
      expect(tags).toContain('tag1');
      expect(tags).toContain('tag2');
      expect(tags).toContain('tag3');
      expect(tags.filter((t) => t === 'tag2')).toHaveLength(1);
    });
  });
});

describe('dataViewKey', () => {
  it('should generate key from spec', () => {
    const spec: DataViewSpec = {
      meta: {
        key: 'residents.list',
        version: '3.0.0',
        title: 'Residents',
        description: 'List',
        stability: 'stable',
        owners: [],
        tags: [],
        entity: 'resident',
      },
      source: { primary: { key: 'q', version: '1.0.0' } },
      view: { kind: 'list', fields: [] },
    };

    expect(dataViewKey(spec)).toBe('residents.list.v3.0.0');
  });
});
