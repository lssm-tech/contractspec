import { describe, expect, it } from 'bun:test';
import { generateTelemetrySpec } from './telemetry';
import type { TelemetrySpecData } from '../types/spec-types';

describe('generateTelemetrySpec', () => {
  const baseData: TelemetrySpecData = {
    name: 'test.telemetry',
    version: '1',
    description: 'Test telemetry',
    owners: ['team-a'],
    tags: ['test'],
    stability: 'stable',
    domain: 'test-domain',
    events: [],
  };

  it('generates a telemetry spec', () => {
    const code = generateTelemetrySpec(baseData);
    expect(code).toContain(
      "import type { TelemetrySpec } from '@contractspec/lib.contracts-spec/telemetry';"
    );
    expect(code).toContain(
      'export const TelemetryTelemetry: TelemetrySpec = {'
    );
    expect(code).toContain("    key: 'test.telemetry',");
  });

  it('renders providers', () => {
    const data: TelemetrySpecData = {
      ...baseData,
      providers: [{ type: 'posthog', config: '{ apiKey: "foo" }' }],
    };
    const code = generateTelemetrySpec(data);
    expect(code).toContain('providers: [');
    expect(code).toContain("type: 'posthog'");
    expect(code).toContain('config: { apiKey: "foo" }');
  });

  it('renders events with properties', () => {
    const data: TelemetrySpecData = {
      ...baseData,
      events: [
        {
          name: 'event.a',
          version: '1',
          what: 'Something happened',
          who: 'User',
          why: 'To track usage',
          privacy: 'public',
          properties: [
            { name: 'prop1', type: 'string', required: true },
            { name: 'prop2', type: 'number', pii: true },
          ],
        },
      ],
    };
    const code = generateTelemetrySpec(data);
    expect(code).toContain("name: 'event.a'");
    expect(code).toContain("what: 'Something happened'");
    expect(code).toContain("privacy: 'public'");
    expect(code).toContain("'prop1': {");
    expect(code).toContain("type: 'string'");
    expect(code).toContain('required: true');
    expect(code).toContain('pii: true');
  });

  it('renders anomaly rules', () => {
    const data: TelemetrySpecData = {
      ...baseData,
      events: [
        {
          name: 'event.b',
          version: '1',
          what: 'Metric',
          privacy: 'internal',
          properties: [],
          anomalyEnabled: true,
          anomalyMinimumSample: 100,
          anomalyRules: [{ metric: 'm1', min: 10, max: 20 }],
          anomalyActions: ['alert'],
        },
      ],
    };
    const code = generateTelemetrySpec(data);
    expect(code).toContain('anomalyDetection: {');
    expect(code).toContain('minimumSample: 100');
    expect(code).toContain("metric: 'm1'");
    expect(code).toContain('min: 10');
    expect(code).toContain('max: 20');
    expect(code).toContain("actions: ['alert']");
  });
});
