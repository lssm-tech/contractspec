export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  traceId?: string;
  parentId?: string;
  spanId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  duration?: number;
  error?: Error;
  tags?: string[];
}

export interface TraceContext {
  traceId: string;
  parentId?: string;
  spanId: string;
  operationType: string;
  operationName: string;
  startTime: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  tags: string[];
}

export interface TracingOptions {
  operationType:
    | 'http'
    | 'websocket'
    | 'cron'
    | 'queue'
    | 'database'
    | 'custom';
  operationName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>;
  tags?: string[];
  autoTiming?: boolean;
}

export interface LoggerConfig {
  level: LogLevel;
  environment: 'development' | 'production' | 'test';
  enableTracing: boolean;
  enableTiming: boolean;
  enableContext: boolean;
  enableColors: boolean;
  maxContextDepth: number;
  timestampFormat: 'iso' | 'epoch' | 'relative';
}

export interface Formatter {
  format(entry: LogEntry): string;
}

export interface Timer {
  readonly id: string;
  // private startTime: number;
  stop(): number;
  lap(label?: string): number;
  getElapsed(): number;
}

export interface ContextData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  userId?: string;
  requestId?: string;
  sessionId?: string;
  ip?: string;
  userAgent?: string;
}

export type LogMethod = (
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
) => void;
export type TraceMethod = <T>(
  options: TracingOptions,
  fn: () => T | Promise<T>
) => Promise<T>;
