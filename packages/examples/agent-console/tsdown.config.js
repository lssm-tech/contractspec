import {
	defineConfig,
	moduleLibrary,
	withDevExports,
} from '@contractspec/tool.bun';

export default defineConfig((options) => ({
	...moduleLibrary,
	...withDevExports,
	entry: [
		'src/**/*.ts',
		'src/**/*.tsx',
		'!src/**/*.test.ts',
		'!src/**/*.test.tsx',
		'!src/**/*.spec.ts',
		'!src/**/__tests__/**',
		'!src/**/*.stories.ts',
		'!src/**/*.stories.tsx',
		'!src/**/*.cy.ts',
		'!src/**/*.cy.tsx',
		'!cypress/**',
		'!src/proof/**',
		'!src/shared/demo-dashboard-data.ts',
		'!src/shared/demo-runtime.ts',
		'!src/shared/demo-runtime-seed.ts',
	],
}));
