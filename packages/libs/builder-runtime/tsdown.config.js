import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
	...moduleLibrary,
	platform: 'neutral',
	entry: [
		'src/index.ts',
		'src/fusion/index.ts',
		'src/ingestion/index.ts',
		'src/planning/index.ts',
		'src/preview/index.ts',
		'src/readiness/index.ts',
		'src/replay/index.ts',
		'src/stores/index.ts',
	],
}));
