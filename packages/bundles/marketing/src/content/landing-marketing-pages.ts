import { contractspecLandingStory } from './landing-content';
import type { LandingPageContent } from './landing-content.types';
import { startOssCta, studioCta } from './landing-shared-ctas';

export const marketingLandingPages: readonly LandingPageContent[] = [
	{
		key: 'product',
		path: '/product',
		kicker: 'Product overview',
		title: 'An open system for keeping AI-native products coherent.',
		description:
			'ContractSpec is the explicit layer that lets teams define behavior, keep surfaces aligned, regenerate safely, and move into Studio when they want the operating product.',
		heroCtas: [startOssCta, studioCta],
		sections: [
			{
				id: 'layers',
				kicker: 'Architecture by layer',
				title: 'Each layer exists to keep the next one from drifting.',
				description:
					'Lower layers define explicit behavior; higher layers compose that behavior into working surfaces.',
				items: [
					{
						title: 'Contracts and specs',
						description:
							'The canonical product rules your team wants the system to keep respecting.',
						iconKey: 'braces',
					},
					{
						title: 'Runtime bridges',
						description:
							'Adapters turn rules into API, UI, data, event, MCP, and client surfaces.',
						iconKey: 'workflow',
					},
					{
						title: 'Harness and proof',
						description:
							'Inspection, replay, evaluation, and evidence show whether automation is safe.',
						iconKey: 'chart-column',
					},
					{
						title: 'Studio operating product',
						description:
							'The team workflow for evidence, drafts, review, exports, and checks.',
						iconKey: 'sparkles',
					},
				],
			},
			{
				id: 'proofs',
				kicker: 'Proof points',
				title: 'What should feel different after adoption.',
				items: [
					{
						title: 'Explicit contracts, not inferred conventions',
						description: 'The team can inspect and change the rules directly.',
						iconKey: 'shield-check',
					},
					{
						title: 'Standard outputs the team owns',
						description: 'Generated surfaces stay legible and editable.',
						iconKey: 'blocks',
					},
				],
			},
		],
		finalCta: contractspecLandingStory.finalCta,
	},
	{
		key: 'templates',
		path: '/templates',
		kicker: 'Proof through real scenarios',
		title: 'Templates that show the open system in practice.',
		description:
			'Scenario templates are the fastest way to understand explicit contracts, aligned surfaces, and the path from OSS exploration into Studio deployment.',
		heroCtas: [
			{
				id: 'open-templates-web',
				label: 'Open templates',
				href: '/templates',
				kind: 'internal',
				variant: 'primary',
			},
			studioCta,
		],
		stats: [
			{ value: 'OSS', label: 'first, Studio second' },
			{ value: 'Real', label: 'scenario coverage' },
		],
		sections: [
			{
				id: 'template-path',
				kicker: 'From template to real system',
				title: 'Start with a scenario, then harden the contract.',
				items: [
					{
						title: 'Explore the shape',
						description:
							'Use templates to prove base flows before committing to architecture.',
						iconKey: 'blocks',
					},
					{
						title: 'Add integrations',
						description:
							'Layer providers, storage, workflows, and agent-facing surfaces deliberately.',
						iconKey: 'workflow',
					},
				],
			},
		],
	},
	{
		key: 'pricing',
		path: '/pricing',
		kicker: 'Packaging, not upsell fog',
		title:
			'The open system is how teams start. Studio is how some teams operate.',
		description:
			'The OSS layer is the open foundation. Studio is the paid operating surface when a team wants a packaged workflow on top.',
		heroCtas: [startOssCta, studioCta],
		sections: [
			{
				id: 'packages',
				kicker: 'Current packaging',
				title: 'Pick the side that matches your current work.',
				items: [
					{
						title: 'OSS/Core',
						description:
							'Contracts, generation, runtime adapters, harnesses, and agent tooling remain open.',
						iconKey: 'braces',
					},
					{
						title: 'Studio',
						description:
							'A packaged operating loop for evidence, drafting, review, exports, and follow-up.',
						iconKey: 'sparkles',
					},
				],
			},
		],
	},
] as const;
