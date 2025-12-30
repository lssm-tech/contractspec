/**
 * Logger adapter implementations.
 * Note: This provides a no-op default logger. CLI apps should inject
 * their own chalk/ora-based logger for rich terminal output.
 */

import type { LoggerAdapter, ProgressReporter } from '../ports/logger';

/**
 * Create a console-based logger adapter.
 * This is a basic implementation - CLI apps should inject their own
 * logger with chalk/ora for better terminal output.
 */
export function createConsoleLoggerAdapter(): LoggerAdapter {
  return {
    debug(message: string, data?: Record<string, unknown>): void {
      if (process.env['DEBUG']) {
        console.debug(`[DEBUG] ${message}`, data ?? '');
      }
    },

    info(message: string, data?: Record<string, unknown>): void {
      console.info(`[INFO] ${message}`, data ?? '');
    },

    warn(message: string, data?: Record<string, unknown>): void {
      console.warn(`[WARN] ${message}`, data ?? '');
    },

    error(message: string, data?: Record<string, unknown>): void {
      console.error(`[ERROR] ${message}`, data ?? '');
    },

    createProgress(): ProgressReporter {
      return createConsoleProgressReporter();
    },
  };
}

/**
 * Create a no-op logger adapter.
 * Useful for testing or when logging is not desired.
 */
export function createNoopLoggerAdapter(): LoggerAdapter {
  const noop = () => {
    // Intentional no-op
  };

  return {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    createProgress: createNoopProgressReporter,
  };
}

/**
 * Create a console-based progress reporter.
 */
function createConsoleProgressReporter(): ProgressReporter {
  return {
    start(message: string): void {
      console.log(`⏳ ${message}`);
    },

    update(update: {
      message: string;
      current?: number;
      total?: number;
    }): void {
      const progress =
        update.current !== undefined && update.total !== undefined
          ? ` (${update.current}/${update.total})`
          : '';

      console.log(`   ${update.message}${progress}`);
    },

    succeed(message?: string): void {
      console.log(`✅ ${message ?? 'Done'}`);
    },

    fail(message?: string): void {
      console.error(`❌ ${message ?? 'Failed'}`);
    },

    warn(message?: string): void {
      console.warn(`⚠️  ${message ?? 'Warning'}`);
    },

    stop(): void {
      // No-op for console logger
    },
  };
}

/**
 * Create a no-op progress reporter.
 */
function createNoopProgressReporter(): ProgressReporter {
  const noop = () => {
    // Intentional no-op
  };

  return {
    start: noop,
    update: noop,
    succeed: noop,
    fail: noop,
    warn: noop,
    stop: noop,
  };
}
