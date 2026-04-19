import type { OnboardingTrackDefinition } from './types';

export const ONBOARDING_TRACKS: readonly OnboardingTrackDefinition[] = [
	{
		id: 'contracts',
		title: 'Contracts',
		summary: 'Author and validate spec-first contracts before implementation.',
		description:
			'Use ContractSpec contracts as the durable source of truth for operations, events, presentations, and validation.',
		reuseFamily: 'contracts',
		adoptionQuery:
			'contract operation event policy presentation spec-first contracts',
		primaryDocsRoute: '/docs/getting-started/start-here',
		secondaryDocsRoutes: [
			'/docs/guides/spec-validation-and-typing',
			'/docs/guides/generate-docs-clients-schemas',
		],
		packages: ['@contractspec/lib.contracts-spec', '@contractspec/lib.schema'],
		recommendedCommands: [
			'contractspec create --type operation',
			'contractspec generate',
			'contractspec validate',
			'contractspec ci',
		],
		starterExample: {
			key: 'minimal',
			packageRef: '@contractspec/example.minimal',
			title: 'Minimal',
			summary:
				'Smallest reference implementation for baseline ContractSpec usage.',
		},
		connectSurfaces: ['cli', 'contract', 'runtime'],
	},
	{
		id: 'ui-design',
		title: 'UI Design',
		summary: 'Adopt the design system and contract-backed theming flow.',
		description:
			'Use ThemeSpec, the design system, and composed UI surfaces instead of ad-hoc theme files or raw primitives.',
		reuseFamily: 'ui',
		adoptionQuery: 'ui design system theme tokens composed controls themes',
		adoptionPlatform: 'web',
		primaryDocsRoute: '/docs/tech/contracts/themes',
		secondaryDocsRoutes: [
			'/docs/guides/first-module-bundle',
			'/docs/getting-started/installation',
		],
		packages: [
			'@contractspec/lib.design-system',
			'@contractspec/lib.surface-runtime',
		],
		recommendedCommands: [
			'contractspec create --type theme',
			'contractspec generate',
			'contractspec validate',
		],
		starterExample: {
			key: 'data-grid-showcase',
			packageRef: '@contractspec/example.data-grid-showcase',
			title: 'Data Grid Showcase',
			summary:
				'Reference app for composed design-system tables and contract-backed UI rendering.',
		},
		connectSurfaces: ['cli', 'runtime', 'ui'],
	},
	{
		id: 'knowledge',
		title: 'Knowledge',
		summary: 'Model trusted knowledge spaces, sources, and retrieval flows.',
		description:
			'Use knowledge spaces, bindings, and governed retrieval instead of prompt-only context injection.',
		reuseFamily: 'sharedLibs',
		adoptionQuery:
			'knowledge spaces sources bindings retrieval canon ingestion assistant',
		primaryDocsRoute: '/docs/knowledge',
		secondaryDocsRoutes: ['/docs/knowledge/spaces', '/docs/knowledge/examples'],
		packages: ['@contractspec/lib.knowledge', '@contractspec/lib.ai-agent'],
		recommendedCommands: [
			'contractspec create --type knowledge',
			'contractspec validate',
			'contractspec connect adoption resolve --family sharedLibs --stdin',
		],
		starterExample: {
			key: 'knowledge-canon',
			packageRef: '@contractspec/example.knowledge-canon',
			title: 'Knowledge Canon',
			summary:
				'Minimal contract-first knowledge space example with bindings and source samples.',
		},
		advancedExample: {
			key: 'policy-safe-knowledge-assistant',
			packageRef: '@contractspec/example.policy-safe-knowledge-assistant',
			title: 'Policy-Safe Knowledge Assistant',
			summary:
				'End-to-end governed knowledge assistant with policy, locale, and learning flows.',
		},
		connectSurfaces: ['cli', 'knowledge', 'mcp', 'runtime'],
	},
	{
		id: 'ai-agents',
		title: 'AI Agents',
		summary: 'Define agents, tools, approvals, and MCP-aware execution.',
		description:
			'Use the ContractSpec agent runtime and agent specs instead of ad-hoc prompt wrappers.',
		reuseFamily: 'sharedLibs',
		adoptionQuery:
			'ai agent tools approvals mcp orchestration unified agent runtime',
		primaryDocsRoute: '/docs/libraries/ai-agent',
		secondaryDocsRoutes: ['/docs/advanced/mcp', '/docs/getting-started/cli'],
		packages: [
			'@contractspec/lib.ai-agent',
			'@contractspec/lib.contracts-spec',
		],
		recommendedCommands: [
			'contractspec create --type agent',
			'contractspec agent export --spec <path> --format opencode',
			'contractspec validate',
		],
		starterExample: {
			key: 'agent-console',
			packageRef: '@contractspec/example.agent-console',
			title: 'Agent Console',
			summary:
				'Reference autonomous-agent workspace with runs, tools, metrics, and replay.',
		},
		connectSurfaces: ['agent', 'cli', 'mcp', 'runtime'],
	},
	{
		id: 'learning-journey',
		title: 'Learning Journey',
		summary:
			'Guide users through milestones, progression, and adaptive journeys.',
		description:
			'Use the learning-journey module and example family for structured onboarding and progression flows.',
		reuseFamily: 'solutions',
		adoptionQuery:
			'learning journey onboarding progression coaching drills guided wizard',
		primaryDocsRoute: '/docs/guides/first-module-bundle',
		secondaryDocsRoutes: ['/docs/getting-started/start-here'],
		packages: [
			'@contractspec/module.learning-journey',
			'@contractspec/lib.surface-runtime',
		],
		recommendedCommands: [
			'contractspec examples list --query learning-journey',
			'contractspec validate',
			'contractspec doctor',
		],
		starterExample: {
			key: 'learning-journey-ui-onboarding',
			packageRef: '@contractspec/example.learning-journey-ui-onboarding',
			title: 'Learning Journey UI Onboarding',
			summary: 'Checklist- and journey-map-based onboarding mini app.',
		},
		advancedExample: {
			key: 'learning-journey-registry',
			packageRef: '@contractspec/example.learning-journey-registry',
			title: 'Learning Journey Registry',
			summary:
				'Registry and template aggregation surface for broader learning-journey compositions.',
		},
		connectSurfaces: ['cli', 'runtime', 'solution'],
	},
] as const;

export function listOnboardingTracks(): readonly OnboardingTrackDefinition[] {
	return ONBOARDING_TRACKS;
}

export function getOnboardingTrack(trackId: string) {
	return ONBOARDING_TRACKS.find((track) => track.id === trackId);
}
