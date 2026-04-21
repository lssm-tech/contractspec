import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const AlpicBundle = defineModuleBundle({
	meta: {
		key: 'bundles.alpic',
		version: '1.0.0',
		title: 'Alpic',
		description: 'Alpic MCP server and ChatGPT App hosting bundle',
	},
	routes: [
		{
			routeId: 'default',
			path: '/',
			defaultSurface: 'main',
		},
	],
	surfaces: {
		main: {
			surfaceId: 'main',
			kind: 'workbench',
			title: 'Alpic',
			slots: [],
			layouts: [],
			data: [],
			verification: {
				dimensions: {
					guidance: 'Scaffolded guidance profile for Alpic.',
					density: 'Scaffolded density profile for Alpic.',
					dataDepth: 'Scaffolded data-depth profile for Alpic.',
					control: 'Scaffolded control profile for Alpic.',
					media: 'Scaffolded media profile for Alpic.',
					pace: 'Scaffolded pace profile for Alpic.',
					narrative: 'Scaffolded narrative profile for Alpic.',
				},
			},
		},
	},
});
