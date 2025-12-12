import { glob } from 'glob';

export interface SpecDiscoveryOptions {
  pattern?: string;
}

const DEFAULT_SPEC_PATTERNS = [
  '**/*.contracts.ts',
  '**/*.event.ts',
  '**/*.presentation.ts',
  '**/*.workflow.ts',
  '**/*.data-view.ts',
  '**/*.migration.ts',
  '**/*.telemetry.ts',
  '**/*.experiment.ts',
  '**/*.app-config.ts',
  '**/*.integration.ts',
  '**/*.knowledge.ts',
];

const DEFAULT_IGNORES = ['node_modules/**', 'dist/**', '.turbo/**'];

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


