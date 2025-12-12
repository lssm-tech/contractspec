/**
 * Logger and progress reporter port.
 */

/**
 * Log level.
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Progress update.
 */
export interface ProgressUpdate {
  message: string;
  current?: number;
  total?: number;
}

/**
 * Progress reporter for long-running operations.
 */
export interface ProgressReporter {
  /**
   * Start progress reporting.
   */
  start(message: string): void;

  /**
   * Update progress.
   */
  update(update: ProgressUpdate): void;

  /**
   * Mark as succeeded.
   */
  succeed(message?: string): void;

  /**
   * Mark as failed.
   */
  fail(message?: string): void;

  /**
   * Mark as warned.
   */
  warn(message?: string): void;

  /**
   * Stop progress reporting.
   */
  stop(): void;
}

/**
 * Logger adapter interface.
 */
export interface LoggerAdapter {
  /**
   * Log debug message.
   */
  debug(message: string, data?: Record<string, unknown>): void;

  /**
   * Log info message.
   */
  info(message: string, data?: Record<string, unknown>): void;

  /**
   * Log warning message.
   */
  warn(message: string, data?: Record<string, unknown>): void;

  /**
   * Log error message.
   */
  error(message: string, data?: Record<string, unknown>): void;

  /**
   * Create a progress reporter.
   */
  createProgress(): ProgressReporter;
}

/**
 * Combined adapters for workspace services.
 */
export interface WorkspaceAdapters {
  fs: import('./fs').FsAdapter;
  git: import('./git').GitAdapter;
  watcher: import('./watcher').WatcherAdapter;
  ai: import('./ai').AiAdapter;
  logger: LoggerAdapter;
}
