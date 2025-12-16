import { AsyncLocalStorage } from 'node:async_hooks';
import type { ContextData, TraceContext } from './types';

interface LogContextData {
  context: ContextData;
  trace?: TraceContext;
}

/**
 * Node.js implementation of LogContext using AsyncLocalStorage.
 */
export class LogContext {
  private static instance: LogContext;
  private storage: AsyncLocalStorage<LogContextData>;

  constructor() {
    this.storage = new AsyncLocalStorage<LogContextData>();
  }

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
    return this.storage.run(contextData, fn) as T;
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
    const current = this.storage.getStore();
    if (current) {
      current.context[key] = value;
    }
  }

  /**
   * Get a specific context value
   */
  get<T>(key: string): T | undefined {
    const current = this.storage.getStore();
    return current?.context?.[key] as T | undefined;
  }

  /**
   * Get all context data
   */
  getContext(): ContextData {
    const current = this.storage.getStore();
    return current?.context || {};
  }

  /**
   * Set trace context
   */
  setTrace(trace: TraceContext): void {
    const current = this.storage.getStore();
    if (current) {
      current.trace = trace;
    }
  }

  /**
   * Get current trace context
   */
  getCurrentTrace(): TraceContext | undefined {
    const current = this.storage.getStore();
    return current?.trace;
  }

  /**
   * Generate a unique ID for requests/operations
   */
  generateId(): string {
    return crypto.randomUUID();
  }
}
