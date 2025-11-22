import { trace, context } from '@opentelemetry/api';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

export class Logger {
  constructor(private readonly serviceName: string) {}

  private log(
    level: LogLevel,
    message: string,
    meta: Record<string, unknown> = {}
  ) {
    const span = trace.getSpan(context.active());
    const traceId = span?.spanContext().traceId;
    const spanId = span?.spanContext().spanId;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level,
      message,
      traceId,
      spanId,
      ...meta,
    };

    // structured logging to stdout
    console.log(JSON.stringify(entry));
  }

  debug(message: string, meta?: Record<string, unknown>) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, unknown>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, unknown>) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, unknown>) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger(
  process.env.OTEL_SERVICE_NAME || 'unknown-service'
);


