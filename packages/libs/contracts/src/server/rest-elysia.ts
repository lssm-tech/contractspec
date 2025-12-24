import type { Elysia } from 'elysia';
import { createFetchHandler, type RestOptions } from './rest-generic';
import type { OperationSpecRegistry } from '../operations/registry';
import type { HandlerCtx } from '../types';

/** Mount routes on an Elysia instance */
export function elysiaPlugin(
  app: Elysia,
  reg: OperationSpecRegistry,
  ctxFactory: (c: { request: Request; store: unknown }) => HandlerCtx,
  options?: RestOptions
) {
  const handler = createFetchHandler(
    reg,
    (req) =>
      ctxFactory({
        request: req,
        store: (app as unknown as { store: unknown }).store,
      }),
    options
  );

  for (const spec of reg.listSpecs()) {
    const method =
      spec.transport?.rest?.method ??
      (spec.meta.kind === 'query' ? 'GET' : 'POST');
    const path =
      (options?.basePath ?? '') +
      (spec.transport?.rest?.path ??
        `/${spec.meta.key.replace(/\./g, '/')}/v${spec.meta.version}`);
    app[method.toLowerCase() as 'get' | 'post'](
      path,
      ({ request }: { request: Request }) => handler(request)
    );
  }

  if (options?.cors) {
    app.options('*', ({ request }: { request: Request }) => handler(request));
  }

  return app;
}
