import { swagger } from '@elysiajs/swagger';
import { auth } from '@lssm/bundle.contractspec-studio/application/services/auth';
import {
  appLogger,
  createContractSpecStudioElysiaServer,
  mountContractSpecStudioGraphQL,
  schema,
} from '@lssm/bundle.contractspec-studio/infrastructure';
import { Elysia } from 'elysia';

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

const app = createContractSpecStudioElysiaServer({
  logger: appLogger,
  plugins: [
    (app: any) => betterAuth(app),
    (app: any) => mountContractSpecStudioGraphQL(app),
  ],
  // mount: [(app: any) => app.use(collabModule)],
})
  .get('/', () => {
    appLogger.info('Root endpoint accessed');
    return 'LSSM API - GraphQL endpoint available at /graphql';
  })
  .get('/markdown/:path*', async ({ params, query }) => {
    try {
      // Proxy to web-landing's llms route for markdown rendering
      // In production, this should point to the actual web-landing deployment
      const webLandingUrl = process.env.WEB_LANDING_URL || 'http://localhost:3000';
      
      // Get path from params
      const pathSegments = params.path ? (Array.isArray(params.path) ? params.path : [params.path]) : [];
      const path = pathSegments.length > 0 ? pathSegments.join('/') : '';
      
      // Construct URL to web-landing's llms route
      const llmsPath = path ? `/llms/${path}` : '/llms';
      const url = `${webLandingUrl}${llmsPath}`;
      
      // Fetch markdown from web-landing
      const response = await fetch(url, {
        headers: {
          'Accept': 'text/markdown',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(errorText, {
          status: response.status,
          headers: {
            'Content-Type': 'text/plain',
          },
        });
      }

      const markdown = await response.text();

      // Return markdown with proper headers
      return new Response(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    } catch (error) {
      appLogger.error('Error rendering markdown', { error });
      return new Response(
        `Error rendering markdown: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          status: 500,
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );
    }
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
