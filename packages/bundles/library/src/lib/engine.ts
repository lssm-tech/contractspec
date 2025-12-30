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
} from '@contractspec/lib.contracts/presentations';

// Import template renderers
import {
  agentDashboardMarkdownRenderer,
  agentListMarkdownRenderer,
  agentListReactRenderer,
  runListMarkdownRenderer,
  toolRegistryMarkdownRenderer,
} from '../components/templates/agent-console/renderers';
import {
  projectListMarkdownRenderer,
  projectListReactRenderer,
  saasBillingMarkdownRenderer,
  saasDashboardMarkdownRenderer,
} from '../components/templates/saas/renderers';
import {
  crmDashboardMarkdownRenderer,
  crmPipelineMarkdownRenderer,
  crmPipelineReactRenderer,
} from '../components/templates/crm/renderers';
// Phase 2-3 template renderers
import {
  workflowDashboardMarkdownRenderer,
  workflowDefinitionListMarkdownRenderer,
  workflowInstanceDetailMarkdownRenderer,
} from '../components/templates/workflow-system/renderers';
import {
  marketplaceDashboardMarkdownRenderer,
  orderListMarkdownRenderer,
  productCatalogMarkdownRenderer,
} from '../components/templates/marketplace/renderers';
import {
  connectionListMarkdownRenderer,
  integrationDashboardMarkdownRenderer,
  syncConfigMarkdownRenderer,
} from '../components/templates/integration-hub/renderers';
import {
  analyticsDashboardMarkdownRenderer,
  dashboardListMarkdownRenderer,
  queryBuilderMarkdownRenderer,
} from '../components/templates/analytics-dashboard/renderers';

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

  // Workflow System renderers
  engine.register(workflowDashboardMarkdownRenderer);
  engine.register(workflowDefinitionListMarkdownRenderer);
  engine.register(workflowInstanceDetailMarkdownRenderer);

  // Marketplace renderers
  engine.register(marketplaceDashboardMarkdownRenderer);
  engine.register(productCatalogMarkdownRenderer);
  engine.register(orderListMarkdownRenderer);

  // Integration Hub renderers
  engine.register(integrationDashboardMarkdownRenderer);
  engine.register(connectionListMarkdownRenderer);
  engine.register(syncConfigMarkdownRenderer);

  // Analytics Dashboard renderers
  engine.register(analyticsDashboardMarkdownRenderer);
  engine.register(dashboardListMarkdownRenderer);
  engine.register(queryBuilderMarkdownRenderer);
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
