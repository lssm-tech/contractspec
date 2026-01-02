import {
  docBlocksToPresentationRoutes,
  type DocPresentationRoute,
  listRegisteredDocBlocks,
  metaDocs,
  techContractsDocs,
} from '@contractspec/lib.contracts/docs';
import type { PresentationSpec } from '@contractspec/lib.contracts/presentations';
import { opsDocBlocks } from '@contractspec/bundle.library/components/docs/ops/ops.docs';
import { productDocs } from '@contractspec/bundle.library/components/docs/product/product.docblocks';
import { techContractsDocBlocks } from '@contractspec/bundle.library/components/docs/tech/contracts/tech-docs.docblocks';
import type { ComponentMap } from './types';

// Import sub-registries
import { docsComponentMap, docsPresentations } from './registry-docs';
import {
  landingComponentMap,
  landingPresentations,
  learningPresentations,
} from './registry-landing';

/**
 * Merged component map for React rendering.
 * Maps componentKey to actual React components.
 */
export const componentMap: ComponentMap = {
  ...landingComponentMap,
  ...docsComponentMap,
};

/**
 * Presentation registry for all static pages.
 * Maps route paths to PresentationSpec definitions.
 */
export const presentationRegistry = new Map<string, PresentationSpec>([
  ...landingPresentations,
  ...learningPresentations,
  ...docsPresentations,
]);

// Add docBlocks-based presentations
const docRoutes: DocPresentationRoute[] = docBlocksToPresentationRoutes(
  [
    ...opsDocBlocks,
    ...productDocs,
    ...techContractsDocBlocks,
    ...techContractsDocs,
    ...metaDocs,
    ...listRegisteredDocBlocks(),
  ],
  {
    namespace: 'web-landing.docs',
    routePrefix: '/docs',
  }
);

for (const { route, descriptor } of docRoutes) {
  presentationRegistry.set(route, descriptor);
}

/**
 * Get presentation descriptor for a given route.
 * Returns undefined if no presentation exists for the route.
 */
export function getPresentationForRoute(
  route: string
): PresentationSpec | undefined {
  // Normalize route (remove trailing slash, handle root)
  const normalizedRoute = route === '/' ? '/' : route.replace(/\/$/, '');
  return presentationRegistry.get(normalizedRoute);
}

/**
 * Check if a route has a presentation descriptor.
 */
export function hasPresentation(route: string): boolean {
  return getPresentationForRoute(route) !== undefined;
}

/**
 * Get all registered routes with presentations.
 */
export function getAllPresentationRoutes(): string[] {
  return Array.from(presentationRegistry.keys());
}
