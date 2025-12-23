export type SpecType =
  | 'operation'
  | 'event'
  | 'presentation'
  | 'workflow'
  | 'data-view'
  | 'migration'
  | 'telemetry'
  | 'experiment'
  | 'app-config'
  | 'integration'
  | 'knowledge'
  | 'unknown';

export type OperationKind = 'command' | 'query' | 'unknown';

export type Stability = 'experimental' | 'beta' | 'stable' | 'deprecated';

export interface SpecScanResult {
  filePath: string;
  specType: SpecType;
  name?: string;
  version?: number;
  kind?: OperationKind;
  stability?: Stability;
  description?: string;
  owners?: string[];
  tags?: string[];

  // Structural hints (used for deps/diff heuristics without executing code)
  hasMeta: boolean;
  hasIo: boolean;
  hasPolicy: boolean;
  hasPayload: boolean;
  hasContent: boolean;
  hasDefinition: boolean;
}

export function inferSpecTypeFromFilePath(filePath: string): SpecType {
  if (filePath.includes('.contracts.')) return 'operation';
  if (filePath.includes('.event.')) return 'event';
  if (filePath.includes('.presentation.')) return 'presentation';
  if (filePath.includes('.workflow.')) return 'workflow';
  if (filePath.includes('.data-view.')) return 'data-view';
  if (filePath.includes('.migration.')) return 'migration';
  if (filePath.includes('.telemetry.')) return 'telemetry';
  if (filePath.includes('.experiment.')) return 'experiment';
  if (filePath.includes('.app-config.')) return 'app-config';
  if (filePath.includes('.integration.')) return 'integration';
  if (filePath.includes('.knowledge.')) return 'knowledge';
  return 'unknown';
}

export function scanSpecSource(code: string, filePath: string): SpecScanResult {
  const specType = inferSpecTypeFromFilePath(filePath);

  const name = matchStringField(code, 'name');
  const description = matchStringField(code, 'description');
  const stabilityRaw = matchStringField(code, 'stability');
  const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
  const owners = matchStringArrayField(code, 'owners');
  const tags = matchStringArrayField(code, 'tags');

  const version = matchNumberField(code, 'version');
  const kind = inferOperationKind(code);

  const hasMeta = /meta\s*:\s*{/.test(code);
  const hasIo = /\bio\s*:\s*{/.test(code);
  const hasPolicy = /\bpolicy\s*:\s*{/.test(code);
  const hasPayload = /\bpayload\s*:\s*{/.test(code);
  const hasContent = /\bcontent\s*:\s*{/.test(code);
  const hasDefinition = /\bdefinition\s*:\s*{/.test(code);

  return {
    filePath,
    specType,
    name: name ?? undefined,
    description: description ?? undefined,
    stability,
    owners,
    tags,
    version: version ?? undefined,
    kind,
    hasMeta,
    hasIo,
    hasPolicy,
    hasPayload,
    hasContent,
    hasDefinition,
  };
}

function matchStringField(code: string, field: string): string | null {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*['"]([^'"]+)['"]`);
  const match = code.match(regex);
  return match?.[1] ?? null;
}

function matchNumberField(code: string, field: string): number | null {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*(\\d+)`);
  const match = code.match(regex);
  if (!match?.[1]) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function matchStringArrayField(
  code: string,
  field: string
): string[] | undefined {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const match = code.match(regex);
  if (!match?.[1]) return undefined;

  const inner = match[1];
  const items = Array.from(inner.matchAll(/['"]([^'"]+)['"]/g))
    .map((m) => m[1])
    .filter(
      (value): value is string => typeof value === 'string' && value.length > 0
    );

  return items.length > 0 ? items : undefined;
}

function isStability(value: string | null): value is Stability {
  return (
    value === 'experimental' ||
    value === 'beta' ||
    value === 'stable' ||
    value === 'deprecated'
  );
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Infer operation kind from source code.
 * First checks for defineCommand/defineQuery usage (which set kind automatically),
 * then falls back to explicit kind field.
 */
function inferOperationKind(code: string): OperationKind {
  // Check for defineCommand/defineQuery usage first (they set kind automatically)
  if (/defineCommand\s*\(/.test(code)) return 'command';
  if (/defineQuery\s*\(/.test(code)) return 'query';
  // Fall back to explicit kind field
  const kindRaw = matchStringField(code, 'kind');
  return kindRaw === 'command' || kindRaw === 'query' ? kindRaw : 'unknown';
}
