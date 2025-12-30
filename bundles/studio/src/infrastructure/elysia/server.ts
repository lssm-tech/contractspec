import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { elysiaLogger, Logger } from '@contractspec/lib.logger';

export interface ElysiaServerInitOptions {
  logger: Logger;
}

const createBaseElysiaServer = (opts: ElysiaServerInitOptions) => {
  const app = new Elysia()
    .use(cors())
    .use(
      elysiaLogger({
        logger: opts.logger,
        logRequests: true,
        logResponses: true,
        excludePaths: ['/health', '/healthz', '/favicon.ico'],
      })
    )
    .use(serverTiming())
    .get('/health', () => ({
      status: 'healthy',
      ts: new Date().toISOString(),
    }))
    .get('/healthz', () => ({
      status: 'healthy',
      ts: new Date().toISOString(),
    }));

  return app;
};

export interface ElysiaServerPluginsOptions extends ElysiaServerInitOptions {
  plugins?: Elysia[];
  mounts?: Elysia[];
}

export function createContractSpecStudioElysiaServer({
  plugins,
  mounts,
  ...baseOptions
}: ElysiaServerPluginsOptions) {
  const app = createBaseElysiaServer(baseOptions);

  if (plugins?.length) {
    app.use(plugins);
  }
  if (mounts?.length) {
    app.use(mounts);
  }

  return app;
}
