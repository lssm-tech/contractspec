import {
  appLogger,
  collabModule,
  createContractSpecStudioElysiaServer,
  mountContractSpecStudioGraphQL,
  schema,
} from '@lssm/bundle.contractspec-studio/infrastructure';
import {
  createCliMcpHandler,
  createDocsMcpHandler,
  createInternalMcpHandler,
} from '@lssm/bundle.contractspec-studio/application';
import { exportContractsToGraphQLSchema } from './utils/graphql-schema-export';
import { markdownHandler } from './handlers/markdown-handler';
import { betterAuthController } from './handlers/auth-controller';

const PORT = 8080;

const docsMcpHandler = createDocsMcpHandler('/api/mcp/docs');
const cliMcpHandler = createCliMcpHandler('/api/mcp/cli');
const internalMcpHandler = createInternalMcpHandler('/api/mcp/internal');

const app = createContractSpecStudioElysiaServer({
  logger: appLogger,
  plugins: [betterAuthController, mountContractSpecStudioGraphQL()],
  mount: [collabModule],
})
  .get('/', () => {
    appLogger.info('Root endpoint accessed');
    return 'LSSM API - GraphQL endpoint available at /graphql';
  })
  .post('/api/mcp/docs', ({ request }) => docsMcpHandler(request))
  .post('/api/mcp/cli', ({ request }) => cliMcpHandler(request))
  .post('/api/mcp/internal', ({ request }) => internalMcpHandler(request))
  .use(markdownHandler)
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
appLogger.info('🚀 LSSM API Server successfully started', {
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
