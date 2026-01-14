import { describe, expect, it } from 'bun:test';
import { validateFeatureRefs } from './validation';
import type { FeatureScanResult } from '@contractspec/module.workspace';
import type { SpecInventory } from '../integrity';

describe('validateFeatureRefs', () => {
  const mockInventory: SpecInventory = {
    operations: new Map([
      ['op.a.v1', {}],
    ]) as unknown as SpecInventory['operations'],
    events: new Map([['event.a.v1', {}]]) as unknown as SpecInventory['events'],
    presentations: new Map() as unknown as SpecInventory['presentations'],
    experiments: new Map() as unknown as SpecInventory['experiments'],
    specs: [],
  } as unknown as SpecInventory;

  const emptyFeature: FeatureScanResult = {
    filePath: 'feature.ts',
    operations: [],
    events: [],
    presentations: [],
    experiments: [],
  } as unknown as FeatureScanResult;

  it('reports no errors for valid refs', () => {
    const feature: FeatureScanResult = {
      ...emptyFeature,
      operations: [{ key: 'op.a', version: '1' }],
      events: [{ key: 'event.a', version: '1' }],
    };

    const errors = validateFeatureRefs(feature, mockInventory);
    expect(errors).toHaveLength(0);
  });

  it('reports errors for missing refs', () => {
    const feature: FeatureScanResult = {
      ...emptyFeature,
      operations: [{ key: 'op.missing', version: '1' }],
    };

    const errors = validateFeatureRefs(feature, mockInventory);
    expect(errors).toHaveLength(1);
    expect(errors[0]?.message).toContain('Operation op.missing.v1 not found');
  });
});
