import type { Logger } from '@contractspec/lib.logger';
import type { HandlerCtx } from '@contractspec/lib.contracts-spec/types';
import type { PresentationRegistry } from '@contractspec/lib.contracts-spec/presentations';

export interface McpCtxFactories {
  logger: Logger;
  toolCtx: () => HandlerCtx;
  promptCtx: () => {
    userId?: string | null;
    orgId?: string | null;
    locale?: string;
  };
  resourceCtx: () => {
    userId?: string | null;
    orgId?: string | null;
    locale?: string;
  };
  presentations?: PresentationRegistry;
}
