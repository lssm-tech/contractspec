import { createFetchHandler, type RestOptions } from './rest-generic';
import type { SpecRegistry } from '../registry';
import type { HandlerCtx } from '../types';

/**
 * Build a single Next.js App Router handler for a catch-all route:
 *   app/api/[...all]/route.ts
 *
 * You can also call this from a specific route; it matches full paths internally.
 */
export function makeNextAppHandler(
  reg: SpecRegistry,
  ctxFactory: (req: Request) => HandlerCtx,
  options?: RestOptions
) {
  const handler = createFetchHandler(reg, ctxFactory, options);
  return async function requestHandler(req: Request) {
    return handler(req);
  };
}
