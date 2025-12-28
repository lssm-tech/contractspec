import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@contractspec/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  external: [...(moduleLibrary.external ?? []), 'dayjs'],
}));
