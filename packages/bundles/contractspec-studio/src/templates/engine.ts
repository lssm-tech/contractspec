/**
 * Template TransformEngine Setup
 *
 * Creates and configures a TransformEngine instance with all template-specific
 * renderers for React and Markdown targets.
 */
import {
  createDefaultTransformEngine,
  registerDefaultReactRenderer,
  registerBasicValidation,
  type TransformEngine,
} from '@lssm/lib.contracts';

// Import template renderers
import {
  agentListReactRenderer,
  agentListMarkdownRenderer,
  runListMarkdownRenderer,
  toolRegistryMarkdownRenderer,
} from '../presentation/components/templates/agent-console/renderers';
import {
  projectListReactRenderer,
  projectListMarkdownRenderer,
} from '../presentation/components/templates/saas/renderers';
import {
  crmPipelineReactRenderer,
  crmPipelineMarkdownRenderer,
} from '../presentation/components/templates/crm/renderers';

/**
 * Create a TransformEngine configured for template rendering
 */
export function createTemplateTransformEngine(): TransformEngine {
  const engine = createDefaultTransformEngine();

  // Register default renderers
  registerDefaultReactRenderer(engine);
  registerBasicValidation(engine);

  // Register template-specific renderers
  registerTemplateRenderers(engine);

  return engine;
}

/**
 * Register all template-specific renderers
 */
function registerTemplateRenderers(engine: TransformEngine): void {
  // Agent Console renderers
  engine.register(agentListReactRenderer);
  engine.register(agentListMarkdownRenderer);
  engine.register(runListMarkdownRenderer);
  engine.register(toolRegistryMarkdownRenderer);

  // SaaS Boilerplate renderers
  engine.register(projectListReactRenderer);
  engine.register(projectListMarkdownRenderer);

  // CRM Pipeline renderers
  engine.register(crmPipelineReactRenderer);
  engine.register(crmPipelineMarkdownRenderer);
}

/**
 * Singleton instance for shared engine
 */
let templateEngine: TransformEngine | null = null;

/**
 * Get or create the shared template engine instance
 */
export function getTemplateEngine(): TransformEngine {
  if (!templateEngine) {
    templateEngine = createTemplateTransformEngine();
  }
  return templateEngine;
}

/**
 * Reset the shared engine (useful for testing)
 */
export function resetTemplateEngine(): void {
  templateEngine = null;
}
