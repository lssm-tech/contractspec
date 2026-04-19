import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const WorkspaceBundle = defineModuleBundle({
	meta: {
		key: 'bundles.workspace',
		version: '1.0.0',
		title: 'Workspace',
		description: 'Workspace utilities for monorepo development',
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
			title: 'Workspace',
			slots: [],
			layouts: [],
			data: [],
			verification: {
				dimensions: {
					guidance: 'Scaffolded guidance profile for Workspace.',
					density: 'Scaffolded density profile for Workspace.',
					dataDepth: 'Scaffolded data-depth profile for Workspace.',
					control: 'Scaffolded control profile for Workspace.',
					media: 'Scaffolded media profile for Workspace.',
					pace: 'Scaffolded pace profile for Workspace.',
					narrative: 'Scaffolded narrative profile for Workspace.',
				},
			},
		},
	},
});
