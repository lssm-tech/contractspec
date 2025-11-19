import { defineConfig } from 'tsdown';

const obfuscation = {
  minify: {
    compress: {
      dropConsole: false,
      dropDebugger: true,
      unused: true,
    },
    mangle: {
      toplevel: true,
      keepNames: false,
    },
    codegen: {
      removeWhitespace: true,
    },
  },
};

export const base = defineConfig({
  exports: {
    all: true,
    devExports: false,
  },
  clean: true,
  sourcemap: false,
  format: ['esm', 'cjs'],
  // format: ['esm'],
  target: 'esnext',
  // Let packages add their own externals; keep common ones minimal.
  external: [],

  dts: true,
  // bundle: false,
  unbundle: true,
  splitting: false,
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
  '@lssm/lib.ui-kit/*',
  '@lssm/lib.ui-kit-web/*',
  '@lssm/lib.ui-kit-web/ui/*',
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
  '@sentry/nextjs',
  'react-map-gl',
  'react-map-gl/maplibre',
  'maplibre-gl',
  'node:buffer',
  'node:timers/promises',
  'node:crypto',
  'node:assert',
  'node:url',
  '@google-cloud/secret-manager',
  '@google-cloud/storage',
  '@google-cloud/pubsub',
  'googleapis',
  'postmark',
];

export const reactLibrary = defineConfig({
  ...base,
  format: ['esm'],
  external: [...sharedExternal],
  minify: false,
  platform: 'browser',
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
  ...obfuscation,
});

export const nodeLib = defineConfig({
  ...base,
  format: ['esm', 'cjs'],
  platform: 'node',
  external: [...sharedExternal],
  ...obfuscation,
});

export const nodeDatabaseLib = defineConfig({
  ...base,
  format: ['esm'],
  platform: 'node',
  // platform: 'neutral',
  unbundle: true,
  external: [...sharedExternal],
  ...obfuscation,
});

export default defineConfig((_options) => ({
  ...base,
  ...obfuscation,
  // Packages can still provide their own local tsup.config to override.
}));
