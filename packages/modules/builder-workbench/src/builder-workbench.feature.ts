import { defineFeature } from '@contractspec/lib.contracts-spec/features';

export const BuilderWorkbenchFeature = defineFeature({
	meta: {
		key: 'modules.builder-workbench',
		version: '1.0.0',
		title: 'Builder Workbench',
		description: 'Reusable Builder workbench UI module.',
		domain: 'builder-workbench',
		owners: ['@contractspec-core'],
		tags: ['package', 'modules', 'builder-workbench'],
		stability: 'experimental',
	},
});
