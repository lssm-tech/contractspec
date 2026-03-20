import { defineFeature } from '@contractspec/lib.contracts-spec';

export const OpenCodeCliFeature = defineFeature({
	meta: {
		key: 'opencode-cli',
		version: '1.0.0',
		title: 'OpenCode CLI Example',
		description:
			'Agent-mode contract building and validation for the OpenCode CLI',
		domain: 'example',
		owners: ['@contractspec/examples'],
		tags: ['opencode', 'example', 'cli'],
		stability: 'stable',
	},

	operations: [{ key: 'opencode.example.echo', version: '1.0.0' }],
});
