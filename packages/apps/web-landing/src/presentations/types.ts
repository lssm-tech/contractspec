import type React from 'react';
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts/presentations.v2';

/**
 * Component map for React rendering.
 * Maps componentKey to actual React components.
 */
export type ComponentMap = Record<string, React.ComponentType<any>>;

/**
 * Route-to-presentation mapping.
 */
export interface RoutePresentation {
  route: string;
  descriptor: PresentationDescriptorV2;
}

