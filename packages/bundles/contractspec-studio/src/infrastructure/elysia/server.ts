import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { serverTiming } from '@elysiajs/server-timing';
import { elysiaLogger } from '@lssm/lib.logger';

export interface ElysiaServerOptions {
  logger: any;
  plugins?: any[];
  mount?: any[];
  port?: number;
}

export function createContractSpecStudioElysiaServer(opts: ElysiaServerOptions) {

  const app = new Elysia()
    .use(cors())
    .use(
      elysiaLogger({
        logger: opts.logger,
        logRequests: true,
        logResponses: true,
        excludePaths: ['/health', '/favicon.ico'],
      })
    )
    .use(serverTiming())
    .get('/health', () => ({
      status: 'healthy',
      ts: new Date().toISOString(),
    }));

  for (const p of opts.plugins ?? []) {
    if (typeof p === 'function') p(app);
    else if (p) app.use(p);
  }
  for (const m of opts.mount ?? []) {
    if (typeof m === 'function') m(app);
    else if (m) app.use(m);
  }

  return app;
}
