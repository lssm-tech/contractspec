import type {
  ContextData,
  Formatter,
  LogEntry,
  LoggerConfig,
  TraceMethod,
  TracingOptions,
} from './types';
import { LogLevel } from './types';
import { LogContext } from './context.node';
import { Tracer } from './tracer.node';
import { Timer, TimerManager } from './timer';
import { DevFormatter, ProductionFormatter } from './formatters';

export class Logger {
  private config: LoggerConfig;
  private formatter: Formatter;
  private context: LogContext;
  private tracer: Tracer;
  private timerManager: TimerManager;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      environment:
        (process.env.NODE_ENV as LoggerConfig['environment']) || 'development',
      enableTracing: true,
      enableTiming: true,
      enableContext: true,
      enableColors: true,
      maxContextDepth: 10,
      timestampFormat: 'iso',
      ...config,
    };

    this.context = LogContext.getInstance();
    this.tracer = new Tracer();
    this.timerManager = new TimerManager();

    // Set up formatter based on environment
    this.formatter =
      this.config.environment === 'production'
        ? new ProductionFormatter()
        : new DevFormatter(this.config.enableColors);
  }

  // Core logging methods
  traceLog(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.TRACE, message, metadata);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    this.log(LogLevel.ERROR, message, metadata, error);
  }

  fatal(
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    this.log(LogLevel.FATAL, message, metadata, error);
  }

  // Context management
  withContext<T>(context: ContextData, fn: () => T): T {
    return this.context.run(context, fn);
  }

  extendContext<T>(additionalContext: Partial<ContextData>, fn: () => T): T {
    return this.context.extend(additionalContext, fn) as T;
  }

  setContext(key: string, value: unknown): void {
    this.context.set(key, value);
  }

  getContext(): ContextData {
    return this.context.getContext();
  }

  // Tracing functionality
  trace: TraceMethod = async <T>(
    options: TracingOptions,
    fn: () => T | Promise<T>
  ): Promise<T> => {
    if (!this.config.enableTracing) {
      return await fn();
    }

    return this.tracer.trace(options, fn);
  };

  getTraceId(): string | undefined {
    return this.tracer.getCurrentTrace()?.traceId;
  }

  startSpan(options: TracingOptions) {
    if (!this.config.enableTracing) {
      return null;
    }
    return this.tracer.startSpan(options);
  }

  finishSpan(spanId: string): number | undefined {
    if (!this.config.enableTracing) {
      return undefined;
    }
    return this.tracer.finishSpan(spanId);
  }

  addTraceMetadata(key: string, value: unknown): void {
    if (this.config.enableTracing) {
      this.tracer.addMetadata(key, value);
    }
  }

  addTraceTags(...tags: string[]): void {
    if (this.config.enableTracing) {
      this.tracer.addTags(...tags);
    }
  }

  // Timer functionality
  startTimer(id?: string): Timer | null {
    if (!this.config.enableTiming) {
      return null;
    }
    return this.timerManager.start(id);
  }

  stopTimer(id: string): number | undefined {
    if (!this.config.enableTiming) {
      return undefined;
    }
    return this.timerManager.stop(id);
  }

  getTimer(id: string): Timer | undefined {
    return this.timerManager.get(id);
  }

  // Utility methods
  child(context: Partial<ContextData>): Logger {
    const childLogger = new Logger(this.config);
    Object.entries(context).forEach(([key, value]) => {
      childLogger.setContext(key, value);
    });
    return childLogger;
  }

  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  setFormatter(formatter: Formatter): void {
    this.formatter = formatter;
  }

  // Performance profiling
  async profile<T>(
    operationName: string,
    fn: () => T | Promise<T>,
    options?: { logResult?: boolean; logLevel?: LogLevel }
  ): Promise<T> {
    const timer = this.startTimer(`profile-${operationName}`);
    const startTime = performance.now();

    try {
      const result = await this.tracer.trace(
        {
          operationType: 'custom',
          operationName: `profile:${operationName}`,
          autoTiming: true,
        },
        fn
      );

      const duration = performance.now() - startTime;
      timer?.stop();

      const logLevel = options?.logLevel || LogLevel.DEBUG;
      this.log(logLevel, `Profile: ${operationName} completed`, {
        operation: operationName,
        duration: `${duration.toFixed(2)}ms`,
        result: options?.logResult ? result : '[result hidden]',
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      timer?.stop();

      this.error(
        `Profile: ${operationName} failed`,
        {
          operation: operationName,
          duration: `${duration.toFixed(2)}ms`,
          error: (error as Error).message,
        },
        error as Error
      );

      throw error;
    }
  }

  // HTTP request logging helper
  logRequest(
    method: string,
    url: string,
    statusCode?: number,
    duration?: number
  ): void {
    const level = this.getHttpLogLevel(statusCode);
    const message = `${method.toUpperCase()} ${url}${statusCode ? ` ${statusCode}` : ''}`;

    this.log(level, message, {
      method,
      url,
      statusCode,
      duration: duration ? `${duration.toFixed(2)}ms` : undefined,
      type: 'http_request',
    });
  }

  // Flush any pending logs (useful for graceful shutdown)
  async flush(): Promise<void> {
    this.timerManager.clear();
  }

  // Get logger statistics
  getStats(): {
    activeTimers: number;
    activeSpans: number;
    config: LoggerConfig;
  } {
    return {
      activeTimers: this.timerManager.getActive().length,
      activeSpans: this.tracer.getActiveSpans().length,
      config: { ...this.config },
    };
  }

  // Output method (can be overridden for custom outputs)
  protected output(message: string, level: LogLevel): void {
    if (level >= LogLevel.ERROR) {
      console.error(message);
    } else {
      console.log(message);
    }
  }

  // Core log method
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    if (level < this.config.level) {
      return; // Skip logs below configured level
    }

    const currentTrace = this.config.enableTracing
      ? this.tracer.getCurrentTrace()
      : undefined;
    const contextData = this.config.enableContext
      ? this.context.getContext()
      : undefined;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      traceId: currentTrace?.traceId,
      parentId: currentTrace?.parentId,
      spanId: currentTrace?.spanId,
      context: contextData,
      metadata,
      error,
      tags: currentTrace?.tags,
    };

    // Add duration if we're in a traced operation
    if (currentTrace?.metadata?.duration) {
      entry.duration = currentTrace.metadata.duration as number;
    }

    const formatted = this.formatter.format(entry);
    this.output(formatted, level);
  }

  private getHttpLogLevel(statusCode?: number): LogLevel {
    if (!statusCode) return LogLevel.INFO;
    if (statusCode >= 500) return LogLevel.ERROR;
    if (statusCode >= 400) return LogLevel.WARN;
    return LogLevel.INFO;
  }
}


