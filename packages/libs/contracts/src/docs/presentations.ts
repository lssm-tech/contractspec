import type { PresentationSpec } from '../presentations';
import type {
  PresentationDescriptorV2,
  PresentationTarget,
} from '../presentations.v2';
import type { DocBlock } from './types';
import type { Stability } from '../ownership';

export interface DocPresentationOptions {
  /**
   * Namespace for presentation meta.name (e.g., web-landing.docs.ops).
   * Defaults to the DocBlock id.
   */
  namespace?: string;
  /** Route prefix when no explicit route is provided on the block. Defaults to /docs. */
  routePrefix?: string;
  /** Default presentation targets. */
  defaultTargets?: PresentationTarget[];
  /** Default version when block.version is not set. */
  defaultVersion?: number;
  /** Default stability if not provided on the DocBlock. */
  defaultStability?: Stability;
}

export interface DocPresentationRoute {
  route: string;
  descriptor: PresentationDescriptorV2;
  block: DocBlock;
}

const DEFAULT_TARGETS: PresentationTarget[] = [
  'markdown',
  'application/json',
  'application/xml',
  'react',
];

function normalizeRoute(route: string): string {
  if (!route.length) return '/';
  const withLeading = route.startsWith('/') ? route : `/${route}`;
  return withLeading === '/' ? '/' : withLeading.replace(/\/+$/, '');
}

function deriveRoute(block: DocBlock, routePrefix?: string): string {
  if (block.route) return normalizeRoute(block.route);
  const prefix = routePrefix ?? '/docs';
  const slug = block.id
    .replace(/^docs\.?/, '')
    .replace(/\./g, '/')
    .replace(/\/+/g, '/');
  const path = slug.startsWith('/') ? slug : `${prefix}/${slug}`;
  return normalizeRoute(path);
}

function buildName(block: DocBlock, namespace?: string): string {
  return namespace ? `${namespace}.${block.id}` : block.id;
}

export function docBlockToPresentationV2(
  block: DocBlock,
  options?: DocPresentationOptions
): PresentationDescriptorV2 {
  const targets = options?.defaultTargets ?? DEFAULT_TARGETS;
  const version = block.version ?? options?.defaultVersion ?? 1;
  const stability = block.stability ?? options?.defaultStability ?? 'stable';

  return {
    meta: {
      name: buildName(block, options?.namespace),
      version,
      description: block.summary ?? block.title,
      tags: block.tags,
      owners: block.owners,
      domain: block.domain,
      stability,
    },
    policy:
      block.visibility && block.visibility !== 'public'
        ? { flags: [block.visibility] }
        : undefined,
    source: {
      type: 'blocknotejs',
      docJson: block.body,
    },
    targets,
  };
}

export function docBlockToPresentationSpec(
  block: DocBlock,
  options?: DocPresentationOptions
): PresentationSpec {
  const version = block.version ?? options?.defaultVersion ?? 1;
  const stability = block.stability ?? options?.defaultStability ?? 'stable';

  return {
    meta: {
      name: buildName(block, options?.namespace),
      version,
      stability,
      tags: block.tags,
      owners: block.owners,
      description: block.summary ?? block.title,
    },
    content: {
      kind: 'markdown',
      content: block.body,
    },
  };
}

export function docBlocksToPresentationRoutes(
  blocks: DocBlock[],
  options?: DocPresentationOptions
): DocPresentationRoute[] {
  return blocks.map((block) => ({
    block,
    route: deriveRoute(block, options?.routePrefix),
    descriptor: docBlockToPresentationV2(block, options),
  }));
}

export function docBlocksToPresentationSpecs(
  blocks: DocBlock[],
  options?: DocPresentationOptions
): PresentationSpec[] {
  return blocks.map((block) => docBlockToPresentationSpec(block, options));
}

export function mapDocRoutes(
  routes: DocPresentationRoute[]
): [string, PresentationDescriptorV2][] {
  return routes.map(({ route, descriptor }) => [route, descriptor]);
}



