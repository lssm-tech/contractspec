import { defineConfig } from 'tsdown';

export const base = defineConfig({
  exports: {
    all: true,
    // devExports: true,
  },
  clean: false,
  // clean: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  // format: ['esm'],
  target: 'esnext',
  // Let packages add their own externals; keep common ones minimal.
  external: [],

  dts: true,
  // bundle: false,
  unbundle: true,
  splitting: false,
  minify: false,
  // treeshake: false,

  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
    '!src/**/__tests__/**',
  ],
});

const sharedExternal = [
  'next',
  'next/headers',
  'next/navigation',
  'next/link',
  'react',
  'react-dom',
  'react-native',
  'server-only',
  '@lssm/lib.ui-kit-web',
  '@lssm/lib.ui-kit',
  'lucide-react',
  'lucide-react-native',
  'react-native',
  'react-native-safe-area-context',
  'expo',
  'expo-router',
  '@prisma/adapter-pg',
  'pg',
  'graphql',
  'elysia',
  'posthog-node',
  'posthog-js',
  'posthog',
  'posthog-browser',
  'posthog-react',
  'posthog-react-native',
  'jotai',
  'jotai-tanstack-query',
  '@tanstack/query-core',
  '@tanstack/react-query',
  '@tanstack/react-query-devtools',
];

export const reactLibrary = defineConfig({
  ...base,
  format: ['esm'],
  external: [...sharedExternal],
});

export const moduleLibrary = defineConfig({
  ...base,
  format: ['esm'],
  external: [...sharedExternal],
  platform: 'neutral',
  exports: {
    all: true,
    devExports: true,
  },
  skipNodeModulesBundle: true,
});

export const nodeLib = defineConfig({
  ...base,
  format: ['esm', 'cjs'],
  platform: 'node',
  external: [...sharedExternal],
});

export const nodeDatabaseLib = defineConfig({
  ...base,
  format: ['esm'],
  platform: 'node',
  // platform: 'neutral',
  unbundle: true,
  external: [...sharedExternal],
});

export default defineConfig((_options) => ({
  ...base,
  // Packages can still provide their own local tsup.config to override.
}));
