import { nodeLib } from '@contractspec/tool.tsdown';
import { defineConfig } from 'tsdown';

export default defineConfig(() => ({
	...nodeLib,
	entry: ['src/index.ts', 'src/server.ts'],
}));
