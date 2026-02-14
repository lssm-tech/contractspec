import { createFetchHandler, type RestOptions } from './rest-generic';
import type { OperationSpecRegistry } from '@contractspec/lib.contracts-spec/operations/registry';
import type { HandlerCtx } from '@contractspec/lib.contracts-spec/types';

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
