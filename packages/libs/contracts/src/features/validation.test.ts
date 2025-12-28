import { describe, expect, it } from 'bun:test';
import { validateFeatureTargetsV2 } from './validation';
import type { FeatureModuleSpec } from './types';
import type { PresentationSpec } from '../presentations/presentations';
import { StabilityEnum } from '../ownership';

describe('validateFeatureTargetsV2', () => {
  const createFeature = (
    overrides?: Partial<FeatureModuleSpec>
  ): FeatureModuleSpec => ({
    meta: {
      key: 'test.feature',
      version: 1,
      title: 'Test Feature',
      description: 'A test feature',
      stability: StabilityEnum.Stable,
      owners: ['platform.core'],
      tags: ['test'],
    },
    ...overrides,
  });

  const createDescriptor = (
    overrides?: Partial<PresentationSpec>
  ): PresentationSpec => ({
    meta: {
      key: 'test.presentation',
      version: 1,
      title: 'Test Presentation',
      description: 'A test presentation',
      stability: 'stable',
      owners: [],
      tags: [],
      domain: '',
      goal: 'Test goal',
      context: 'Test context',
    },
    targets: ['react', 'markdown'],
    source: {
      type: 'component',
      componentKey: 'TestComponent',
      framework: 'react',
    },
    ...overrides,
  });

  it('should return true when no presentationsTargets defined', () => {
    const feature = createFeature();
    expect(validateFeatureTargetsV2(feature, [])).toBe(true);
  });

  it('should return true when presentationsTargets is empty', () => {
    const feature = createFeature({ presentationsTargets: [] });
    expect(validateFeatureTargetsV2(feature, [])).toBe(true);
  });

  it('should throw when descriptor not found', () => {
    const feature = createFeature({
      presentationsTargets: [
        { key: 'missing.presentation', version: 1, targets: ['react'] },
      ],
    });

    expect(() => validateFeatureTargetsV2(feature, [])).toThrow(
      /V2 descriptor not found missing.presentation.v1/
    );
  });

  it('should throw when descriptor missing required target', () => {
    const feature = createFeature({
      presentationsTargets: [
        { key: 'test.presentation', version: 1, targets: ['application/xml'] },
      ],
    });

    const descriptors = [createDescriptor({ targets: ['react', 'markdown'] })];

    expect(() => validateFeatureTargetsV2(feature, descriptors)).toThrow(
      /Descriptor test.presentation.v1 missing target application\/xml/
    );
  });

  it('should throw when any required target is missing', () => {
    const feature = createFeature({
      presentationsTargets: [
        {
          key: 'test.presentation',
          version: 1,
          targets: ['react', 'application/xml'],
        },
      ],
    });

    const descriptors = [createDescriptor({ targets: ['react', 'markdown'] })];

    expect(() => validateFeatureTargetsV2(feature, descriptors)).toThrow(
      /missing target application\/xml/
    );
  });

  it('should return true when all targets are present', () => {
    const feature = createFeature({
      presentationsTargets: [
        {
          key: 'test.presentation',
          version: 1,
          targets: ['react', 'markdown'],
        },
      ],
    });

    const descriptors = [
      createDescriptor({ targets: ['react', 'markdown', 'application/json'] }),
    ];

    expect(validateFeatureTargetsV2(feature, descriptors)).toBe(true);
  });

  it('should validate multiple presentation targets', () => {
    const feature = createFeature({
      presentationsTargets: [
        { key: 'pres.one', version: 1, targets: ['react'] },
        { key: 'pres.two', version: 1, targets: ['markdown'] },
      ],
    });

    const descriptors = [
      createDescriptor({
        meta: { ...createDescriptor().meta, key: 'pres.one' },
        targets: ['react'],
      }),
      createDescriptor({
        meta: { ...createDescriptor().meta, key: 'pres.two' },
        targets: ['markdown'],
      }),
    ];

    expect(validateFeatureTargetsV2(feature, descriptors)).toBe(true);
  });

  it('should match on both key and version', () => {
    const feature = createFeature({
      presentationsTargets: [
        { key: 'test.presentation', version: 2, targets: ['react'] },
      ],
    });

    const descriptors = [
      createDescriptor(), // version 1
    ];

    expect(() => validateFeatureTargetsV2(feature, descriptors)).toThrow(
      /V2 descriptor not found test.presentation.v2/
    );
  });
});
