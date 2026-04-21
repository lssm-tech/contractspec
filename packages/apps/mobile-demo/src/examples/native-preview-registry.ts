import {
	type ExamplePreviewSurface,
	getExamplePreviewSurface,
	listDiscoverableExamples,
} from '@contractspec/module.examples/catalog';

export type NativeExamplePreviewKind =
	| 'agent-console'
	| 'ai-chat-assistant'
	| 'analytics-dashboard'
	| 'connections'
	| 'crm-pipeline'
	| 'data-grid-showcase'
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
	| 'workflow-system';

export interface NativeExamplePreviewDefinition {
	key: string;
	title: string;
	description: string;
	kind: NativeExamplePreviewKind;
	route: string;
	rich: boolean;
	surface: ExamplePreviewSurface;
}

const RICH_PREVIEW_BY_KEY = new Map<
	string,
	{
		description: string;
		kind: NativeExamplePreviewKind;
		title: string;
	}
>([
	[
		'ai-chat-assistant',
		{
			kind: 'ai-chat-assistant',
			title: 'Native assistant search preview',
			description:
				'Assistant search contract and seeded results rendered with mobile-native cards.',
		},
	],
	[
		'analytics-dashboard',
		{
			kind: 'analytics-dashboard',
			title: 'Native analytics dashboard preview',
			description:
				'Analytics visualization specs and sample series rendered from package exports.',
		},
	],
	[
		'crm-pipeline',
		{
			kind: 'crm-pipeline',
			title: 'Native CRM pipeline preview',
			description:
				'Pipeline stages, deals, companies, and contacts rendered from exported mock data.',
		},
	],
	[
		'agent-console',
		{
			kind: 'agent-console',
			title: 'AI Agent Console',
			description:
				'Shared Agent Console component rendered through the web-to-native UI alias layer.',
		},
	],
	[
		'data-grid-showcase',
		{
			kind: 'data-grid-showcase',
			title: 'Native DataView table',
			description:
				'The data-grid example rendered from its shared DataView contract and rows.',
		},
	],
	[
		'in-app-docs',
		{
			kind: 'in-app-docs',
			title: 'Native in-app docs preview',
			description: 'Public DocBlocks rendered as mobile help-center cards.',
		},
	],
	[
		'integration-hub',
		{
			kind: 'integration-hub',
			title: 'Native integration hub preview',
			description:
				'Integration visualization and sync-health specs rendered as native summaries.',
		},
	],
	[
		'marketplace',
		{
			kind: 'marketplace',
			title: 'Native marketplace preview',
			description:
				'Marketplace order, catalog, and activity visualizations rendered from shared specs.',
		},
	],
	[
		'voice-providers',
		{
			kind: 'connections',
			title: 'Native voice provider connections',
			description:
				'Sample voice provider bindings rendered from exported connection data.',
		},
	],
	[
		'meeting-recorder-providers',
		{
			kind: 'connections',
			title: 'Native meeting recorder providers',
			description:
				'Sample meeting recorder provider bindings rendered from exported connection data.',
		},
	],
	[
		'pocket-family-office',
		{
			kind: 'pocket-family-office',
			title: 'Native family office bindings',
			description:
				'Sample tenant, integrations, and knowledge sources rendered in-app.',
		},
	],
	[
		'policy-safe-knowledge-assistant',
		{
			kind: 'policy-safe-knowledge-assistant',
			title: 'Native policy-safe knowledge preview',
			description:
				'Jurisdiction, source, and fixture data rendered from the governed assistant example.',
		},
	],
	[
		'saas-boilerplate',
		{
			kind: 'saas-boilerplate',
			title: 'Native SaaS boilerplate preview',
			description:
				'Projects, subscription, and usage summaries rendered from exported mock data.',
		},
	],
	[
		'video-docs-terminal',
		{
			kind: 'video-docs-terminal',
			title: 'Native terminal tutorial preview',
			description:
				'CLI tutorial scripts rendered from exported video-docs sample definitions.',
		},
	],
	[
		'video-api-showcase',
		{
			kind: 'video-api-showcase',
			title: 'Native API showcase preview',
			description:
				'API video specs rendered from exported sample contract definitions.',
		},
	],
	[
		'visualization-showcase',
		{
			kind: 'visualization-showcase',
			title: 'Native visualization showcase preview',
			description:
				'Canonical visualization specs rendered as mobile-native chart summaries.',
		},
	],
	[
		'workflow-system',
		{
			kind: 'workflow-system',
			title: 'Native workflow system preview',
			description:
				'Workflow definitions, instances, and approval states rendered from demo scenario data.',
		},
	],
]);

function getRichPreviewOverride(exampleKey: string) {
	if (exampleKey.startsWith('learning-journey-')) {
		return {
			kind: 'learning-journey' as const,
			title: 'Native learning journey preview',
			description:
				'Learning tracks and steps rendered from exported journey definitions.',
		};
	}

	return RICH_PREVIEW_BY_KEY.get(exampleKey);
}

export function listNativeExamplePreviews(): readonly NativeExamplePreviewDefinition[] {
	return listDiscoverableExamples().flatMap(
		(example): NativeExamplePreviewDefinition[] => {
			const preview = getNativeExamplePreview(example.meta.key);
			return preview ? [preview] : [];
		}
	);
}

export function getNativeExamplePreview(
	exampleKey: string
): NativeExamplePreviewDefinition | undefined {
	const surface = getExamplePreviewSurface(exampleKey);

	if (!surface) {
		return undefined;
	}

	const richPreview = getRichPreviewOverride(surface.key);

	return {
		key: surface.key,
		title: richPreview?.title ?? surface.title,
		description:
			richPreview?.description ??
			'ContractSpec package, surfaces, metadata, and links rendered in-app.',
		kind: richPreview?.kind ?? 'generic',
		route: `/example-preview?exampleKey=${encodeURIComponent(surface.key)}`,
		rich: Boolean(richPreview),
		surface,
	};
}

export function supportsNativeExamplePreview(exampleKey: string): boolean {
	return Boolean(getNativeExamplePreview(exampleKey));
}
