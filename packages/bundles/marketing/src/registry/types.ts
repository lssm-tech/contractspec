import type { PresentationSpec } from '@contractspec/lib.contracts/presentations';
import type React from 'react';

/**
 * Component map for React rendering.
 * Maps componentKey to actual React components.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic component map
export type ComponentMap = Record<string, React.ComponentType<any>>;

/**
 * Route-to-presentation mapping.
 */
export interface RoutePresentation {
  route: string;
  descriptor: PresentationSpec;
}
