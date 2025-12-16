import 'zone.js';
import type { ContextData, TraceContext } from './types';

interface LogContextData {
  context: ContextData;
  trace?: TraceContext;
}

interface ZoneForkSpec {
  name?: string;
  properties?: Record<string, unknown>;
}

interface ZoneLike {
  fork(spec: ZoneForkSpec): ZoneLike;
  run<T>(fn: () => T): T;
  get<T>(key: string): T | undefined;
}

interface ZoneStaticLike {
  current: ZoneLike;
}

const ZONE = (globalThis as unknown as { Zone?: ZoneStaticLike }).Zone;
const STORE_KEY = '__lssm_log_context_data__';

function getStore(): LogContextData | undefined {
  if (!ZONE) return undefined;
  return ZONE.current.get<LogContextData>(STORE_KEY);
}

/**
 * Browser implementation of LogContext using Zone.js for async context
 * propagation (similar to AsyncLocalStorage in Node).
 */
export class LogContext {
  private static instance: LogContext;
  private static fallbackCounter = 0;

  static getInstance(): LogContext {
    if (!LogContext.instance) {
      LogContext.instance = new LogContext();
    }
    return LogContext.instance;
  }

  /**
   * Run a function with a new context
   */
  run<T>(context: ContextData, fn: () => T): T {
    const contextData: LogContextData = {
      context: { ...context },
      trace: this.getCurrentTrace(),
    };

    if (!ZONE) {
      return fn();
    }

    const zone = ZONE.current.fork({
      name: 'log-context',
      properties: { [STORE_KEY]: contextData },
    });

    return zone.run(fn);
  }

  /**
   * Run a function with an extended context (merges with current)
   */
  extend<T>(additionalContext: Partial<ContextData>, fn: () => T): T {
    const currentContext = this.getContext();
    const mergedContext: ContextData = {
      ...currentContext,
      ...additionalContext,
    };
    return this.run(mergedContext, fn);
  }

  /**
   * Set context data for the current execution context
   */
  set(key: string, value: unknown): void {
    const current = getStore();
    if (current) {
      current.context[key] = value;
    }
  }

  /**
   * Get a specific context value
   */
  get<T>(key: string): T | undefined {
    const current = getStore();
    return current?.context?.[key] as T | undefined;
  }

  /**
   * Get all context data
   */
  getContext(): ContextData {
    const current = getStore();
    return current?.context || {};
  }

  /**
   * Set trace context
   */
  setTrace(trace: TraceContext): void {
    const current = getStore();
    if (current) {
      current.trace = trace;
    }
  }

  /**
   * Get current trace context
   */
  getCurrentTrace(): TraceContext | undefined {
    const current = getStore();
    return current?.trace;
  }

  /**
   * Generate a unique ID for requests/operations
   */
  generateId(): string {
    if (
      typeof crypto !== 'undefined' &&
      typeof (crypto as unknown as { randomUUID?: unknown }).randomUUID ===
        'function'
    ) {
      return crypto.randomUUID();
    }

    LogContext.fallbackCounter += 1;
    return `log-${LogContext.fallbackCounter}`;
  }
}


