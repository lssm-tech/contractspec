import { learningJourneyPresentations } from '@contractspec/example.learning-journey-registry/presentations';
import type { PresentationSpec } from '@contractspec/lib.contracts-spec/presentations';

function createComponentPresentation(
	key: string,
	title: string,
	description: string,
	goal: string,
	context: string,
	componentKey: string
): PresentationSpec {
	return {
		meta: {
			key,
			version: '1.0.0',
			title,
			description,
			stability: 'experimental',
			goal,
			context,
			owners: ['@contractspec/examples'],
			tags: ['template', 'sandbox'],
		},
		source: {
			type: 'component',
			framework: 'react',
			componentKey,
		},
		targets: ['react', 'markdown'],
	};
}

const TEMPLATE_PRESENTATIONS: Record<string, PresentationSpec> = {
	'agent-console.dashboard': createComponentPresentation(
		'agent-console.dashboard',
		'Agent Console Dashboard',
		'Operational dashboard for the agent console example.',
		'Review agent activity, throughput, and execution health.',
		'Sandbox presentation used for markdown previews.',
		'AgentConsoleDashboard'
	),
	'agent-console.agent.list': createComponentPresentation(
		'agent-console.agent.list',
		'Agent List',
		'List of seeded agents in the agent console example.',
		'Browse configured agents and their current capabilities.',
		'Sandbox presentation used for markdown previews.',
		'AgentListView'
	),
	'agent-console.agent.viewList': createComponentPresentation(
		'agent-console.agent.viewList',
		'Agent List',
		'List of seeded agents in the agent console example.',
		'Browse configured agents and their current capabilities.',
		'Sandbox presentation used for markdown previews.',
		'AgentListView'
	),
	'agent-console.run.list': createComponentPresentation(
		'agent-console.run.list',
		'Run List',
		'Execution history for the agent console example.',
		'Inspect recent runs and their outcomes.',
		'Sandbox presentation used for markdown previews.',
		'RunListView'
	),
	'agent-console.tool.list': createComponentPresentation(
		'agent-console.tool.list',
		'Tool Registry',
		'Available tools for the agent console example.',
		'Inspect the tool registry exposed to the seeded agents.',
		'Sandbox presentation used for markdown previews.',
		'ToolRegistryView'
	),
	'agent-console.tool.registry': createComponentPresentation(
		'agent-console.tool.registry',
		'Tool Registry',
		'Available tools for the agent console example.',
		'Inspect the tool registry exposed to the seeded agents.',
		'Sandbox presentation used for markdown previews.',
		'ToolRegistryView'
	),
	'analytics-dashboard.dashboard': createComponentPresentation(
		'analytics-dashboard.dashboard',
		'Analytics Dashboard',
		'Dashboard view for the analytics example.',
		'Review saved widgets and query-backed dashboards.',
		'Sandbox presentation used for markdown previews.',
		'AnalyticsDashboard'
	),
	'analytics-dashboard.list': createComponentPresentation(
		'analytics-dashboard.list',
		'Dashboard List',
		'List view for analytics dashboards.',
		'Browse dashboards available in the analytics example.',
		'Sandbox presentation used for markdown previews.',
		'DashboardList'
	),
	'analytics-dashboard.query.builder': createComponentPresentation(
		'analytics-dashboard.query.builder',
		'Query Builder',
		'Query authoring surface for the analytics example.',
		'Inspect reusable queries that power dashboards.',
		'Sandbox presentation used for markdown previews.',
		'QueryBuilder'
	),
	'crm-pipeline.dashboard': createComponentPresentation(
		'crm-pipeline.dashboard',
		'CRM Dashboard',
		'Dashboard for the CRM pipeline example.',
		'Track pipeline health and revenue progress.',
		'Sandbox presentation used for markdown previews.',
		'CrmDashboard'
	),
	'crm-pipeline.deal.pipeline': createComponentPresentation(
		'crm-pipeline.deal.pipeline',
		'Pipeline Kanban',
		'Pipeline board for the CRM pipeline example.',
		'Review deal flow across pipeline stages.',
		'Sandbox presentation used for markdown previews.',
		'PipelineKanbanView'
	),
	'integration-hub.connection.list': createComponentPresentation(
		'integration-hub.connection.list',
		'Connection List',
		'Connected systems in the integration hub example.',
		'Review connected systems and connection health.',
		'Sandbox presentation used for markdown previews.',
		'ConnectionList'
	),
	'integration-hub.dashboard': createComponentPresentation(
		'integration-hub.dashboard',
		'Integration Dashboard',
		'Operational dashboard for the integration hub example.',
		'Monitor integration mix, connection health, and sync issues.',
		'Sandbox presentation used for markdown previews.',
		'IntegrationDashboard'
	),
	'integration-hub.sync.config': createComponentPresentation(
		'integration-hub.sync.config',
		'Sync Configuration',
		'Sync configuration surface for the integration hub example.',
		'Inspect sync configuration and field mapping defaults.',
		'Sandbox presentation used for markdown previews.',
		'SyncConfigEditor'
	),
	'marketplace.dashboard': createComponentPresentation(
		'marketplace.dashboard',
		'Marketplace Dashboard',
		'Dashboard for the marketplace example.',
		'Review order flow, category mix, and revenue summaries.',
		'Sandbox presentation used for markdown previews.',
		'MarketplaceDashboard'
	),
	'marketplace.order.list': createComponentPresentation(
		'marketplace.order.list',
		'Order List',
		'Order list for the marketplace example.',
		'Inspect order activity and fulfillment state.',
		'Sandbox presentation used for markdown previews.',
		'OrderList'
	),
	'marketplace.product.catalog': createComponentPresentation(
		'marketplace.product.catalog',
		'Product Catalog',
		'Product catalog for the marketplace example.',
		'Browse the available products and merchandising data.',
		'Sandbox presentation used for markdown previews.',
		'ProductCatalog'
	),
	'saas-boilerplate.billing.settings': createComponentPresentation(
		'saas-boilerplate.billing.settings',
		'Billing Settings',
		'Subscription and usage settings for the SaaS example.',
		'Review billing configuration and current subscription data.',
		'Sandbox presentation used for markdown previews.',
		'SubscriptionView'
	),
	'saas-boilerplate.dashboard': createComponentPresentation(
		'saas-boilerplate.dashboard',
		'SaaS Dashboard',
		'Dashboard for the SaaS boilerplate example.',
		'Review account, project, and billing summaries.',
		'Sandbox presentation used for markdown previews.',
		'SaasDashboard'
	),
	'saas-boilerplate.project.list': createComponentPresentation(
		'saas-boilerplate.project.list',
		'Project List',
		'Project list for the SaaS boilerplate example.',
		'Browse projects and their current lifecycle state.',
		'Sandbox presentation used for markdown previews.',
		'ProjectListView'
	),
	'visualization-showcase.gallery': createComponentPresentation(
		'visualization-showcase.gallery',
		'Visualization Showcase',
		'Focused showcase of ContractSpec visualization primitives.',
		'Review the canonical visualization catalog and design-system wrappers.',
		'Sandbox presentation used for markdown previews.',
		'VisualizationShowcase'
	),
	'workflow-system.dashboard': createComponentPresentation(
		'workflow-system.dashboard',
		'Workflow Dashboard',
		'Dashboard for the workflow system example.',
		'Review workflow instance health and workload metrics.',
		'Sandbox presentation used for markdown previews.',
		'WorkflowDashboard'
	),
	'workflow-system.definition.list': createComponentPresentation(
		'workflow-system.definition.list',
		'Workflow Definition List',
		'Workflow definitions in the workflow system example.',
		'Browse available workflow definitions.',
		'Sandbox presentation used for markdown previews.',
		'WorkflowDefinitionList'
	),
	'workflow-system.instance.detail': createComponentPresentation(
		'workflow-system.instance.detail',
		'Workflow Instance Detail',
		'Workflow instance details in the workflow system example.',
		'Inspect the state and approvals for a workflow instance.',
		'Sandbox presentation used for markdown previews.',
		'WorkflowInstanceDetail'
	),
	...Object.fromEntries(
		learningJourneyPresentations.map((presentation) => [
			presentation.meta.key,
			presentation,
		])
	),
};

export function resolveTemplatePresentation(
	presentationName: string
): PresentationSpec | undefined {
	return TEMPLATE_PRESENTATIONS[presentationName];
}
