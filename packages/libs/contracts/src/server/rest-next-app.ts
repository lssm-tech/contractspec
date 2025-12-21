import { createFetchHandler, type RestOptions } from './rest-generic';
import type { OperationSpecRegistry } from '../registry';
import type { HandlerCtx } from '../types';

/**
 * Creates a Next.js App Router route handler for ContractSpec operations.
 *
 * This function returns a handler suitable for `export const { GET, POST }` in a `route.ts` file.
 * It handles:
 * - Path parsing to determine the operation name and version.
 * - Body parsing (JSON).
 * - Context creation via `ctxFactory`.
 * - Execution via `OperationSpecRegistry`.
 * - Response formatting (JSON success/error).
 *
 * @param reg - The OperationSpecRegistry containing the operations.
 * @param ctxFactory - A factory function to build the `HandlerCtx` (e.g., auth, tenant) from the request.
 * @param options - Optional configuration for the REST handler.
 * @returns A function `(req: Request) => Promise<Response>`.
 *
 * @example
 * ```ts
 * // app/api/[...route]/route.ts
 * import { makeNextAppHandler } from '@lssm/lib.contracts/server/rest-next-app';
 * import { registry } from '@/lib/registry';
 *
 * const handler = makeNextAppHandler(registry, (req) => ({ actor: 'anonymous' }));
 * export { handler as GET, handler as POST };
 * ```
 */
export function makeNextAppHandler(
  reg: OperationSpecRegistry,
  ctxFactory: (req: Request) => HandlerCtx,
  options?: RestOptions
) {
  const handler = createFetchHandler(reg, ctxFactory, options);
  return async function requestHandler(req: Request) {
    return handler(req);
  };
}
