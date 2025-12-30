import {
  appLogger,
  createContractSpecStudioElysiaServer,
  mountContractSpecStudioGraphQL,
} from '@contractspec/bundle.studio/infrastructure';
import { betterAuthController } from './handlers/auth-controller';
import { chatHandler } from './handlers/chat-handler';
import { markdownHandler } from './handlers/markdown-handler';
import { mcpHandler } from './handlers/mcp-handler';
import { schemaHandler } from './handlers/schema-handler';
import { telemetryHandler } from './handlers/telemetry-handler';
import { workspaceOpsHandler } from './handlers/workspace-ops-handler';

const PORT = process.env.PORT || 8082;

const app = createContractSpecStudioElysiaServer({
  logger: appLogger,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: [mountContractSpecStudioGraphQL(), betterAuthController() as any],
})
  .get('/', () => {
    appLogger.info('Root endpoint accessed');
    return 'ContractSpec Studio API - GraphQL endpoint available at /graphql';
  })
  .use(markdownHandler)
  .use(mcpHandler)
  .use(telemetryHandler)
  .use(workspaceOpsHandler)
  .use(chatHandler)
  .use(schemaHandler)
  .listen(PORT);

// Startup logging
appLogger.info('🦊 ContractSpec API Server starting', {
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
  graphql: '/graphql',
  health: '/health',
});

appLogger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
appLogger.info(
  `🚀 GraphQL Playground available at http://localhost:${PORT}/graphql`
);

// Log successful startup
appLogger.info('🚀 LSSM ContractSpec API Server successfully started', {
  hostname: app.server?.hostname,
  port: app.server?.port,
  endpoints: {
    root: '/',
    health: '/health',
    graphql: '/graphql',
    auth: '/api',
    swagger: '/swagger',
    mcp: {
      docs: '/api/mcp/docs',
      cli: '/api/mcp/cli',
      internal: '/api/mcp/internal',
    },
    telemetry: '/api/telemetry/ingest',
    workspaceOps: '/api/workspace-ops',
    chat: '/api/chat',
  },
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  appLogger.info('📴 SIGTERM received, shutting down gracefully');
  await appLogger.flush();
  process.exit(0);
});

process.on('SIGINT', async () => {
  appLogger.info('📴 SIGINT received, shutting down gracefully');
  await appLogger.flush();
  process.exit(0);
});

export type App = typeof app;
