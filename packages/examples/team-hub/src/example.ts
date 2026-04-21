import { defineExample } from '@contractspec/lib.contracts-spec/examples';

const ExamplesTeamHubExample = defineExample({
	meta: {
		key: 'examples.team-hub',
		version: '1.0.0',
		title: 'Team Hub',
		description:
			'Team Hub example with spaces, tasks, rituals, and announcements',
		kind: 'template',
		visibility: 'experimental',
		stability: 'experimental',
		owners: ['@contractspec-core'],
		tags: ['package', 'examples', 'team-hub'],
	},
	surfaces: {
		templates: true,
		sandbox: { enabled: true, modes: ['playground', 'specs'] },
		studio: { enabled: false, installable: false },
		mcp: { enabled: false },
	},
	entrypoints: {
		packageName: '@contractspec/example.team-hub',
	},
});

export default ExamplesTeamHubExample;
export { ExamplesTeamHubExample };
