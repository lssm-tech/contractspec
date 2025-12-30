import { describe, expect, it } from 'bun:test';
import { ExperimentRegistry, type ExperimentSpec } from './spec';
import { StabilityEnum } from '../ownership';

const sampleExperiment = (version: string): ExperimentSpec => ({
  meta: {
    key: 'sigil.onboarding.split_form',
    version,
    title: 'Split onboarding form',
    description: 'Test simplified onboarding form',
    domain: 'onboarding',
    owners: ['@team.onboarding'],
    tags: ['experiment'],
    stability: StabilityEnum.Experimental,
  },
  controlVariant: 'control',
  variants: [
    { id: 'control', key: 'Control' },
    { id: 'variant_a', key: 'Variant A', weight: 2 },
  ],
  allocation: { type: 'random', salt: 'sigil' },
});

describe('ExperimentRegistry', () => {
  it('registers and retrieves experiments', () => {
    const registry = new ExperimentRegistry();
    const spec = sampleExperiment('1.0.0');
    registry.register(spec);
    expect(registry.get('sigil.onboarding.split_form', '1.0.0')).toEqual(spec);
  });

  it('returns latest version when version omitted', () => {
    const registry = new ExperimentRegistry();
    registry.register(sampleExperiment('1.0.0'));
    const latest = sampleExperiment('2.0.0');
    registry.register(latest);
    expect(registry.get('sigil.onboarding.split_form')).toEqual(latest);
  });

  it('throws on duplicate registration', () => {
    const registry = new ExperimentRegistry();
    const spec = sampleExperiment('1.0.0');
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(/Duplicate contract/);
  });
});
