import type { LandingPageContent } from './landing-content.types';

export const referenceLandingPages: readonly LandingPageContent[] = [
	{
		key: 'docs',
		path: '/docs',
		kicker: 'Documentation',
		title: 'Find the right ContractSpec adoption path.',
		description:
			'The docs explain installation, core specs, generated surfaces, governance, integrations, and when Studio belongs on top.',
		heroCtas: [
			{
				id: 'open-docs-web',
				label: 'Open full docs',
				href: '/docs',
				kind: 'internal',
				variant: 'primary',
			},
			{
				id: 'open-install',
				label: 'Installation',
				href: '/install',
				kind: 'internal',
				variant: 'ghost',
			},
		],
		sections: [
			{
				id: 'docs-sections',
				kicker: 'Primary sections',
				title: 'Start, build, operate, and reference.',
				items: [
					{
						title: 'Start',
						description:
							'Install ContractSpec, wire a first contract, and adopt incrementally.',
						iconKey: 'arrow-right',
					},
					{
						title: 'Core model',
						description:
							'Learn contracts, generated surfaces, policies, overlays, and regeneration.',
						iconKey: 'braces',
					},
					{
						title: 'Operate',
						description:
							'Run governance, auditability, tracing, and operator-grade controls.',
						iconKey: 'shield-check',
					},
				],
			},
		],
	},
	{
		key: 'changelog',
		path: '/changelog',
		kicker: 'Changelog',
		title: 'Follow releases, templates, and Studio updates.',
		description:
			'The changelog tracks release notes, public package changes, migration notes, and evidence-backed release capsules.',
		heroCtas: [
			{
				id: 'open-changelog-web',
				label: 'Open changelog',
				href: '/changelog',
				kind: 'internal',
				variant: 'primary',
			},
			{
				id: 'open-llms',
				label: 'LLM guide',
				href: '/llms.txt',
				kind: 'internal',
				variant: 'ghost',
			},
		],
		sections: [
			{
				id: 'release-evidence',
				kicker: 'Release evidence',
				title: 'Every meaningful release should leave a trail.',
				items: [
					{
						title: 'Patch notes',
						description:
							'Human-readable package changes for customers and maintainers.',
						iconKey: 'git-branch',
					},
					{
						title: 'Release capsules',
						description:
							'Structured impact, migration, validation, and evidence metadata.',
						iconKey: 'shield-check',
					},
				],
			},
		],
	},
] as const;
