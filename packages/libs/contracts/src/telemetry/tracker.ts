import { randomUUID } from 'crypto';
import type { TelemetryAnomalyMonitor } from './anomaly';
import type {
  TelemetryEventDef,
  TelemetryRegistry,
  TelemetrySamplingConfig,
  TelemetrySpec,
} from './spec';

export interface TelemetryEventContext {
  tenantId?: string;
  organizationId?: string | null;
  userId?: string | null;
  sessionId?: string | null;
  actor?: 'anonymous' | 'user' | 'admin';
  channel?: 'web' | 'mobile' | 'job' | 'agent';
  metadata?: Record<string, unknown>;
}

export interface TelemetryDispatch {
  id: string;
  name: string;
  version: number;
  occurredAt: string;
  properties: Record<string, unknown>;
  privacy: TelemetryEventDef['privacy'];
  context: TelemetryEventContext;
  tags?: string[];
  spec: TelemetrySpec;
  definition: TelemetryEventDef;
}

export interface RuntimeTelemetryProvider {
  id: string;
  send(event: TelemetryDispatch): Promise<void>;
}

export interface TelemetryTrackerOptions {
  registry: TelemetryRegistry;
  providers?: RuntimeTelemetryProvider[];
  anomalyMonitor?: TelemetryAnomalyMonitor;
  random?: () => number;
  clock?: () => Date;
}

const maskValue = (value: unknown) => {
  if (value == null) return value;
  if (typeof value === 'string') return 'REDACTED';
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  if (Array.isArray(value)) return value.map(() => 'REDACTED');
  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>).map((key) => [
        key,
        'REDACTED',
      ])
    );
  }
  return 'REDACTED';
};

export class TelemetryTracker {
  private readonly providers = new Map<string, RuntimeTelemetryProvider>();
  private readonly registry: TelemetryRegistry;
  private readonly anomalyMonitor?: TelemetryAnomalyMonitor;
  private readonly random: () => number;
  private readonly clock: () => Date;

  constructor(options: TelemetryTrackerOptions) {
    this.registry = options.registry;
    this.anomalyMonitor = options.anomalyMonitor;
    this.random = options.random ?? Math.random;
    this.clock = options.clock ?? (() => new Date());

    for (const provider of options.providers ?? []) {
      this.providers.set(provider.id, provider);
    }
  }

  registerProvider(provider: RuntimeTelemetryProvider) {
    this.providers.set(provider.id, provider);
  }

  unregisterProvider(providerId: string) {
    this.providers.delete(providerId);
  }

  async track(
    name: string,
    version: number,
    properties: Record<string, unknown>,
    context: TelemetryEventContext = {}
  ): Promise<boolean> {
    const definition = this.registry.findEventDef(name, version);
    if (!definition) return false;

    const spec = this.registry.getSpecForEvent(
      definition.key,
      definition.version
    );
    if (!spec) return false;

    if (
      !this.shouldSample(
        definition.sampling ?? spec.config?.defaultSamplingRate
      )
    ) {
      return false;
    }

    const redactedProperties = this.redactProperties(definition, properties);
    const dispatch: TelemetryDispatch = {
      id: randomUUID(),
      name: definition.key,
      version: definition.version,
      occurredAt: this.clock().toISOString(),
      properties: redactedProperties,
      privacy: definition.privacy,
      context,
      tags: definition.tags,
      spec,
      definition,
    };

    await Promise.all(
      [...this.providers.values()].map((provider) => provider.send(dispatch))
    );

    this.anomalyMonitor?.observe(dispatch);
    return true;
  }

  private shouldSample(
    sampling: TelemetrySamplingConfig | number | undefined
  ): boolean {
    if (typeof sampling === 'number') {
      return this.random() < sampling;
    }
    if (!sampling) return true;
    return this.random() < sampling.rate;
  }

  private redactProperties(
    definition: TelemetryEventDef,
    properties: Record<string, unknown>
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(properties)) {
      const def = definition.properties[key];
      if (!def) {
        result[key] = value;
        continue;
      }
      if (def.redact || def.pii || definition.privacy === 'sensitive') {
        result[key] = maskValue(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
}
