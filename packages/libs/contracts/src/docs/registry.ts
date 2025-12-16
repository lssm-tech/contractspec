import type { PresentationDescriptorV2 } from '../presentations.v2';
import type { PresentationSpec } from '../presentations';
import type { DocBlock } from './types';
import {
  docBlockToPresentationSpec,
  docBlocksToPresentationRoutes,
  type DocPresentationOptions,
  type DocPresentationRoute,
} from './presentations';

export type DocId = string & { __docId: true };

export class DocRegistry {
  private readonly routes = new Map<string, DocPresentationRoute>();

  constructor(blocks: DocBlock[] = [], options?: DocPresentationOptions) {
    blocks.forEach((block) => this.register(block, options));
  }

  register(block: DocBlock, options?: DocPresentationOptions): this {
    const [route] = docBlocksToPresentationRoutes([block], options);
    if (route) {
      this.routes.set(block.id, route);
    }
    return this;
  }

  list(): DocPresentationRoute[] {
    return [...this.routes.values()];
  }

  get(id: string): DocPresentationRoute | undefined {
    return this.routes.get(id);
  }

  toRouteTuples(): [string, PresentationDescriptorV2][] {
    return this.list().map(({ route, descriptor }) => [route, descriptor]);
  }

  toPresentationSpecs(options?: DocPresentationOptions): PresentationSpec[] {
    return this.list().map(({ block }) =>
      docBlockToPresentationSpec(block, options)
    );
  }
}

const requiredFields: (keyof DocBlock)[] = [
  'id',
  'title',
  'body',
  'kind',
  'visibility',
  'route',
];

export const defaultDocRegistry = new DocRegistry();

export function registerDocBlocks(blocks: DocBlock[]): void {
  for (const block of blocks) {
    for (const field of requiredFields) {
      if (!block[field]) {
        throw new Error(
          `DocBlock ${block.id ?? '<missing id>'} missing field ${String(field)}`
        );
      }
    }
    defaultDocRegistry.register(block);
  }
}

export function listRegisteredDocBlocks(): DocBlock[] {
  return defaultDocRegistry.list().map((r) => r.block);
}

export function docId(id: string): DocId {
  const found = defaultDocRegistry.get(id);
  if (!found) throw new Error(`DocBlock not registered: ${id}`);
  return id as DocId;
}


