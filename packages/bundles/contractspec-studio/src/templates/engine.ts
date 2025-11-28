/**
 * Template TransformEngine Setup
 *
 * Creates and configures a TransformEngine instance with all template-specific
 * renderers for React and Markdown targets.
 */
import {
  createDefaultTransformEngine,
  registerBasicValidation,
  registerDefaultReactRenderer,
  type TransformEngine,
} from '@lssm/lib.contracts/presentations.v2';

// Import template renderers
import {
  agentListMarkdownRenderer,
  agentListReactRenderer,
  runListMarkdownRenderer,
  toolRegistryMarkdownRenderer,
  agentDashboardMarkdownRenderer,
} from '../presentation/components/templates/agent-console/renderers';
import {
  projectListMarkdownRenderer,
  projectListReactRenderer,
  saasDashboardMarkdownRenderer,
  saasBillingMarkdownRenderer,
} from '../presentation/components/templates/saas/renderers';
import {
  crmPipelineMarkdownRenderer,
  crmPipelineReactRenderer,
  crmDashboardMarkdownRenderer,
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
 *
 * Custom markdown renderers are registered here and will be tried AFTER
 * the default schema-driven renderer. Each custom renderer is responsible
 * for checking if it handles the specific presentation (via componentKey)
 * and throwing if not, allowing the next renderer in the chain to try.
 */
function registerTemplateRenderers(engine: TransformEngine): void {
  // Agent Console renderers
  engine.register(agentListReactRenderer);
  engine.register(agentListMarkdownRenderer);
  engine.register(runListMarkdownRenderer);
  engine.register(toolRegistryMarkdownRenderer);
  engine.register(agentDashboardMarkdownRenderer);

  // SaaS Boilerplate renderers
  engine.register(projectListReactRenderer);
  engine.register(projectListMarkdownRenderer);
  engine.register(saasDashboardMarkdownRenderer);
  engine.register(saasBillingMarkdownRenderer);

  // CRM Pipeline renderers
  engine.register(crmPipelineReactRenderer);
  engine.register(crmPipelineMarkdownRenderer);
  engine.register(crmDashboardMarkdownRenderer);
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
