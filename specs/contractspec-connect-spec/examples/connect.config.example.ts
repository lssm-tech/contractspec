import { defineConnectConfig } from '@contractspec/connect-core';

export default defineConnectConfig({
  repoId: 'acme/payments-service',
  adapters: {
    claude: { enabled: true },
    cursor: { enabled: false },
    codex: { enabled: false },
  },
  storage: {
    root: '.contractspec/connect',
    auditFile: '.contractspec/connect/audit.ndjson',
    reviewPacketsDir: '.contractspec/connect/review-packets',
  },
  canonPacks: [
    { ref: 'team/platform@1.2.0', readOnly: true },
    { ref: 'team/security@2.0.1', readOnly: true },
  ],
  policy: {
    protectedPaths: [
      'db/migrations/**',
      'infra/**',
      'contracts/**',
    ],
    generatedPaths: [
      'generated/**',
    ],
    reviewThresholds: {
      breakingChange: 'require_review',
      unknownImpact: 'require_review',
      destructiveCommand: 'deny',
      protectedPathWrite: 'require_review',
    },
  },
  commands: {
    allow: [
      'pnpm test --',
      'pnpm lint',
      'pnpm typecheck',
    ],
    review: [
      'pnpm migrate:create',
      'pnpm openapi:import',
    ],
    deny: [
      'rm -rf',
      'git push --force',
      'git reset --hard',
    ],
  },
  studio: {
    enabled: false,
    endpoint: 'https://studio.contractspec.local',
    mode: 'review-bridge',
  },
});
