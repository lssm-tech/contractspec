import type {
  ContractPatchIntent,
  ImpactReport,
  PatchChange,
  PatchChangeType,
} from '@contractspec/lib.contracts/product-intent/types';

export interface RepoScanFile {
  path: string;
  content: string;
}

export interface ImpactEngineOptions {
  reportId?: string;
  patchId?: string;
  repoFiles?: RepoScanFile[];
  maxHitsPerChange?: number;
}

type ImpactBucket = 'breaks' | 'mustChange' | 'risky';

const SURFACE_MAP: Record<PatchChangeType, string[]> = {
  add_field: ['api', 'db', 'ui', 'docs', 'tests'],
  remove_field: ['api', 'db', 'ui', 'docs', 'tests'],
  rename_field: ['api', 'db', 'ui', 'docs', 'tests'],
  add_event: ['api', 'workflows', 'docs', 'tests'],
  update_event: ['api', 'workflows', 'docs', 'tests'],
  add_operation: ['api', 'ui', 'workflows', 'docs', 'tests'],
  update_operation: ['api', 'ui', 'workflows', 'docs', 'tests'],
  update_form: ['ui', 'docs', 'tests'],
  update_policy: ['policy', 'api', 'workflows', 'docs', 'tests'],
  add_enum_value: ['api', 'db', 'ui', 'docs', 'tests'],
  remove_enum_value: ['api', 'db', 'ui', 'docs', 'tests'],
  other: ['docs', 'tests'],
};

const BUCKET_MAP: Record<PatchChangeType, ImpactBucket> = {
  remove_field: 'breaks',
  rename_field: 'breaks',
  remove_enum_value: 'breaks',
  update_operation: 'mustChange',
  update_event: 'mustChange',
  update_policy: 'mustChange',
  update_form: 'risky',
  add_field: 'risky',
  add_event: 'risky',
  add_operation: 'risky',
  add_enum_value: 'risky',
  other: 'risky',
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function buildTokens(change: PatchChange): string[] {
  const combined = `${change.type} ${change.target} ${change.detail}`;
  const tokens = combined
    .split(/[^a-zA-Z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
  return Array.from(new Set(tokens.map((token) => token.toLowerCase()))).slice(
    0,
    8
  );
}

function scanTokens(
  tokens: string[],
  files: RepoScanFile[],
  maxHits: number
): string[] {
  const hits: string[] = [];
  const lowerTokens = tokens.map((token) => token.toLowerCase());
  for (const file of files) {
    const haystack = file.content.toLowerCase();
    if (lowerTokens.some((token) => haystack.includes(token))) {
      hits.push(file.path);
    }
    if (hits.length >= maxHits) break;
  }
  return hits;
}

function formatRefs(
  tokens: string[],
  repoFiles?: RepoScanFile[],
  maxHits = 3
): string {
  if (!repoFiles || repoFiles.length === 0) {
    return 'refs: (no repo scan)';
  }
  const hits = scanTokens(tokens, repoFiles, maxHits);
  if (!hits.length) return 'refs: none';
  return `refs: ${hits.join(', ')}`;
}

function humanizeChange(change: PatchChange): string {
  const label = change.type.replace(/_/g, ' ');
  return `${label} ${change.target}`;
}

function buildStatement(
  change: PatchChange,
  refs: string,
  surfaces: string[]
): string {
  const reason = change.detail || `touches ${surfaces.join(', ')}`;
  return `${humanizeChange(change)} because ${reason} (${refs})`;
}

export function impactEngine(
  intent: ContractPatchIntent,
  options: ImpactEngineOptions = {}
): ImpactReport {
  const reportId = options.reportId ?? `impact-${slugify(intent.featureKey)}`;
  const patchId = options.patchId ?? `patch-${slugify(intent.featureKey)}`;
  const maxHitsPerChange = options.maxHitsPerChange ?? 3;

  const breaks: string[] = [];
  const mustChange: string[] = [];
  const risky: string[] = [];
  const surfaces: ImpactReport['surfaces'] = {
    api: [],
    db: [],
    ui: [],
    workflows: [],
    policy: [],
    docs: [],
    tests: [],
  };

  for (const change of intent.changes) {
    const bucket = BUCKET_MAP[change.type] ?? 'risky';
    const surfaceTargets = SURFACE_MAP[change.type] ?? ['docs', 'tests'];
    const tokens = buildTokens(change);
    const refs = formatRefs(tokens, options.repoFiles, maxHitsPerChange);
    const statement = buildStatement(change, refs, surfaceTargets);

    if (bucket === 'breaks') breaks.push(statement);
    if (bucket === 'mustChange') mustChange.push(statement);
    if (bucket === 'risky') risky.push(statement);

    for (const surface of surfaceTargets) {
      const list = surfaces[surface as keyof ImpactReport['surfaces']];
      if (Array.isArray(list)) {
        list.push(statement);
      }
    }
  }

  const summary = [
    `Analyzed ${intent.changes.length} change(s).`,
    `Breaks: ${breaks.length}.`,
    `Must change: ${mustChange.length}.`,
    `Risky: ${risky.length}.`,
  ].join(' ');

  return {
    reportId,
    patchId,
    summary,
    breaks,
    mustChange,
    risky,
    surfaces,
  };
}
