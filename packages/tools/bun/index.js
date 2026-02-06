const DEFAULT_ENTRY = [
  'src/**/*.ts',
  'src/**/*.tsx',
  '!src/**/*.test.ts',
  '!src/**/*.test.tsx',
  '!src/**/*.spec.ts',
  '!src/**/__tests__/**',
  '!src/**/*.stories.ts',
  '!src/**/*.stories.tsx',
  '!src/**/*.cy.ts',
  '!src/**/*.cy.tsx',
  '!cypress/**',
];

const BASE = {
  kind: 'shared',
  entry: DEFAULT_ENTRY,
  external: [],
  exports: {
    all: true,
    devExports: false,
  },
};

export function defineConfig(config) {
  return config;
}

export const withDevExports = {
  exports: {
    all: true,
    devExports: true,
  },
};

export const frontendReact = {
  ...BASE,
  kind: 'frontend-react',
  platform: 'browser',
  targets: {
    node: false,
    browser: true,
  },
};

export const backendNode = {
  ...BASE,
  kind: 'backend-node',
  platform: 'node',
  targets: {
    node: true,
    browser: false,
  },
};

export const backendBun = {
  ...BASE,
  kind: 'backend-bun',
  platform: 'node',
  targets: {
    node: true,
    browser: false,
  },
};

export const backendBoth = {
  ...BASE,
  kind: 'backend-both',
  platform: 'neutral',
  targets: {
    node: true,
    browser: true,
  },
};

export const shared = {
  ...BASE,
  kind: 'shared',
  platform: 'neutral',
  targets: {
    node: true,
    browser: true,
  },
};

// Backward-compatible aliases for existing tsdown-style configs.
export const reactLibrary = frontendReact;
export const moduleLibrary = shared;
export const nodeLib = backendNode;
export const nodeDatabaseLib = backendNode;

export default shared;
