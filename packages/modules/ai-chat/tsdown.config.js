import { defineConfig } from 'tsdown';
import { moduleLibrary } from '@lssm/tool.tsdown';

export default defineConfig(() => ({
  ...moduleLibrary,
  entry: [
    'src/index.ts',
    'src/core/index.ts',
    'src/providers/index.ts',
    'src/context/index.ts',
    'src/presentation/index.ts',
    'src/presentation/components/index.ts',
    'src/presentation/hooks/index.ts',
  ],
}));

