import {
  createDefaultTransformEngine,
  registerDefaultReactRenderer,
  registerBasicValidation,
  type TransformEngine,
  type PresentationRenderer,
} from '@lssm/lib.contracts/presentations.v2';
import type { ComponentMap } from './types';
import { componentMap } from './registry';

/**
 * Create and configure the TransformEngine for web-landing presentations.
 * Includes React and Markdown renderers with component map registration.
 */
export function createPresentationEngine(
  customComponentMap?: ComponentMap
): TransformEngine {
  const engine = createDefaultTransformEngine();
  
  // Register React renderer
  registerDefaultReactRenderer(engine);
  
  // Register basic validation
  registerBasicValidation(engine);
  
  // Register custom markdown renderers if needed
  // (can be added later for complex pages)
  
  return engine;
}

/**
 * Singleton engine instance for the app.
 * Use this for rendering presentations.
 */
export const presentationEngine = createPresentationEngine();

