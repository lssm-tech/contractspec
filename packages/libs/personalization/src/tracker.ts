import { trace, metrics } from '@opentelemetry/api';
import type { BehaviorEvent } from './types';
import type { BehaviorStore } from './store';

export interface BehaviorTrackerContext {
  tenantId: string;
  userId?: string;
  role?: string;
  device?: string;
  metadata?: Record<string, unknown>;
}

export interface BehaviorTrackerOptions {
  store: BehaviorStore;
  context: BehaviorTrackerContext;
  tracerName?: string;
  autoFlushIntervalMs?: number;
  bufferSize?: number;
}

const DEFAULT_BUFFER_SIZE = 25;

export interface TrackFieldAccessInput {
  operation: string;
  field: string;
  metadata?: Record<string, unknown>;
}

export interface TrackFeatureUsageInput {
  feature: string;
  action: 'opened' | 'completed' | 'dismissed';
  metadata?: Record<string, unknown>;
}

export interface TrackWorkflowStepInput {
  workflow: string;
  step: string;
  status: 'entered' | 'completed' | 'skipped' | 'errored';
  metadata?: Record<string, unknown>;
}

export class BehaviorTracker {
  private readonly store: BehaviorStore;
  private readonly context: BehaviorTrackerContext;
  private readonly tracer = trace.getTracer('lssm.personalization', '1.0.0');
  private readonly counter = metrics
    .getMeter('lssm.personalization', '1.0.0')
    .createCounter('lssm.personalization.events', {
      description: 'Behavior events tracked for personalization',
    });

  private buffer: BehaviorEvent[] = [];
  private readonly bufferSize: number;
  private flushTimer?: ReturnType<typeof setInterval>;

  constructor(options: BehaviorTrackerOptions) {
    this.store = options.store;
    this.context = options.context;
    this.bufferSize = options.bufferSize ?? DEFAULT_BUFFER_SIZE;

    if (options.autoFlushIntervalMs) {
      this.flushTimer = setInterval(() => {
        void this.flush();
      }, options.autoFlushIntervalMs);
    }
  }

  trackFieldAccess(input: TrackFieldAccessInput) {
    const event = {
      type: 'field_access',
      operation: input.operation,
      field: input.field,
      timestamp: Date.now(),
      ...this.context,
      metadata: { ...this.context.metadata, ...input.metadata },
    } as BehaviorEvent;
    this.enqueue(event);
  }

  trackFeatureUsage(input: TrackFeatureUsageInput) {
    const event = {
      type: 'feature_usage',
      feature: input.feature,
      action: input.action,
      timestamp: Date.now(),
      ...this.context,
      metadata: { ...this.context.metadata, ...input.metadata },
    } as BehaviorEvent;
    this.enqueue(event);
  }

  trackWorkflowStep(input: TrackWorkflowStepInput) {
    const event = {
      type: 'workflow_step',
      workflow: input.workflow,
      step: input.step,
      status: input.status,
      timestamp: Date.now(),
      ...this.context,
      metadata: { ...this.context.metadata, ...input.metadata },
    } as BehaviorEvent;
    this.enqueue(event);
  }

  async flush(): Promise<void> {
    if (!this.buffer.length) return;
    const events = this.buffer;
    this.buffer = [];
    await this.store.bulkRecord(events);
  }

  async dispose(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    await this.flush();
  }

  private enqueue(event: BehaviorEvent) {
    this.buffer.push(event);
    this.counter.add(1, {
      tenantId: this.context.tenantId,
      type: event.type,
    });

    this.tracer.startActiveSpan(`personalization.${event.type}`, (span) => {
      span.setAttribute('tenant.id', this.context.tenantId);
      if (this.context.userId)
        span.setAttribute('user.id', this.context.userId);
      span.setAttribute('personalization.event_type', event.type);
      span.end();
    });

    if (this.buffer.length >= this.bufferSize) {
      void this.flush();
    }
  }
}

export const createBehaviorTracker = (options: BehaviorTrackerOptions) =>
  new BehaviorTracker(options);
