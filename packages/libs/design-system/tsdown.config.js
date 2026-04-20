import { defineConfig, reactLibrary } from '@contractspec/tool.bun';

export default defineConfig({
	...reactLibrary,
	noBundle: true,
	exports: {
		devExports: true,
		rewrite: false,
	},
	entry: [
		'src/**/*.ts',
		'src/**/*.tsx',
		'!src/**/*.native.ts',
		'!src/**/*.native.tsx',
		'!src/**/*.test.ts',
		'!src/**/*.test.tsx',
		'!src/**/__tests__/**',
	],
});
