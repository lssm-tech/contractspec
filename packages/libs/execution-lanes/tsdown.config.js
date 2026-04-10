import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
	...moduleLibrary,
	platform: 'neutral',
	entry: [
		'src/index.ts',
		'src/defaults/index.ts',
		'src/interop/index.ts',
		'src/types/index.ts',
	],
}));
