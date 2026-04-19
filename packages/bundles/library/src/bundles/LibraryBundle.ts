import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const LibraryBundle = defineModuleBundle({
	meta: {
		key: 'bundles.library',
		version: '1.0.0',
		title: 'Library',
		description:
			'ContractSpec package declaration for @contractspec/bundle.library.',
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
			title: 'Library',
			slots: [],
			layouts: [],
			data: [],
			verification: {
				dimensions: {
					guidance: 'Scaffolded guidance profile for Library.',
					density: 'Scaffolded density profile for Library.',
					dataDepth: 'Scaffolded data-depth profile for Library.',
					control: 'Scaffolded control profile for Library.',
					media: 'Scaffolded media profile for Library.',
					pace: 'Scaffolded pace profile for Library.',
					narrative: 'Scaffolded narrative profile for Library.',
				},
			},
		},
	},
});
