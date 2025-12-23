import { describe, expect, it } from 'bun:test';
import { TelemetryAnomalyMonitor } from './anomaly';
import type { TelemetryDispatch } from './tracker';
import type { TelemetrySpec } from './spec';
import { StabilityEnum } from '../ownership';

const makeDispatch = (value: number): TelemetryDispatch => {
  const spec: TelemetrySpec = {
    meta: {
      name: 'sigil.telemetry',
      version: 1,
      title: 'Sample telemetry',
      description: 'Sample telemetry',
      domain: 'sigil',
      owners: ['@team.telemetry'],
      tags: ['telemetry'],
      stability: StabilityEnum.Experimental,
    },
    events: [
      {
        name: 'sigil.telemetry.workflow_step',
        version: 1,
        semantics: { what: 'Workflow step executed' },
        properties: {
          durationMs: { type: 'number' },
        },
        privacy: 'internal',
        anomalyDetection: {
          enabled: true,
          thresholds: [{ metric: 'durationMs', max: 1000 }],
          minimumSample: 1,
        },
      },
    ],
  };

  return {
    id: 'event-id',
    name: 'sigil.telemetry.workflow_step',
    version: 1,
    occurredAt: new Date().toISOString(),
    properties: { durationMs: value },
    privacy: 'internal',
    context: {},
    tags: [],
    spec,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    definition: spec.events[0]!,
  };
};

describe('TelemetryAnomalyMonitor', () => {
  it('emits anomalies when value exceeds threshold', () => {
    const events: number[] = [];
    const monitor = new TelemetryAnomalyMonitor({
      onAnomaly: (event) => {
        events.push(event.value ?? 0);
      },
    });

    monitor.observe(makeDispatch(500));
    monitor.observe(makeDispatch(2000));

    expect(events).toEqual([2000]);
  });
});
