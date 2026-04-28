export type NativeExamplePreviewKind =
	| 'agent-console'
	| 'ai-chat-assistant'
	| 'analytics-dashboard'
	| 'connections'
	| 'crm-pipeline'
	| 'data-grid-showcase'
	| 'finance-ops-ai-workflows'
	| 'form-showcase'
	| 'generic'
	| 'in-app-docs'
	| 'integration-hub'
	| 'learning-journey'
	| 'marketplace'
	| 'pocket-family-office'
	| 'policy-safe-knowledge-assistant'
	| 'saas-boilerplate'
	| 'video-api-showcase'
	| 'video-docs-terminal'
	| 'visualization-showcase'
	| 'wealth-snapshot'
	| 'workflow-system';

interface RichNativePreviewOverride {
	description: string;
	kind: NativeExamplePreviewKind;
	title: string;
}

const RICH_PREVIEW_BY_KEY = new Map<string, RichNativePreviewOverride>([
	[
		'ai-chat-assistant',
		rich(
			'ai-chat-assistant',
			'Native assistant search preview',
			'Assistant search contract and seeded results rendered with mobile-native cards.'
		),
	],
	[
		'analytics-dashboard',
		rich(
			'analytics-dashboard',
			'Native analytics dashboard preview',
			'Analytics visualization specs and sample series rendered from package exports.'
		),
	],
	[
		'crm-pipeline',
		rich(
			'crm-pipeline',
			'Native CRM pipeline preview',
			'Pipeline stages, deals, companies, and contacts rendered from exported mock data.'
		),
	],
	[
		'agent-console',
		rich(
			'agent-console',
			'AI Agent Console',
			'Shared Agent Console component rendered through the web-to-native UI alias layer.'
		),
	],
	[
		'data-grid-showcase',
		rich(
			'data-grid-showcase',
			'Native DataView table',
			'The data-grid example rendered from its shared DataView contract and rows.'
		),
	],
	[
		'finance-ops-ai-workflows',
		rich(
			'finance-ops-ai-workflows',
			'Native finance workflow preview',
			'Governed finance operations, cash-aging rules, and AI adoption logs rendered as mobile-native summaries.'
		),
	],
	[
		'form-showcase',
		rich(
			'form-showcase',
			'Native form showcase preview',
			'All-field and progressive form templates rendered as mobile-native form summaries.'
		),
	],
	[
		'in-app-docs',
		rich(
			'in-app-docs',
			'Native in-app docs preview',
			'Public DocBlocks rendered as mobile help-center cards.'
		),
	],
	[
		'integration-hub',
		rich(
			'integration-hub',
			'Native integration hub preview',
			'Integration visualization and sync-health specs rendered as native summaries.'
		),
	],
	[
		'marketplace',
		rich(
			'marketplace',
			'Native marketplace preview',
			'Marketplace order, catalog, and activity visualizations rendered from shared specs.'
		),
	],
	[
		'voice-providers',
		rich(
			'connections',
			'Native voice provider connections',
			'Sample voice provider bindings rendered from exported connection data.'
		),
	],
	[
		'meeting-recorder-providers',
		rich(
			'connections',
			'Native meeting recorder providers',
			'Sample meeting recorder provider bindings rendered from exported connection data.'
		),
	],
	[
		'pocket-family-office',
		rich(
			'pocket-family-office',
			'Native family office bindings',
			'Sample tenant, integrations, and knowledge sources rendered in-app.'
		),
	],
	[
		'policy-safe-knowledge-assistant',
		rich(
			'policy-safe-knowledge-assistant',
			'Native policy-safe knowledge preview',
			'Jurisdiction, source, and fixture data rendered from the governed assistant example.'
		),
	],
	[
		'saas-boilerplate',
		rich(
			'saas-boilerplate',
			'Native SaaS boilerplate preview',
			'Projects, subscription, and usage summaries rendered from exported mock data.'
		),
	],
	[
		'video-docs-terminal',
		rich(
			'video-docs-terminal',
			'Native terminal tutorial preview',
			'CLI tutorial scripts rendered from exported video-docs sample definitions.'
		),
	],
	[
		'video-api-showcase',
		rich(
			'video-api-showcase',
			'Native API showcase preview',
			'API video specs rendered from exported sample contract definitions.'
		),
	],
	[
		'visualization-showcase',
		rich(
			'visualization-showcase',
			'Native visualization showcase preview',
			'Canonical visualization specs rendered as mobile-native chart summaries.'
		),
	],
	[
		'wealth-snapshot',
		rich(
			'wealth-snapshot',
			'Native wealth snapshot preview',
			'Accounts, goals, liabilities, and net-worth surfaces rendered as mobile-native finance summaries.'
		),
	],
	[
		'workflow-system',
		rich(
			'workflow-system',
			'Native workflow system preview',
			'Workflow definitions, instances, and approval states rendered from demo scenario data.'
		),
	],
]);

export function getRichPreviewOverride(exampleKey: string) {
	if (exampleKey.startsWith('learning-journey-')) {
		return rich(
			'learning-journey',
			'Native learning journey preview',
			'Learning tracks and steps rendered from exported journey definitions.'
		);
	}

	return RICH_PREVIEW_BY_KEY.get(exampleKey);
}

function rich(
	kind: NativeExamplePreviewKind,
	title: string,
	description: string
): RichNativePreviewOverride {
	return { description, kind, title };
}
