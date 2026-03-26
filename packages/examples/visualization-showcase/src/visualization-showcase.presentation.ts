import {
	definePresentation,
	StabilityEnum,
} from '@contractspec/lib.contracts-spec';

export const VisualizationShowcasePresentation = definePresentation({
	meta: {
		key: 'visualization-showcase.gallery',
		version: '1.0.0',
		title: 'Visualization Showcase',
		description: 'Focused showcase of ContractSpec visualization primitives.',
		domain: 'ui',
		owners: ['@platform.core'],
		tags: ['visualization', 'charts', 'showcase'],
		stability: StabilityEnum.Experimental,
		goal: 'Review the canonical visualization catalog and design-system wrappers.',
		context: 'Sandbox presentation used for react and markdown previews.',
	},
	source: {
		type: 'component',
		framework: 'react',
		componentKey: 'VisualizationShowcase',
	},
	targets: ['react', 'markdown'],
});
