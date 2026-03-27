'use client';

import {
	type TemplateId,
	TemplateShell,
} from '@contractspec/lib.example-shared-ui';
import { LoadingSpinner } from '@contractspec/lib.ui-kit-web/ui/atoms/LoadingSpinner';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

const SaasDashboard = dynamic(
	() =>
		import('@contractspec/example.saas-boilerplate').then(
			(module) => module.SaasDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const CrmDashboard = dynamic(
	() =>
		import('@contractspec/example.crm-pipeline').then(
			(module) => module.CrmDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const DataGridShowcase = dynamic(
	() =>
		import('@contractspec/example.data-grid-showcase/ui').then(
			(module) => module.DataGridShowcase
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const VisualizationShowcase = dynamic(
	() =>
		import('@contractspec/example.visualization-showcase/ui').then(
			(module) => module.VisualizationShowcase
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const AgentDashboard = dynamic(
	() =>
		import('@contractspec/example.agent-console/ui').then(
			(module) => module.AgentDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const AiChatAssistantDashboard = dynamic(
	() =>
		import('@contractspec/example.ai-chat-assistant').then(
			(module) => module.AiChatAssistantDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const WorkflowDashboard = dynamic(
	() =>
		import('@contractspec/example.workflow-system/ui').then(
			(module) => module.WorkflowDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const MarketplaceDashboard = dynamic(
	() =>
		import('@contractspec/example.marketplace/ui').then(
			(module) => module.MarketplaceDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const IntegrationDashboard = dynamic(
	() =>
		import('@contractspec/example.integration-hub/ui').then(
			(module) => module.IntegrationDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

const AnalyticsDashboard = dynamic(
	() =>
		import('@contractspec/example.analytics-dashboard').then(
			(module) => module.AnalyticsDashboard
		),
	{ ssr: false, loading: () => <LoadingSpinner /> }
);

interface PreviewDefinition {
	title: string;
	description: string;
	component: ComponentType;
}

const PREVIEW_DEFINITIONS: Partial<Record<TemplateId, PreviewDefinition>> = {
	'saas-boilerplate': {
		title: 'SaaS Boilerplate',
		description:
			'Multi-tenant organizations, projects, settings, and billing usage tracking.',
		component: SaasDashboard,
	},
	'crm-pipeline': {
		title: 'CRM Pipeline',
		description:
			'Sales CRM with contacts, companies, deals, and pipeline stages.',
		component: CrmDashboard,
	},
	'data-grid-showcase': {
		title: 'Data Grid Showcase',
		description:
			'Shared ContractSpec table primitives with client, server, and DataView-driven lanes.',
		component: DataGridShowcase,
	},
	'visualization-showcase': {
		title: 'Visualization Showcase',
		description:
			'ContractSpec-owned chart primitives rendered through shared visualization contracts and design-system wrappers.',
		component: VisualizationShowcase,
	},
	'agent-console': {
		title: 'AI Agent Console',
		description:
			'AI agent orchestration with tools, agents, runs, and execution logs.',
		component: AgentDashboard,
	},
	'ai-chat-assistant': {
		title: 'AI Chat Assistant',
		description:
			'Focused assistant surface with reasoning, sources, suggestions, and MCP-aware tools.',
		component: AiChatAssistantDashboard,
	},
	'workflow-system': {
		title: 'Workflow System',
		description: 'Multi-step workflows with role-based approvals.',
		component: WorkflowDashboard,
	},
	marketplace: {
		title: 'Marketplace',
		description:
			'Two-sided marketplace with stores, products, orders, and payouts.',
		component: MarketplaceDashboard,
	},
	'integration-hub': {
		title: 'Integration Hub',
		description:
			'Third-party integrations with connections, sync configs, and field mapping.',
		component: IntegrationDashboard,
	},
	'analytics-dashboard': {
		title: 'Analytics Dashboard',
		description: 'Custom dashboards with widgets and queries.',
		component: AnalyticsDashboard,
	},
};

export interface TemplatePreviewContentProps {
	templateId: TemplateId;
}

export function TemplatePreviewContent({
	templateId,
}: TemplatePreviewContentProps) {
	const preview = PREVIEW_DEFINITIONS[templateId];

	if (!preview) {
		return null;
	}

	const PreviewComponent = preview.component;

	return (
		<TemplateShell
			title={preview.title}
			description={preview.description}
			showSaveAction={false}
		>
			<PreviewComponent />
		</TemplateShell>
	);
}
