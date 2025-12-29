import { Logger } from './logger.node';
import { LogContext } from './context.node';
import type { ContextData } from './types';
import { Elysia } from 'elysia';

export interface ElysiaLoggerConfig {
  logger?: Logger;
  logRequests?: boolean;
  logResponses?: boolean;
  excludePaths?: string[];
}

/**
 * Simple ElysiaJS Logger Plugin
 * Provides automatic request logging and tracing
 */
export function elysiaLogger<T extends Elysia>(
  config: ElysiaLoggerConfig = {}
) {
  const {
    logger = new Logger(),
    logRequests = true,
    logResponses = true,
    excludePaths = ['/health', '/metrics'],
  } = config;

  const context = LogContext.getInstance();

  // For type compatibility, we use a factory function
  return function (app: T) {
    return app
      .derive((ctx) => {
        const { request, path } = ctx;

        // Skip excluded paths
        if (excludePaths.some((excludePath) => path.startsWith(excludePath))) {
          return { logger };
        }

        // Create request context
        const url = new URL(request.url);
        const requestContext: ContextData = {
          requestId: context.generateId(),
          method: request.method,
          url: request.url,
          path: url.pathname,
          userAgent: request.headers.get('user-agent') || undefined,
          timestamp: new Date().toISOString(),
        };

        const startTime = performance.now();

        // Run in context
        context.run(requestContext, () => {
          // Log request
          if (logRequests) {
            logger.info(`→ ${request.method} ${path}`, {
              method: request.method,
              path,
              userAgent: requestContext.userAgent,
              requestId: requestContext.requestId,
            });
          }
        });

        return {
          logger,
          requestContext,
          startTime,
        };
      })
      .onAfterHandle((ctx) => {
        const { request, startTime, requestContext, logger } = ctx;

        if (!startTime || !requestContext) return;

        const duration = performance.now() - startTime;
        const path = new URL(request.url).pathname;

        if (logResponses) {
          logger.info(`← 200 ${request.method} ${path}`, {
            method: request.method,
            path,
            duration: `${duration.toFixed(2)}ms`,
            requestId: requestContext.requestId,
          });
        }
      })
      .onError((ctx) => {
        const { request, error, code, startTime, requestContext, logger } = ctx;

        if (!startTime || !requestContext) return;

        const duration = performance.now() - startTime;
        const path = new URL(request.url).pathname;

        logger?.error(`✖ ${code} ${request.method} ${path}`, {
          method: request.method,
          path,
          error: error?.toString?.() || 'Unknown error',
          code,
          duration: `${duration.toFixed(2)}ms`,
          requestId: requestContext.requestId,
        });
      })
      .derive(() => ({
        // Helper functions available in route handlers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logInfo: (message: string, metadata?: Record<string, any>) => {
          logger.info(message, metadata);
        },
        logError: (
          message: string,
          error?: Error,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          metadata?: Record<string, any>
        ) => {
          logger.error(message, metadata, error);
        },
        traceOperation: async <T>(
          operationName: string,
          operation: () => T | Promise<T>
        ): Promise<T> => {
          return logger.trace(
            {
              operationType: 'custom',
              operationName,
              autoTiming: true,
            },
            operation
          );
        },
      }));
  };
}
