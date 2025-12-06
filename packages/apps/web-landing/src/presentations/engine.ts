import {
  createDefaultTransformEngine,
  registerDefaultReactRenderer,
  registerBasicValidation,
  registerReactToMarkdownRenderer,
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

  // Register React-to-markdown renderer with component map
  // This enables rendering React components to markdown for LLM consumption
  const mapToUse = customComponentMap ?? componentMap;
  registerReactToMarkdownRenderer(engine, mapToUse);

  return engine;
}

/**
 * Singleton engine instance for the app.
 * Use this for rendering presentations.
 */
export const presentationEngine = createPresentationEngine();
