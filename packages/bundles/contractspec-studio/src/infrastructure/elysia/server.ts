import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { elysiaLogger, Logger } from '@lssm/lib.logger';

export interface ElysiaServerInitOptions {
  logger: Logger;
}

export type CoreElysiaServerRunner = ReturnType<typeof createBaseElysiaServer>;
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

export interface ElysiaServerPluginsOptions<
  T extends CoreElysiaServerRunner,
> extends ElysiaServerInitOptions {
  plugins?: CoreElysiaServerRunner[];
  mounts?: CoreElysiaServerRunner[];
}

export function createContractSpecStudioElysiaServer<
  T extends CoreElysiaServerRunner,
>({ plugins, mounts, ...baseOptions }: ElysiaServerPluginsOptions<T>) {
  const app = createBaseElysiaServer(baseOptions);

  if (plugins?.length) {
    app.use(plugins);
  }
  if (mounts?.length) {
    app.use(mounts);
  }

  return app;
}
