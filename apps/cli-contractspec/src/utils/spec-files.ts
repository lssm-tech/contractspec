import { glob } from 'glob';

export interface SpecDiscoveryOptions {
  pattern?: string;
}

const DEFAULT_SPEC_PATTERNS = [
  // Standard dot-prefixed naming convention
  '**/*.contracts.ts',
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
  // Directory-based patterns (contracts/ directory)
  '**/contracts/*.ts',
  '**/contracts/index.ts',
  // Standalone file patterns (events.ts, presentations.ts)
  '**/events.ts',
  '**/presentations.ts',
  // Directory index patterns (/events/index.ts, /presentations/index.ts)
  '**/events/index.ts',
  '**/presentations/index.ts',
];

const DEFAULT_IGNORES = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.turbo/**',
  '**/.next/**',
  '**/build/**',
  '**/coverage/**',
  '**/*.d.ts',
];

export async function discoverSpecFiles(
  options: SpecDiscoveryOptions = {}
): Promise<string[]> {
  const patterns = options.pattern ? [options.pattern] : DEFAULT_SPEC_PATTERNS;

  const all: string[] = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { ignore: DEFAULT_IGNORES });
    all.push(...matches);
  }

  // Deduplicate + stable ordering
  return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
}
