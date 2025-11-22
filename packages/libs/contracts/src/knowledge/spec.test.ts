import { describe, expect, it } from 'vitest';
import { KnowledgeSpaceRegistry } from './spec';
import type { KnowledgeSpaceSpec, KnowledgeCategory } from './spec';

const makeSpec = (
  overrides: Partial<KnowledgeSpaceSpec> = {}
): KnowledgeSpaceSpec => ({
  meta: {
    key: 'product-canon',
    version: 1,
    category: 'canonical',
    displayName: 'Product Canon',
    title: 'Product Canon',
    description: 'Authoritative product knowledge base.',
    domain: 'product',
    owners: ['platform.sigil'],
    tags: ['knowledge'],
    stability: 'stable',
  },
  retention: {
    ttlDays: null,
  },
  access: {
    automationWritable: false,
    trustLevel: 'high',
  },
  ...overrides,
});

describe('KnowledgeSpaceRegistry', () => {
  it('registers and retrieves specs', () => {
    const registry = new KnowledgeSpaceRegistry();
    const spec = makeSpec();

    registry.register(spec);

    expect(registry.get('product-canon', 1)).toEqual(spec);
    expect(registry.get('product-canon')).toEqual(spec);
    expect(registry.list()).toEqual([spec]);
  });

  it('throws when registering duplicate specs', () => {
    const registry = new KnowledgeSpaceRegistry();
    const spec = makeSpec();

    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(
      /Duplicate KnowledgeSpaceSpec/
    );
  });

  it.each<KnowledgeCategory>([
    'canonical',
    'operational',
    'external',
    'ephemeral',
  ])('filters by category (%s)', (category) => {
    const registry = new KnowledgeSpaceRegistry();
    const spec = makeSpec({
      meta: {
        ...makeSpec().meta,
        key: `space-${category}`,
        category,
      },
    });

    registry.register(spec);

    expect(registry.getByCategory(category)).toEqual([spec]);
  });
});
