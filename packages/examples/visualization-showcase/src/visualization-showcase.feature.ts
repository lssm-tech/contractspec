import { defineFeature } from '@contractspec/lib.contracts-spec/features';
import { VisualizationShowcaseRefs } from './visualizations';

export const VisualizationShowcaseFeature = defineFeature({
	meta: {
		key: 'visualization-showcase',
		version: '1.0.0',
		title: 'Visualization Showcase',
		description:
			'ContractSpec visualization primitives rendered through shared design-system wrappers.',
		domain: 'ui',
		owners: ['@platform.core'],
		tags: ['visualization', 'charts', 'showcase'],
		stability: 'experimental',
	},
	presentations: [{ key: 'visualization-showcase.gallery', version: '1.0.0' }],
	presentationsTargets: [
		{
			key: 'visualization-showcase.gallery',
			version: '1.0.0',
			targets: ['react', 'markdown'],
		},
	],
	visualizations: VisualizationShowcaseRefs,
	docs: [
		'docs.examples.visualization-showcase',
		'docs.examples.visualization-showcase.goal',
		'docs.examples.visualization-showcase.usage',
	],
});
