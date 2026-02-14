/**
 * Template TransformEngine Setup
 *
 * Creates and configures a TransformEngine for rendering template presentations
 * to multiple targets (React, Markdown, JSON).
 *
 * Note: This file provides engine creation functions.
 * The actual presentation definitions are in example packages.
 * Import presentations dynamically or use the main templates/engine.ts
 * which handles the build order correctly.
 */
import {
  createDefaultTransformEngine,
  registerBasicValidation,
  registerDefaultReactRenderer,
  TransformEngine,
} from '@contractspec/lib.contracts/presentations/transform-engine';
import type { PresentationSpec } from '@contractspec/lib.contracts/presentations';

/**
 * Create a configured TransformEngine for template rendering
 */
export function createTemplateTransformEngine(): TransformEngine {
  const engine = createDefaultTransformEngine();

  // Add React renderer that returns serializable descriptors
  registerDefaultReactRenderer(engine);

  // Add basic validation for description, etc.
  registerBasicValidation(engine);

  return engine;
}

/**
 * Find a presentation by name and version from a list
 */
export function findPresentation(
  presentations: PresentationSpec[],
  name: string,
  version: number
): PresentationSpec | undefined {
  return presentations.find(
    (p) => p.meta.key === name && String(p.meta.version) === String(version)
  );
}

/**
 * Get all presentations for a given domain from a list
 */
export function filterPresentationsByDomain(
  presentations: PresentationSpec[],
  domain: string
): PresentationSpec[] {
  return presentations.filter((p) => p.meta.domain === domain);
}

/**
 * Check if a presentation supports a given target
 */
export function supportsTarget(
  presentation: PresentationSpec,
  target: 'react' | 'markdown' | 'application/json' | 'application/xml'
): boolean {
  return presentation.targets.includes(target);
}

// Export singleton engine instance
let engineInstance: TransformEngine | null = null;

export function getTemplateEngine(): TransformEngine {
  if (!engineInstance) {
    engineInstance = createTemplateTransformEngine();
  }
  return engineInstance;
}

export function resetTemplateEngine(): void {
  engineInstance = null;
}
