import type { Logger } from '@lssm/lib.logger';
import type { HandlerCtx } from '../../types';
import type { PresentationRegistry } from '../../presentations';
import type { PresentationDescriptorV2 } from '../../presentations/presentations.v2';

export interface McpCtxFactories {
  logger: Logger;

  /** Factory for tool execution context (e.g., system actor) */
  toolCtx: () => HandlerCtx;

  /** Factory for prompt rendering context */
  promptCtx: () => {
    userId?: string | null;
    orgId?: string | null;
    locale?: string;
  };

  /** Factory for resource resolution context */
  resourceCtx: () => {
    userId?: string | null;
    orgId?: string | null;
    locale?: string;
  };

  /** Optional registry for V1 presentations */
  presentations?: PresentationRegistry;
  /** Optional list of V2 presentation descriptors */
  presentationsV2?: PresentationDescriptorV2[];
}
