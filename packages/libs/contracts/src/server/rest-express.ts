import type {
  Request as ExpressReq,
  Response as ExpressRes,
  Router,
} from 'express';
import { createFetchHandler, type RestOptions } from './rest-generic';
import type { SpecRegistry } from '../registry';
import type { HandlerCtx } from '../types';

/**
 * Build an Express Router that proxies to the Fetch-style handler.
 * You can mount it at any base path; pass the same basePath in options.
 */
export function expressRouter(
  express: { Router: () => Router },
  reg: SpecRegistry,
  ctxFactory: (req: ExpressReq) => HandlerCtx,
  options?: RestOptions
): Router {
  const router = express.Router();
  const fetchHandler = createFetchHandler(
    reg,
    (_r) => {
      // Convert Fetch Request headers -> Express req is provided below
      // We pass the Express req directly via closure
      throw new Error('ctxFactory must be called from route'); // placeholder
    },
    options
  );

  // For each spec, create a concrete route so Express can match quickly
  for (const spec of reg.listSpecs()) {
    const method =
      spec.transport?.rest?.method ??
      (spec.meta.kind === 'query' ? 'GET' : 'POST');
    const path =
      (options?.basePath ?? '') +
      (spec.transport?.rest?.path ??
        `/${spec.meta.name.replace(/\./g, '/')}/v${spec.meta.version}`);

    router[method.toLowerCase() as 'get' | 'post'](
      path,
      async (req: ExpressReq, res: ExpressRes) => {
        const url = new URL(
          `${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        const request = new Request(url.toString(), {
          method,
          headers: Object.fromEntries(
            Object.entries(req.headers).map(([k, v]) => [k, String(v)])
          ),
          body: method === 'POST' ? JSON.stringify(req.body ?? {}) : undefined,
        });

        const handler = createFetchHandler(reg, () => ctxFactory(req), options);
        const response = await handler(request);

        res.status(response.status);
        response.headers.forEach((v, k) => res.setHeader(k, v));
        const text = await response.text();
        res.send(text);
      }
    );
  }

  // Generic OPTIONS for CORS (if enabled)
  if (options?.cors) {
    router.options('*', (_req, res) => {
      const h = new Headers();
      const resp = new Response(null, { status: 204 });
      resp.headers.forEach((v, k) => h.set(k, v));
      res.status(204).send();
    });
  }

  return router;
}
