import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
	...moduleLibrary,
	entry: ['src/index.ts', 'src/runtime/index.ts', 'src/catalog.ts'],
}));
