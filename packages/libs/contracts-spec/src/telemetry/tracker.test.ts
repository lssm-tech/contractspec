import { describe, expect, it, vi } from 'bun:test';
import { TelemetryRegistry, type TelemetrySpec } from './spec';
import { TelemetryTracker, type RuntimeTelemetryProvider } from './tracker';
import { TelemetryAnomalyMonitor, type TelemetryAnomalyEvent } from './anomaly';
import { StabilityEnum } from '../ownership';

const telemetrySpec: TelemetrySpec = {
  meta: {
    key: 'sigil.telemetry',
    version: '1.0.0',
    title: 'Sigil telemetry',
    description: 'Telemetry events for sigil',
    domain: 'sigil',
    owners: ['@team.telemetry'],
    tags: ['telemetry'],
    stability: StabilityEnum.Experimental,
  },
  config: {
    defaultRetentionDays: 30,
    defaultSamplingRate: 1,
    anomalyDetection: { enabled: true, checkIntervalMs: 1000 },
  },
  events: [
    {
      key: 'sigil.telemetry.workflow_step',
      version: '1.0.0',
      semantics: { what: 'Workflow step executed' },
      properties: {
        workflow: { type: 'string', required: true },
        step: { type: 'string', required: true },
        durationMs: { type: 'number' },
        userId: { type: 'string', pii: true, redact: true },
      },
      privacy: 'internal',
      sampling: { rate: 1 },
      anomalyDetection: {
        enabled: true,
        thresholds: [{ metric: 'durationMs', max: 1500 }],
        actions: ['alert'],
        minimumSample: 1,
      },
    },
  ],
};

const createRegistry = () => new TelemetryRegistry().register(telemetrySpec);

const createProvider = () => {
  const send = vi.fn<RuntimeTelemetryProvider['send']>();
  const provider: RuntimeTelemetryProvider = {
    id: 'memory',
    send,
  };
  return { provider, send };
};

describe('TelemetryTracker', () => {
  it('dispatches events to providers with redacted fields', async () => {
    const registry = createRegistry();
    const { provider, send } = createProvider();
    const tracker = new TelemetryTracker({
      registry,
      providers: [provider],
      random: () => 0.1,
      clock: () => new Date('2024-01-01T00:00:00.000Z'),
    });

    const tracked = await tracker.track(
      'sigil.telemetry.workflow_step',
      '1.0.0',
      { workflow: 'primary', step: '3', durationMs: 1200, userId: 'abc' },
      { tenantId: 'tenant-1', actor: 'user' }
    );

    expect(tracked).toBe(true);
    expect(send).toHaveBeenCalledTimes(1);
    const firstCall = send.mock.calls[0];
    if (!firstCall) {
      throw new Error('Expected telemetry provider to be called at least once');
    }
    const [dispatch] = firstCall;
    if (!dispatch) {
      throw new Error('Expected telemetry dispatch payload');
    }
    expect(dispatch.properties.userId).toBe('REDACTED');
    expect(dispatch.properties.workflow).toBe('primary');
  });

  it('respects sampling rate', async () => {
    const registry = createRegistry();
    const { provider, send } = createProvider();
    const tracker = new TelemetryTracker({
      registry,
      providers: [provider],
      random: () => 0.9,
    });

    const tracked = await tracker.track(
      'sigil.telemetry.workflow_step',
      '1.0.0',
      { workflow: 'primary', step: '3', durationMs: 1200 },
      {}
    );
    expect(tracked).toBe(true);
    expect(send).toHaveBeenCalled();
  });

  it('invokes anomaly monitor when thresholds exceeded', async () => {
    const registry = createRegistry();
    const { provider } = createProvider();
    const onAnomaly = vi.fn<(event: TelemetryAnomalyEvent) => void>();
    const monitor = new TelemetryAnomalyMonitor({ onAnomaly });
    const tracker = new TelemetryTracker({
      registry,
      providers: [provider],
      anomalyMonitor: monitor,
      random: () => 0,
    });

    await tracker.track(
      'sigil.telemetry.workflow_step',
      '1.0.0',
      { workflow: 'primary', step: '3', durationMs: 3000 },
      {}
    );

    expect(onAnomaly).toHaveBeenCalledTimes(1);
    const firstAnomalyCall = onAnomaly.mock.calls[0];
    if (!firstAnomalyCall) {
      throw new Error('Expected anomaly monitor to be invoked');
    }
    const [event] = firstAnomalyCall;
    if (!event) {
      throw new Error('Expected anomaly payload');
    }
    expect(event.metric).toBe('durationMs');
    expect(event.value).toBe(3000);
  });
});
