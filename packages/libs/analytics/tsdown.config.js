import { defineConfig, moduleLibrary } from '@contractspec/tool.bun';

export default defineConfig(() => ({
  ...moduleLibrary,
  external: [...(moduleLibrary.external ?? []), 'dayjs'],
}));
