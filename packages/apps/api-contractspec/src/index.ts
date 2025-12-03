import { swagger } from '@elysiajs/swagger';
import { auth } from '@lssm/bundle.contractspec-studio/application/services/auth';
import {
  appLogger,
  createContractspecElysiaServer,
  mountContractspecGraphQL,
  schema,
} from '@lssm/bundle.contractspec/infrastructure';
import { Elysia } from 'elysia';
import { exportContractsToGraphQLSchema } from '@lssm/lib.contracts';

const PORT = 8080;

// user middleware (compute user and session and pass to routes)
const betterAuth = (app: Elysia) =>
  app
    .use(
      swagger({
        documentation: { components: undefined as any, paths: {} as any },
      })
    )
    .mount(auth.handler)
    .macro({
      auth: {
        async resolve({ status, request: { headers } }) {
          const session = await auth.api.getSession({
            headers,
          });
          console.log('elysia auth resolve', { session: !!session });

          if (!session) return status(401);
          return {
            user: session.user,
            session: session.session,
          };
        },
      },
    });

const app = createContractspecElysiaServer({
  logger: appLogger,
  plugins: [
    (app: any) => betterAuth(app),
    (app: any) => mountContractspecGraphQL(app),
  ],
  // mount: [(app: any) => app.use(collabModule)],
})
  .get('/', () => {
    appLogger.info('Root endpoint accessed');
    return 'LSSM API - GraphQL endpoint available at /graphql';
  })
  .listen(PORT);
// exportContractsToGraphQLSchema(schema, __dirname);

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
