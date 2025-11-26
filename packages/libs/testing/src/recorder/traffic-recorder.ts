import { randomUUID } from 'node:crypto';
import type { TrafficSnapshot } from '../types';

export interface TrafficStore {
  save(snapshot: TrafficSnapshot): Promise<void>;
  list(
    operation?: TrafficSnapshot['operation']['name']
  ): Promise<TrafficSnapshot[]>;
}

export class InMemoryTrafficStore implements TrafficStore {
  private readonly items: TrafficSnapshot[] = [];

  async save(snapshot: TrafficSnapshot): Promise<void> {
    this.items.push(snapshot);
  }

  async list(operation?: string): Promise<TrafficSnapshot[]> {
    if (!operation) return [...this.items];
    return this.items.filter((item) => item.operation.name === operation);
  }
}

export interface TrafficRecorderOptions {
  store: TrafficStore;
  sampleRate?: number;
  sanitize?: (snapshot: TrafficSnapshot) => TrafficSnapshot;
}

export interface RecordOperationInput {
  operation: TrafficSnapshot['operation'];
  input: unknown;
  output?: unknown;
  error?: TrafficSnapshot['error'];
  success: boolean;
  durationMs?: number;
  tenantId?: string;
  userId?: string;
  channel?: string;
  metadata?: Record<string, unknown>;
}

export class TrafficRecorder {
  private readonly store: TrafficStore;
  private readonly sampleRate: number;
  private readonly sanitize?: (snapshot: TrafficSnapshot) => TrafficSnapshot;

  constructor(options: TrafficRecorderOptions) {
    this.store = options.store;
    this.sampleRate = options.sampleRate ?? 1;
    this.sanitize = options.sanitize;
  }

  async record(input: RecordOperationInput) {
    if (!this.shouldSample()) return;
    const snapshot: TrafficSnapshot = {
      id: randomUUID(),
      operation: input.operation,
      input: structuredCloneSafe(input.input),
      output: structuredCloneSafe(input.output),
      error: input.error ? structuredCloneSafe(input.error) : undefined,
      success: input.success,
      timestamp: new Date(),
      durationMs: input.durationMs,
      tenantId: input.tenantId,
      userId: input.userId,
      channel: input.channel,
      metadata: input.metadata,
    };
    const sanitized = this.sanitize ? this.sanitize(snapshot) : snapshot;
    await this.store.save(sanitized);
  }

  private shouldSample() {
    if (this.sampleRate >= 1) return true;
    return Math.random() <= this.sampleRate;
  }
}

function structuredCloneSafe<T>(value: T): T | undefined {
  if (value == null) return value ?? undefined;
  try {
    const clone = (globalThis as { structuredClone?: <R>(input: R) => R })
      .structuredClone;
    if (typeof clone === 'function') {
      return clone(value);
    }
    return JSON.parse(JSON.stringify(value));
  } catch {
    return undefined;
  }
}










