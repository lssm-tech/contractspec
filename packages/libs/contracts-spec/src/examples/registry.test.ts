import { describe, it, expect, beforeEach } from 'bun:test';
import { ExampleRegistry } from './registry';
import type { ExampleSpec, ExampleMeta } from './types';

function createTestExample(
  overrides: Partial<ExampleMeta> & { key: string }
): ExampleSpec {
  return {
    meta: {
      version: overrides.version ?? '1.0.0',
      key: overrides.key,
      description: overrides.description ?? 'Test example',
      stability: overrides.stability ?? 'experimental',
      owners: overrides.owners ?? ['@test'],
      tags: overrides.tags ?? ['test'],
      kind: overrides.kind ?? 'template',
      visibility: overrides.visibility ?? 'public',
      title: overrides.title,
      summary: overrides.summary,
      domain: overrides.domain,
      docId: overrides.docId,
    },
    surfaces: {
      templates: true,
      sandbox: { enabled: true, modes: ['playground'] },
      studio: { enabled: true, installable: true },
      mcp: { enabled: false },
    },
    entrypoints: {
      packageName: `@test/example.${overrides.key}`,
    },
  };
}

function createTestExampleWithSurfaces(
  key: string,
  surfaces: ExampleSpec['surfaces']
): ExampleSpec {
  return {
    meta: {
      version: '1.0.0',
      key,
      description: 'Test example',
      stability: 'experimental',
      owners: ['@test'],
      tags: ['test'],
      kind: 'template',
      visibility: 'public',
    },
    surfaces,
    entrypoints: {
      packageName: `@test/example.${key}`,
    },
  };
}

