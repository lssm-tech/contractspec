import { nodeDatabaseLib } from '@contractspec/tool.tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig((options) => ({
	...nodeDatabaseLib,
	entry: ['src/cli.ts', 'src/index.ts'],
}));
