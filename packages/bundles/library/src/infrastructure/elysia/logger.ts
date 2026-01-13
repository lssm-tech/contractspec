import { Logger, LogLevel } from '@contractspec/lib.logger';

// Centralized logger configuration for the API
export const createAppLogger = () =>
  new Logger({
    level:
      process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
    environment: process.env.NODE_ENV || 'development',
    enableTracing: true,
    enableTiming: true,
    enableContext: true,
    enableColors: process.env.NODE_ENV !== 'production',
  });

// Default logger instance for the application
export const appLogger = createAppLogger();

// Logger specifically for database operations
export const dbLogger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
  environment: process.env.NODE_ENV || 'development',
  enableTracing: true,
  enableTiming: true,
  enableContext: true,
  enableColors: process.env.NODE_ENV !== 'production',
});

// Logger for authentication operations
export const authLogger = new Logger({
  level: LogLevel.INFO, // Always log auth events
  environment: process.env.NODE_ENV || 'development',
  enableTracing: true,
  enableTiming: true,
  enableContext: true,
  enableColors: process.env.NODE_ENV !== 'production',
});

export { Logger, LogLevel };
