import { defineModuleBundle } from '@contractspec/lib.surface-runtime/spec';

export const MarketingBundle = defineModuleBundle({
	meta: {
		key: 'bundles.marketing',
		version: '1.0.0',
		title: 'Marketing',
		description:
			'ContractSpec package declaration for @contractspec/bundle.marketing.',
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
			title: 'Marketing',
			slots: [],
			layouts: [],
			data: [],
			verification: {
				dimensions: {
					guidance: 'Scaffolded guidance profile for Marketing.',
					density: 'Scaffolded density profile for Marketing.',
					dataDepth: 'Scaffolded data-depth profile for Marketing.',
					control: 'Scaffolded control profile for Marketing.',
					media: 'Scaffolded media profile for Marketing.',
					pace: 'Scaffolded pace profile for Marketing.',
					narrative: 'Scaffolded narrative profile for Marketing.',
				},
			},
		},
	},
});
