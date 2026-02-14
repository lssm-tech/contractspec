import { describe, expect, it } from 'bun:test';
import { ProductIntentRegistry } from './registry';
import { StabilityEnum } from '../ownership';
import type { ProductIntentSpec } from './spec';

const baseMeta = {
  key: 'product-intent.activation',
  version: '1.0.0',
  description: 'Activation opportunity',
  stability: StabilityEnum.Experimental,
  owners: ['platform.core'],
  tags: ['product-intent'],
};

const makeSpec = (id: string): ProductIntentSpec => ({
  id,
  meta: baseMeta,
  question: 'How do we improve activation?',
  insights: { insights: [] },
});

describe('ProductIntentRegistry', () => {
  it('registers and retrieves by key/version', () => {
    const registry = new ProductIntentRegistry();
    const spec = makeSpec('run-1');

    registry.register(spec);
    const found = registry.get(baseMeta.key, baseMeta.version);

    expect(found?.id).toBe('run-1');
  });

  it('prevents duplicate registrations for the same key/version', () => {
    const registry = new ProductIntentRegistry();
    const spec = makeSpec('run-1');

    registry.register(spec);
    expect(() => registry.register(spec)).toThrow();
  });

  it('supports upserts and lookup by runtime id', () => {
    const registry = new ProductIntentRegistry();
    const spec1 = makeSpec('run-1');
    const spec2 = makeSpec('run-2');

    registry.set(spec1);
    registry.set(spec2);

    expect(registry.getById('run-2')?.id).toBe('run-2');
    expect(registry.get(baseMeta.key, baseMeta.version)?.id).toBe('run-2');
  });

  it('deletes entries by runtime id', () => {
    const registry = new ProductIntentRegistry();
    const spec = makeSpec('run-1');

    registry.register(spec);
    const deleted = registry.delete('run-1');

    expect(deleted).toBe(true);
    expect(registry.count()).toBe(0);
  });
});
