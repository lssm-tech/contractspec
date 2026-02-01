export const DEFAULT_SPEC_PATTERNS = [
  // Standard dot-prefixed naming convention
  '**/*.operation.ts',
  '**/*.operations.ts',
  '**/*.event.ts',
  '**/*.presentation.ts',
  '**/*.feature.ts',
  '**/*.capability.ts',
  '**/*.workflow.ts',
  '**/*.data-view.ts',
  '**/*.form.ts',
  '**/*.migration.ts',
  '**/*.telemetry.ts',
  '**/*.experiment.ts',
  '**/*.app-config.ts',
  '**/*.integration.ts',
  '**/*.knowledge.ts',
  '**/*.policy.ts',
  '**/*.test-spec.ts',
  // Directory-based patterns (contracts/ and operations/ directories)
  '**/contracts/*.ts',
  '**/contracts/index.ts',
  '**/operations/*.ts',
  '**/operations/index.ts',
  // Standalone file patterns (events.ts, presentations.ts)
  '**/operations.ts',
  '**/events.ts',
  '**/presentations.ts',
  // Directory index patterns (/events/index.ts, /presentations/index.ts)
  '**/events/index.ts',
  '**/presentations/index.ts',
  // Test specs in tests directory
  '**/tests/*.ts',
  '**/tests/*.test-spec.ts',
];

export const DEFAULT_FS_IGNORES = [
  '**/.git/**',
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.turbo/**',
  '**/.next/**',
  '**/coverage/**',
  '**/*.d.ts',
  // Code generators and transformers (not actual specs)
  '**/importer/**',
  '**/exporter/**',
  // Documentation blocks (treated separately)
  '**/docs/**/*.docblock.ts',
  '**/docs/presentations.ts',
];
