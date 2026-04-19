import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const ProductIntentBundle = defineModuleBundle({
	meta: {
		key: 'bundles.product-intent',
		version: '1.0.0',
		title: 'Product Intent',
		description: 'Product intent bundle with AI runner and evidence retriever',
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
			title: 'Product Intent',
			slots: [],
			layouts: [],
			data: [],
			verification: {
				dimensions: {
					guidance: 'Scaffolded guidance profile for Product Intent.',
					density: 'Scaffolded density profile for Product Intent.',
					dataDepth: 'Scaffolded data-depth profile for Product Intent.',
					control: 'Scaffolded control profile for Product Intent.',
					media: 'Scaffolded media profile for Product Intent.',
					pace: 'Scaffolded pace profile for Product Intent.',
					narrative: 'Scaffolded narrative profile for Product Intent.',
				},
			},
		},
	},
});
