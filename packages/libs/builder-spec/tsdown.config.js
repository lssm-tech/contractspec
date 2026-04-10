import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
	...moduleLibrary,
	platform: 'neutral',
	entry: [
		'src/index.ts',
		'src/capabilities/index.ts',
		'src/commands/index.ts',
		'src/events/index.ts',
		'src/queries/index.ts',
		'src/types/index.ts',
		'src/validation/index.ts',
	],
}));
