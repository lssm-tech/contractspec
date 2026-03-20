import { nodeDatabaseLib } from '@contractspec/tool.tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig(() => ({
	...nodeDatabaseLib,
	entry: ['src/cli.ts', 'src/index.ts'],
}));
