import { defineConnectOverlay } from '@contractspec/connect-core';

export default defineConnectOverlay({
  repoConventions: {
    testCommand: 'pnpm test -- --runInBand',
    typecheckCommand: 'pnpm typecheck',
    lintCommand: 'pnpm lint',
    generatedDirectories: ['generated/', '.contractspec/out/'],
  },
  pathHints: [
    {
      glob: 'src/modules/payments/**',
      contracts: ['payments.capture', 'payments.refund'],
    },
    {
      glob: 'src/http/**',
      surfaces: ['rest'],
    },
    {
      glob: 'src/mcp/**',
      surfaces: ['mcp'],
    },
  ],
  smokeChecks: [
    'pnpm typecheck',
    'pnpm test -- payments',
  ],
});
