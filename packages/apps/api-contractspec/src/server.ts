import {
  appLogger,
  collabModule,
  createContractSpecStudioElysiaServer,
  mountContractSpecStudioGraphQL,
  schema,
} from '@lssm/bundle.contractspec-studio/infrastructure';
import { exportContractsToGraphQLSchema } from './utils/graphql-schema-export';
import { markdownHandler } from './handlers/markdown-handler';
import { betterAuthController } from './handlers/auth-controller';
import { mcpHandler } from './handlers/mcp-handler';
import { telemetryHandler } from './handlers/telemetry-handler';

const PORT = 8080;

const app = createContractSpecStudioElysiaServer({
  logger: appLogger,
  plugins: [betterAuthController, mountContractSpecStudioGraphQL()],
  mount: [collabModule],
})
  .get('/', () => {
    appLogger.info('Root endpoint accessed');
    return 'LSSM ContractSpec API - GraphQL endpoint available at /graphql';
  })
  .use(markdownHandler)
  .use(mcpHandler)
  .use(telemetryHandler)
  .listen(PORT);
exportContractsToGraphQLSchema(schema, __dirname);

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
