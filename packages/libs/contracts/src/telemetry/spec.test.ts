import { describe, expect, it } from 'bun:test';
import {
  TelemetryRegistry,
  type TelemetrySpec,
  type TelemetryPrivacyLevel,
} from './spec';
import { StabilityEnum } from '../ownership';

const makeSpec = (
  key: string,
  version: number,
  privacy: TelemetryPrivacyLevel
): TelemetrySpec => ({
  meta: {
    key,
    version,
    title: `${key} telemetry`,
    description: 'Sample telemetry spec',
    domain: 'test',
    owners: ['@team.telemetry'],
    tags: ['telemetry'],
    stability: StabilityEnum.Experimental,
  },
  config: {
    defaultRetentionDays: 30,
    defaultSamplingRate: 1,
  },
  events: [
    {
      key: `${key}.event_a`,
      version: 1,
      semantics: { what: 'Something happened' },
      properties: {
        userId: { type: 'string', pii: true },
        status: { type: 'string' },
      },
      privacy,
    },
  ],
});

describe('TelemetryRegistry', () => {
  it('registers and retrieves specs', () => {
    const registry = new TelemetryRegistry();
    const spec = makeSpec('sigil.core', 1, 'internal');
    registry.register(spec);

    expect(registry.get('sigil.core', 1)).toEqual(spec);
    expect(registry.list()).toEqual([spec]);
  });

  it('returns latest version when version omitted', () => {
    const registry = new TelemetryRegistry();
    registry.register(makeSpec('sigil.core', 1, 'internal'));
    const latestSpec = makeSpec('sigil.core', 2, 'public');
    registry.register(latestSpec);

    expect(registry.get('sigil.core')).toEqual(latestSpec);
  });

  it('finds event definitions', () => {
    const registry = new TelemetryRegistry();
    const spec = makeSpec('sigil.core', 1, 'internal');
    registry.register(spec);

    const event = registry.findEventDef('sigil.core.event_a');
    expect(event?.privacy).toBe('internal');
  });

  it('throws on duplicate registration', () => {
    const registry = new TelemetryRegistry();
    const spec = makeSpec('sigil.core', 1, 'internal');
    registry.register(spec);
    expect(() => registry.register(spec)).toThrowError(
      /Duplicate TelemetrySpec/
    );
  });
});
