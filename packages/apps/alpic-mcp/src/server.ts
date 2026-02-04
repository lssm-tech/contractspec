import { createAlpicMcpApp } from '@contractspec/bundle.alpic';
import { Logger, LogLevel } from '@contractspec/lib.logger';

const PORT = Number(process.env.PORT ?? 8080);

const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  environment: process.env.NODE_ENV || 'development',
  enableTracing: false,
  enableTiming: false,
  enableContext: false,
  enableColors: process.env.NODE_ENV !== 'production',
});

export const app = createAlpicMcpApp({
  logger,
  serverName: process.env.ALPIC_MCP_NAME ?? 'contractspec-alpic-mcp',
  serverVersion: process.env.ALPIC_MCP_VERSION ?? '1.0.0',
});

app.listen(PORT);

logger.info('alpic-mcp.started', {
  port: PORT,
  endpoints: {
    root: '/',
    mcp: '/mcp',
    assets: '/assets',
  },
});

const shutdown = async (signal: string) => {
  logger.info('alpic-mcp.shutdown', { signal });
  await logger.flush();
  process.exit(0);
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

export type App = typeof app;
