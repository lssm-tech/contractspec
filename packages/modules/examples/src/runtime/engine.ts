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
} from '@contractspec/lib.contracts/presentations/transform-engine';

// Import template renderers from example packages
import {
  agentDashboardMarkdownRenderer,
  agentListMarkdownRenderer,
  agentListReactRenderer,
  runListMarkdownRenderer,
  toolRegistryMarkdownRenderer,
} from '@contractspec/example.agent-console';

import {
  projectListMarkdownRenderer,
  projectListReactRenderer,
  saasBillingMarkdownRenderer,
  saasDashboardMarkdownRenderer,
} from '@contractspec/example.saas-boilerplate';

import {
  crmDashboardMarkdownRenderer,
  crmPipelineMarkdownRenderer,
  crmPipelineReactRenderer,
} from '@contractspec/example.crm-pipeline';

import {
  workflowDashboardMarkdownRenderer,
  workflowDefinitionListMarkdownRenderer,
  workflowInstanceDetailMarkdownRenderer,
} from '@contractspec/example.workflow-system';

import {
  marketplaceDashboardMarkdownRenderer,
  orderListMarkdownRenderer,
  productCatalogMarkdownRenderer,
} from '@contractspec/example.marketplace';

import {
  connectionListMarkdownRenderer,
  integrationDashboardMarkdownRenderer,
  syncConfigMarkdownRenderer,
} from '@contractspec/example.integration-hub';

import {
  analyticsDashboardMarkdownRenderer,
  dashboardListMarkdownRenderer,
  queryBuilderMarkdownRenderer,
} from '@contractspec/example.analytics-dashboard';

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
