/**
 * Template TransformEngine Setup
 *
 * Creates and configures a TransformEngine for rendering template presentations
 * to multiple targets (React, Markdown, JSON).
 */
import {
  TransformEngine,
  createDefaultTransformEngine,
  registerDefaultReactRenderer,
  registerBasicValidation,
  type PresentationDescriptorV2,
  type PresentationRenderer,
} from '@lssm/lib.contracts';

// Import presentations from examples
import { AgentConsolePresentations } from '@lssm/example.agent-console/presentations';
import { SaasBoilerplatePresentations } from '@lssm/example.saas-boilerplate/presentations';
import { CrmPipelinePresentations } from '@lssm/example.crm-pipeline/presentations';

/**
 * All registered presentation descriptors
 */
export const allPresentations: PresentationDescriptorV2[] = [
  ...AgentConsolePresentations,
  ...SaasBoilerplatePresentations,
  ...CrmPipelinePresentations,
];

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
 * Get a presentation descriptor by name and version
 */
export function getPresentation(
  name: string,
  version: number
): PresentationDescriptorV2 | undefined {
  return allPresentations.find(
    (p) => p.meta.name === name && p.meta.version === version
  );
}

/**
 * Get all presentations for a given domain
 */
export function getPresentationsByDomain(domain: string): PresentationDescriptorV2[] {
  return allPresentations.filter((p) => p.meta.domain === domain);
}

/**
 * Check if a presentation supports a given target
 */
export function supportsTarget(
  presentation: PresentationDescriptorV2,
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

