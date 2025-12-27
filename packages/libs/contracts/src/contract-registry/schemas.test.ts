import { describe, expect, it } from 'bun:test';
import {
  ContractRegistryItemTypeSchema,
  ContractRegistryFileSchema,
  ContractRegistryItemSchema,
  ContractRegistryManifestSchema,
} from './schemas';
import type { ContractRegistryItem, ContractRegistryManifest } from './types';

describe('ContractRegistryItemTypeSchema', () => {
  it('should accept valid item types', () => {
    const validTypes = [
      'contractspec:operation',
      'contractspec:event',
      'contractspec:presentation',
      'contractspec:form',
      'contractspec:feature',
      'contractspec:workflow',
      'contractspec:template',
      'contractspec:integration',
      'contractspec:data-view',
      'contractspec:migration',
      'contractspec:telemetry',
      'contractspec:experiment',
      'contractspec:app-config',
      'contractspec:knowledge',
    ] as const;

    for (const type of validTypes) {
      expect(ContractRegistryItemTypeSchema.parse(type)).toBe(type);
    }
  });

  it('should reject invalid item types', () => {
    expect(() => ContractRegistryItemTypeSchema.parse('invalid')).toThrow();
    expect(() => ContractRegistryItemTypeSchema.parse('')).toThrow();
    expect(() => ContractRegistryItemTypeSchema.parse('operation')).toThrow();
  });
});

describe('ContractRegistryFileSchema', () => {
  it('should accept valid file', () => {
    const file = {
      path: 'src/operations/user-create.ts',
      type: 'contractspec:spec',
    };

    const result = ContractRegistryFileSchema.parse(file);
    expect(result.path).toBe('src/operations/user-create.ts');
    expect(result.type).toBe('contractspec:spec');
  });

  it('should accept file with content', () => {
    const file = {
      path: 'inline.ts',
      type: 'inline',
      content: 'export const spec = {};',
    };

    const result = ContractRegistryFileSchema.parse(file);
    expect(result.content).toBe('export const spec = {};');
  });

  it('should reject empty path', () => {
    expect(() => ContractRegistryFileSchema.parse({
      path: '',
      type: 'spec',
    })).toThrow();
  });

  it('should reject empty type', () => {
    expect(() => ContractRegistryFileSchema.parse({
      path: 'file.ts',
      type: '',
    })).toThrow();
  });
});

describe('ContractRegistryItemSchema', () => {
  const createValidItem = (overrides?: Partial<ContractRegistryItem>) => ({
    key: 'user.create',
    type: 'contractspec:operation',
    version: 1,
    title: 'Create User',
    description: 'Creates a new user in the system',
    meta: {
      stability: 'stable',
      owners: ['platform.core'],
      tags: ['users', 'auth'],
    },
    files: [
      { path: 'src/operations/user-create.ts', type: 'spec' },
    ],
    ...overrides,
  });

  it('should accept valid item', () => {
    const item = createValidItem();
    const result = ContractRegistryItemSchema.parse(item);

    expect(result.key).toBe('user.create');
    expect(result.type).toBe('contractspec:operation');
    expect(result.version).toBe(1);
    expect(result.meta.stability).toBe('stable');
  });

  it('should accept all stability values', () => {
    const stabilities = ['idea', 'in_creation', 'experimental', 'beta', 'stable', 'deprecated'] as const;
    
    for (const stability of stabilities) {
      const item = createValidItem({
        meta: { stability, owners: [], tags: [] },
      });
      const result = ContractRegistryItemSchema.parse(item);
      expect(result.meta.stability).toBe(stability);
    }
  });

  it('should accept optional dependencies', () => {
    const item = createValidItem({
      dependencies: ['lodash', 'zod'],
      registryDependencies: ['ui/button', 'ui/input'],
    });
    const result = ContractRegistryItemSchema.parse(item);

    expect(result.dependencies).toEqual(['lodash', 'zod']);
    expect(result.registryDependencies).toEqual(['ui/button', 'ui/input']);
  });

  it('should accept optional schema', () => {
    const item = createValidItem({
      schema: {
        input: { type: 'object', properties: {} },
        output: { type: 'object', properties: {} },
      },
    });
    const result = ContractRegistryItemSchema.parse(item);

    expect(result.schema).toBeDefined();
    expect(result.schema?.input).toBeDefined();
    expect(result.schema?.output).toBeDefined();
  });

  it('should require at least one file', () => {
    const item = createValidItem({ files: [] });
    expect(() => ContractRegistryItemSchema.parse(item)).toThrow();
  });

  it('should reject empty key', () => {
    const item = createValidItem({ key: '' });
    expect(() => ContractRegistryItemSchema.parse(item)).toThrow();
  });

  it('should reject negative version', () => {
    const item = createValidItem({ version: -1 });
    expect(() => ContractRegistryItemSchema.parse(item)).toThrow();
  });

  it('should reject non-integer version', () => {
    const item = createValidItem({ version: 1.5 });
    expect(() => ContractRegistryItemSchema.parse(item)).toThrow();
  });

  it('should default empty arrays for owners and tags', () => {
    const item = createValidItem({
      meta: { stability: 'stable' } as any,
    });
    const result = ContractRegistryItemSchema.parse(item);

    expect(result.meta.owners).toEqual([]);
    expect(result.meta.tags).toEqual([]);
  });
});

describe('ContractRegistryManifestSchema', () => {
  const createValidManifest = (overrides?: Partial<ContractRegistryManifest>) => ({
    name: 'my-registry',
    items: [
      {
        key: 'test.item',
        type: 'contractspec:operation',
        version: 1,
        title: 'Test Item',
        description: 'Test description',
        meta: { stability: 'stable', owners: [], tags: [] },
        files: [{ path: 'test.ts', type: 'spec' }],
      },
    ],
    ...overrides,
  });

  it('should accept valid manifest', () => {
    const manifest = createValidManifest();
    const result = ContractRegistryManifestSchema.parse(manifest);

    expect(result.name).toBe('my-registry');
    expect(result.items).toHaveLength(1);
  });

  it('should accept optional $schema', () => {
    const manifest = createValidManifest({
      $schema: 'https://contractspec.io/schemas/registry.json',
    });
    const result = ContractRegistryManifestSchema.parse(manifest);

    expect(result.$schema).toBe('https://contractspec.io/schemas/registry.json');
  });

  it('should accept optional homepage', () => {
    const manifest = createValidManifest({
      homepage: 'https://example.com',
    });
    const result = ContractRegistryManifestSchema.parse(manifest);

    expect(result.homepage).toBe('https://example.com');
  });

  it('should accept empty items array', () => {
    const manifest = createValidManifest({ items: [] });
    const result = ContractRegistryManifestSchema.parse(manifest);

    expect(result.items).toEqual([]);
  });

  it('should reject empty name', () => {
    const manifest = createValidManifest({ name: '' });
    expect(() => ContractRegistryManifestSchema.parse(manifest)).toThrow();
  });

  it('should validate nested items', () => {
    const manifest = createValidManifest({
      items: [
        {
          key: '',  // Invalid: empty key
          type: 'contractspec:operation',
          version: 1,
          title: 'Bad',
          description: 'Bad item',
          meta: { stability: 'stable', owners: [], tags: [] },
          files: [{ path: 'test.ts', type: 'spec' }],
        } as any,
      ],
    });
    expect(() => ContractRegistryManifestSchema.parse(manifest)).toThrow();
  });
});
