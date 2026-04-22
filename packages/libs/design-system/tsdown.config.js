import { defineConfig, reactLibrary } from '@contractspec/tool.bun';

export default defineConfig({
	...reactLibrary,
	noBundle: true,
	exports: {
		devExports: true,
		rewrite: true,
	},
	entry: [
		'src/**/*.ts',
		'src/**/*.tsx',
		'!src/**/*.test.ts',
		'!src/**/*.test.tsx',
		'!src/**/__tests__/**',
	],
});
