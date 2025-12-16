import type { TraceContext, TracingOptions } from './types';
import { LogContext } from './context.node';
import { Timer } from './timer';

export class Tracer {
  private context: LogContext;
  private activeSpans = new Map<string, TraceContext>();

  constructor() {
    this.context = LogContext.getInstance();
  }

  /**
   * Start a new trace span
   */
  startSpan(options: TracingOptions): TraceContext {
    const parentTrace = this.context.getCurrentTrace();
    const traceId = parentTrace?.traceId || this.generateTraceId();

    const span: TraceContext = {
      traceId,
      parentId: parentTrace?.spanId,
      spanId: this.generateSpanId(),
      operationType: options.operationType,
      operationName: options.operationName,
      startTime: performance.now(),
      metadata: { ...options.metadata },
      tags: [...(options.tags || [])],
    };

    this.activeSpans.set(span.spanId, span);
    this.context.setTrace(span);

    return span;
  }

  /**
   * Finish a trace span
   */
  finishSpan(spanId: string): number | undefined {
    const span = this.activeSpans.get(spanId);
    if (!span) {
      return undefined;
    }

    const duration = performance.now() - span.startTime;
    this.activeSpans.delete(spanId);

    // If this was the current span, restore parent
    const currentTrace = this.context.getCurrentTrace();
    if (currentTrace?.spanId === spanId && span.parentId) {
      const parentSpan = this.findSpanById(span.parentId);
      if (parentSpan) {
        this.context.setTrace(parentSpan);
      }
    }

    return duration;
  }

  /**
   * Execute a function within a trace span
   */
  async trace<T>(
    options: TracingOptions,
    fn: () => T | Promise<T>
  ): Promise<T> {
    const span = this.startSpan(options);
    const timer =
      options.autoTiming !== false
        ? new Timer(`trace-${span.spanId}`)
        : undefined;

    try {
      const result = await fn();

      const duration = this.finishSpan(span.spanId);
      if (timer) {
        timer.stop();
      }

      // Add timing metadata
      if (duration !== undefined) {
        span.metadata.duration = duration;
      }

      return result;
    } catch (error) {
      // Add error metadata
      span.metadata.error = {
        name: (error as Error).name || 'Unknown',
        message: (error as Error).message || 'Unknown error',
        stack: (error as Error).stack,
      };

      const duration = this.finishSpan(span.spanId);
      span.metadata.duration = duration;
      if (timer) {
        timer.stop();
      }

      throw error;
    }
  }

  /**
   * Add metadata to current span
   */
  addMetadata(key: string, value: unknown): void {
    const currentTrace = this.context.getCurrentTrace();
    if (currentTrace) {
      currentTrace.metadata[key] = value;
    }
  }

  /**
   * Add tags to current span
   */
  addTags(...tags: string[]): void {
    const currentTrace = this.context.getCurrentTrace();
    if (currentTrace) {
      currentTrace.tags.push(...tags);
    }
  }

  /**
   * Get current trace context
   */
  getCurrentTrace(): TraceContext | undefined {
    return this.context.getCurrentTrace();
  }

  /**
   * Get all active spans
   */
  getActiveSpans(): TraceContext[] {
    return Array.from(this.activeSpans.values());
  }

  /**
   * Find a span by ID
   */
  findSpanById(spanId: string): TraceContext | undefined {
    return this.activeSpans.get(spanId);
  }

  /**
   * Generate a unique trace ID
   */
  private generateTraceId(): string {
    return crypto.randomUUID().replace(/-/g, '');
  }

  /**
   * Generate a unique span ID
   */
  private generateSpanId(): string {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  }
}