describe('ExampleRegistry', () => {
  let registry: ExampleRegistry;

  beforeEach(() => {
    registry = new ExampleRegistry();
  });

  describe('register', () => {
    it('should register an example', () => {
      const example = createTestExample({ key: 'test-1' });
      registry.register(example);
      expect(registry.count()).toBe(1);
      const found = registry.get(example.meta.key);
      expect(found?.meta.version).toBe('1.0.0');
    });

    it('should throw on duplicate key', () => {
      const example1 = createTestExample({ key: 'test-1' });
      const example2 = createTestExample({ key: 'test-1' });
      registry.register(example1);
      expect(() => registry.register(example2)).toThrow(
        'Duplicate contract `example` test-1.v1.0.0'
      );
    });

    it('should allow chaining', () => {
      const example1 = createTestExample({ key: 'test-1' });
      const example2 = createTestExample({ key: 'test-2' });
      const result = registry.register(example1).register(example2);
      expect(result).toBe(registry);
      expect(registry.count()).toBe(2);
    });
  });

  describe('list', () => {
    it('should return all registered examples', () => {
      const example1 = createTestExample({ key: 'test-1' });
      const example2 = createTestExample({ key: 'test-2' });
      registry.register(example1).register(example2);
      const list = registry.list();
      expect(list).toHaveLength(2);
    });

    it('should return empty array when no examples registered', () => {
      expect(registry.list()).toEqual([]);
    });
  });

  describe('get', () => {
    it('should return example by key', () => {
      const example = createTestExample({ key: 'test-1' });
      registry.register(example);
      expect(registry.get('test-1')).toBe(example);
    });

    it('should return undefined for unknown key', () => {
      expect(registry.get('unknown')).toBeUndefined();
    });
  });

  describe('has', () => {
    it('should return true for registered example', () => {
      const example = createTestExample({ key: 'test-1' });
      registry.register(example);
      expect(registry.has('test-1')).toBe(true);
    });

    it('should return false for unknown key', () => {
      expect(registry.has('unknown')).toBe(false);
    });
  });

  describe('listByKind', () => {
    it('should filter by kind', () => {
      registry.register(createTestExample({ key: 'test-1', kind: 'template' }));
      registry.register(createTestExample({ key: 'test-2', kind: 'workflow' }));
      registry.register(createTestExample({ key: 'test-3', kind: 'template' }));

      const templates = registry.listByKind('template');
      expect(templates).toHaveLength(2);
      expect(templates.every((e) => e.meta.kind === 'template')).toBe(true);
    });
  });

  describe('listByVisibility', () => {
    it('should filter by visibility', () => {
      registry.register(
        createTestExample({ key: 'test-1', visibility: 'public' })
      );
      registry.register(
        createTestExample({ key: 'test-2', visibility: 'internal' })
      );

      const publicExamples = registry.listByVisibility('public');
      expect(publicExamples).toHaveLength(1);
      expect(publicExamples[0]?.meta.key).toBe('test-1');
    });
  });

  describe('listByTag', () => {
    it('should filter by tag', () => {
      registry.register(
        createTestExample({ key: 'test-1', tags: ['billing', 'saas'] })
      );
      registry.register(
        createTestExample({ key: 'test-2', tags: ['integration'] })
      );

      const billingExamples = registry.listByTag('billing');
      expect(billingExamples).toHaveLength(1);
      expect(billingExamples[0]?.meta.key).toBe('test-1');
    });
  });

  describe('listByOwner', () => {
    it('should filter by owner', () => {
      registry.register(
        createTestExample({ key: 'test-1', owners: ['@team-a'] })
      );
      registry.register(
        createTestExample({ key: 'test-2', owners: ['@team-b'] })
      );

      const teamAExamples = registry.listByOwner('@team-a');
      expect(teamAExamples).toHaveLength(1);
    });
  });

  describe('listByDomain', () => {
    it('should filter by domain', () => {
      registry.register(
        createTestExample({ key: 'test-1', domain: 'finance' })
      );
      registry.register(createTestExample({ key: 'test-2', domain: 'saas' }));

      const financeExamples = registry.listByDomain('finance');
      expect(financeExamples).toHaveLength(1);
    });
  });

  describe('listBySurface', () => {
    it('should filter by templates surface', () => {
      registry.register(
        createTestExampleWithSurfaces('test-1', {
          templates: true,
          sandbox: { enabled: false, modes: [] },
          studio: { enabled: false, installable: false },
          mcp: { enabled: false },
        })
      );
      registry.register(
        createTestExampleWithSurfaces('test-2', {
          templates: false,
          sandbox: { enabled: false, modes: [] },
          studio: { enabled: false, installable: false },
          mcp: { enabled: false },
        })
      );

      const templateExamples = registry.listBySurface('templates');
      expect(templateExamples).toHaveLength(1);
    });

    it('should filter by studio surface', () => {
      registry.register(
        createTestExampleWithSurfaces('test-1', {
          templates: false,
          sandbox: { enabled: false, modes: [] },
          studio: { enabled: true, installable: false },
          mcp: { enabled: false },
        })
      );

      const studioExamples = registry.listBySurface('studio');
      expect(studioExamples).toHaveLength(1);
    });
  });

  describe('listInstallable', () => {
    it('should list only installable examples', () => {
      registry.register(
        createTestExampleWithSurfaces('test-1', {
          templates: true,
          sandbox: { enabled: false, modes: [] },
          studio: { enabled: true, installable: true },
          mcp: { enabled: false },
        })
      );
      registry.register(
        createTestExampleWithSurfaces('test-2', {
          templates: true,
          sandbox: { enabled: false, modes: [] },
          studio: { enabled: true, installable: false },
          mcp: { enabled: false },
        })
      );

      const installable = registry.listInstallable();
      expect(installable).toHaveLength(1);
      expect(installable[0]?.meta.key).toBe('test-1');
    });
  });

  describe('getUniqueTags', () => {
    it('should return unique tags from all examples', () => {
      const example = createTestExample({
        key: 'test-1',
        tags: ['billing', 'saas'],
      });
      registry.register(example);
      registry.register(
        createTestExample({ key: 'test-2', tags: ['saas', 'multi-tenant'] })
      );

      const tags = registry.getUniqueTags();
      expect(tags).toContain('billing');
      expect(tags).toContain('saas');
      expect(tags).toContain('multi-tenant');
    });
  });

  describe('getUniqueKinds', () => {
    it('should return unique kinds from all examples', () => {
      registry.register(createTestExample({ key: 'test-1', kind: 'template' }));
      registry.register(createTestExample({ key: 'test-2', kind: 'workflow' }));
      registry.register(createTestExample({ key: 'test-3', kind: 'template' }));

      const kinds = registry.getUniqueKinds();
      expect(kinds).toHaveLength(2);
      expect(kinds).toContain('template');
      expect(kinds).toContain('workflow');
    });
  });

  describe('search', () => {
    it('should search by key', () => {
      registry.register(createTestExample({ key: 'saas-boilerplate' }));
      registry.register(createTestExample({ key: 'workflow-system' }));

      const results = registry.search('saas');
      expect(results).toHaveLength(1);
      expect(results[0]?.meta.key).toBe('saas-boilerplate');
    });

    it('should search by title', () => {
      registry.register(
        createTestExample({ key: 'test-1', title: 'SaaS Boilerplate' })
      );

      const results = registry.search('boilerplate');
      expect(results).toHaveLength(1);
    });

    it('should search by tags', () => {
      registry.register(
        createTestExample({ key: 'test-1', tags: ['billing', 'payments'] })
      );

      const results = registry.search('payments');
      expect(results).toHaveLength(1);
    });

    it('should return all when query is empty', () => {
      registry.register(createTestExample({ key: 'test-1' }));
      registry.register(createTestExample({ key: 'test-2' }));

      expect(registry.search('')).toHaveLength(2);
      expect(registry.search('  ')).toHaveLength(2);
    });
  });

  describe('groupByKind', () => {
    it('should group examples by kind', () => {
      registry.register(createTestExample({ key: 'test-1', kind: 'template' }));
      registry.register(createTestExample({ key: 'test-2', kind: 'workflow' }));
      registry.register(createTestExample({ key: 'test-3', kind: 'template' }));

      const grouped = registry.groupByKind();
      expect(grouped.get('template')).toHaveLength(2);
      expect(grouped.get('workflow')).toHaveLength(1);
    });
  });
});
