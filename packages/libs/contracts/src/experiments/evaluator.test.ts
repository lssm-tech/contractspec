import { describe, expect, it } from 'vitest';
import { ExperimentRegistry } from './spec';
import { ExperimentEvaluator } from './evaluator';
import { StabilityEnum } from '../ownership';

const registry = new ExperimentRegistry();
registry.register({
  meta: {
    name: 'sigil.experiment.random',
    version: 1,
    title: 'Random allocation',
    description: 'Simple random experiment',
    domain: 'core',
    owners: ['@team.experiment'],
    tags: ['experiment'],
    stability: StabilityEnum.Experimental,
  },
  controlVariant: 'control',
  variants: [
    { id: 'control', name: 'Control', weight: 1 },
    { id: 'variant', name: 'Variant', weight: 1 },
  ],
  allocation: { type: 'random', salt: 'sigil' },
});

registry.register({
  meta: {
    name: 'sigil.experiment.sticky',
    version: 1,
    title: 'Sticky allocation',
    description: 'Sticky assignment by userId',
    domain: 'core',
    owners: ['@team.experiment'],
    tags: ['experiment'],
    stability: StabilityEnum.Experimental,
  },
  controlVariant: 'control',
  variants: [
    { id: 'control', name: 'Control', weight: 1 },
    { id: 'variant', name: 'Variant', weight: 1 },
  ],
  allocation: { type: 'sticky', attribute: 'userId', salt: 'sigil' },
});

registry.register({
  meta: {
    name: 'sigil.experiment.targeted',
    version: 1,
    title: 'Targeted allocation',
    description: 'Assign variant when rule matches',
    domain: 'core',
    owners: ['@team.experiment'],
    tags: ['experiment'],
    stability: StabilityEnum.Experimental,
  },
  controlVariant: 'control',
  variants: [
    { id: 'control', name: 'Control' },
    { id: 'vip', name: 'VIP' },
  ],
  allocation: {
    type: 'targeted',
    rules: [
      {
        variantId: 'vip',
        expression: "context.attributes?.segment === 'vip'",
      },
    ],
    fallback: 'control',
  },
});

describe('ExperimentEvaluator', () => {
  const evaluator = new ExperimentEvaluator({ registry });

  it('returns random variant', async () => {
    const result = await evaluator.chooseVariant({
      experiment: 'sigil.experiment.random',
      sessionId: 'session-1',
    });
    expect(result?.variant.id).toMatch(/control|variant/);
  });

  it('returns sticky variant consistently', async () => {
    const first = await evaluator.chooseVariant({
      experiment: 'sigil.experiment.sticky',
      userId: 'user-123',
    });
    const second = await evaluator.chooseVariant({
      experiment: 'sigil.experiment.sticky',
      userId: 'user-123',
    });
    expect(first?.variant.id).toBe(second?.variant.id);
  });

  it('applies targeting rules', async () => {
    const vipResult = await evaluator.chooseVariant({
      experiment: 'sigil.experiment.targeted',
      attributes: { segment: 'vip' },
    });
    expect(vipResult?.variant.id).toBe('vip');

    const controlResult = await evaluator.chooseVariant({
      experiment: 'sigil.experiment.targeted',
      attributes: { segment: 'default' },
    });
    expect(controlResult?.variant.id).toBe('control');
  });
});

