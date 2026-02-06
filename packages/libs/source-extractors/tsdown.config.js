import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig({
    ...moduleLibrary,
    entry: [
        'src/index.ts',
        'src/types.ts',
        'src/extractors/index.ts',
        'src/codegen/index.ts',
    ],
});
