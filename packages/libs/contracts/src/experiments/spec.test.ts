import { describe, expect, it } from 'vitest';
import {
  ExperimentRegistry,
  type ExperimentSpec,
} from './spec';
import { StabilityEnum } from '../ownership';

const sampleExperiment = (version: number): ExperimentSpec => ({
  meta: {
    name: 'sigil.onboarding.split_form',
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
    { id: 'control', name: 'Control' },
    { id: 'variant_a', name: 'Variant A', weight: 2 },
  ],
  allocation: { type: 'random', salt: 'sigil' },
});

describe('ExperimentRegistry', () => {
  it('registers and retrieves experiments', () => {
    const registry = new ExperimentRegistry();
    const spec = sampleExperiment(1);
    registry.register(spec);
    expect(registry.get('sigil.onboarding.split_form', 1)).toEqual(spec);
  });

  it('returns latest version when version omitted', () => {
    const registry = new ExperimentRegistry();
    registry.register(sampleExperiment(1));
    const latest = sampleExperiment(2);
    registry.register(latest);
    expect(registry.get('sigil.onboarding.split_form')).toEqual(latest);
  });

  it('throws on duplicate registration', () => {
    const registry = new ExperimentRegistry();
    const spec = sampleExperiment(1);
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(/Duplicate experiment/);
  });
});

