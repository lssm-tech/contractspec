import { describe, expect, it } from 'bun:test';
import {
  validateLayoutSlots,
  validateBundleNodeKinds,
} from './validate-bundle';
import type { SurfaceSpec } from './types';

describe('validateLayoutSlots', () => {
  it('passes when all layout slots are declared', () => {
    const surface: SurfaceSpec = {
      surfaceId: 's',
      kind: 'workbench',
      title: 'S',
      slots: [
        { slotId: 'primary', role: 'primary', accepts: [], cardinality: 'one' },
        {
          slotId: 'secondary',
          role: 'secondary',
          accepts: [],
          cardinality: 'one',
        },
      ],
      layouts: [
        {
          layoutId: 'l',
          root: {
            type: 'panel-group',
            direction: 'horizontal',
            children: [
              { type: 'slot', slotId: 'primary' },
              { type: 'slot', slotId: 'secondary' },
            ],
          },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance: 'x'.repeat(10),
          density: 'x'.repeat(10),
          dataDepth: 'x'.repeat(10),
          control: 'x'.repeat(10),
          media: 'x'.repeat(10),
          pace: 'x'.repeat(10),
          narrative: 'x'.repeat(10),
        },
      },
    };
    expect(() => validateLayoutSlots(surface)).not.toThrow();
  });

  it('throws when layout references undeclared slot', () => {
    const surface: SurfaceSpec = {
      surfaceId: 's',
      kind: 'workbench',
      title: 'S',
      slots: [
        { slotId: 'primary', role: 'primary', accepts: [], cardinality: 'one' },
      ],
      layouts: [
        {
          layoutId: 'l',
          root: { type: 'slot', slotId: 'missing' },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance: 'x'.repeat(10),
          density: 'x'.repeat(10),
          dataDepth: 'x'.repeat(10),
          control: 'x'.repeat(10),
          media: 'x'.repeat(10),
          pace: 'x'.repeat(10),
          narrative: 'x'.repeat(10),
        },
      },
    };
    expect(() => validateLayoutSlots(surface)).toThrow(/undeclared slot/);
  });
});

describe('validateBundleNodeKinds', () => {
  it('returns warnings for node kinds without dedicated renderers', () => {
    const surface: SurfaceSpec = {
      surfaceId: 's',
      kind: 'workbench',
      title: 'S',
      slots: [
        {
          slotId: 'primary',
          role: 'primary',
          accepts: ['entity-section', 'metric-strip'],
          cardinality: 'many',
        },
      ],
      layouts: [
        {
          layoutId: 'l',
          root: { type: 'slot', slotId: 'primary' },
        },
      ],
      data: [],
      verification: {
        dimensions: {
          guidance: 'x'.repeat(10),
          density: 'x'.repeat(10),
          dataDepth: 'x'.repeat(10),
          control: 'x'.repeat(10),
          media: 'x'.repeat(10),
          pace: 'x'.repeat(10),
          narrative: 'x'.repeat(10),
        },
      },
    };
    const result = validateBundleNodeKinds(surface);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings.some((w) => w.includes('metric-strip'))).toBe(true);
  });
});
