import { describe, expect, it } from 'bun:test';
import { generateExperimentSpec } from './experiment';
import type { ExperimentSpecData } from '../types/spec-types';

describe('generateExperimentSpec', () => {
  const baseData: ExperimentSpecData = {
    name: 'test.exp',
    version: '1',
    description: 'Test experiment',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    domain: 'test-domain',
    controlVariant: 'control',
    variants: [
      { id: 'control', name: 'Control' },
      { id: 'treatment', name: 'Treatment' },
    ],
    allocation: { type: 'random', salt: 'salty' },
  };

  it('generates an experiment spec', () => {
    const code = generateExperimentSpec(baseData);
    expect(code).toContain(
      "import type { ExperimentSpec } from '@contractspec/lib.contracts/experiments'"
    );
    expect(code).toContain(
      'export const Test_expExperiment: ExperimentSpec = {'
    );
    expect(code).toContain("controlVariant: 'control'");
    expect(code).toContain("type: 'random'");
  });

  it('generates variants with overrides', () => {
    const data: ExperimentSpecData = {
      ...baseData,
      variants: [
        {
          id: 'v1',
          name: 'V1',
          overrides: [{ type: 'theme', target: 'dark-theme' }],
        },
      ],
    };
    const code = generateExperimentSpec(data);
    expect(code).toContain('overrides: [');
    expect(code).toContain("type: 'theme'");
    expect(code).toContain("target: 'dark-theme'");
  });

  it('supports sticky allocation', () => {
    const data: ExperimentSpecData = {
      ...baseData,
      allocation: { type: 'sticky', attribute: 'userId' },
    };
    const code = generateExperimentSpec(data);
    expect(code).toContain("type: 'sticky'");
    expect(code).toContain("attribute: 'userId'");
  });

  it('supports targeted allocation', () => {
    const data: ExperimentSpecData = {
      ...baseData,
      allocation: {
        type: 'targeted',
        rules: [{ variantId: 'v1', percentage: 50 }],
      },
    };
    const code = generateExperimentSpec(data);
    expect(code).toContain("type: 'targeted'");
    expect(code).toContain("variantId: 'v1'");
    expect(code).toContain('percentage: 50');
  });

  it('includes success metrics', () => {
    const data: ExperimentSpecData = {
      ...baseData,
      successMetrics: [
        {
          name: 'conversion',
          eventName: 'event.signup',
          eventVersion: '1',
          aggregation: 'count',
        },
      ],
    };
    const code = generateExperimentSpec(data);
    expect(code).toContain("name: 'conversion'");
    expect(code).toContain(
      "telemetryEvent: { name: 'event.signup', version: 1 }"
    );
  });
});
