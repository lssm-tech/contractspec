import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
	...moduleLibrary,
	platform: 'neutral',
	entry: ['src/index.ts', 'src/types.ts', 'src/validation.ts'],
}));
