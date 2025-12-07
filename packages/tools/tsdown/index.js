import { defineConfig } from 'tsdown';

export const withDevExports = {
  exports: {
    all: true,
    devExports: true,
  },
};

const obfuscation = defineConfig({
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
});

export const base = defineConfig({
  exports: {
    all: true,
    devExports: true,
  },
  clean: true,
  sourcemap: false,
  format: ['esm'],
  target: 'esnext',

  dts: false,
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

export const reactLibrary = defineConfig({
  ...base,
  format: ['esm'],
  minify: false,
  platform: 'browser',
});

export const moduleLibrary = defineConfig({
  ...base,
  format: ['esm'],
  platform: 'neutral',
  ...obfuscation,
});

export const nodeLib = defineConfig({
  ...base,
  format: ['esm'],
  // format: ['esm', 'cjs'],
  platform: 'node',
  ...obfuscation,
});

export const nodeDatabaseLib = defineConfig({
  ...base,
  format: ['esm'],
  platform: 'node',
  // platform: 'neutral',
  unbundle: true,
  // ...obfuscation,
  entry: ['src/index.ts', 'src/client.ts', 'src/enums.ts', 'src/models.ts'],
});

export default defineConfig((_options) => ({
  ...base,
  ...obfuscation,
  // Packages can still provide their own local tsup.config to override.
}));
