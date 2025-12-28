/**
 * Example file scanning utilities.
 *
 * Extracts ExampleSpec metadata from source code without execution.
 */

import type { ExampleScanResult } from '../types/analysis-types';
import type { Stability } from '../types/spec-types';

/**
 * Check if a file is an example file based on naming conventions.
 */
export function isExampleFile(filePath: string): boolean {
  return filePath.includes('/example.') || filePath.endsWith('.example.ts');
}

/**
 * Scan an example source file to extract metadata.
 */
export function scanExampleSource(
  code: string,
  filePath: string
): ExampleScanResult {
  const key = matchStringField(code, 'key') ?? extractKeyFromFilePath(filePath);
  const versionRaw = matchStringField(code, 'version');
  const version = versionRaw ?? undefined;
  const title = matchStringField(code, 'title') ?? undefined;
  const description = matchStringField(code, 'description') ?? undefined;
  const summary = matchStringField(code, 'summary') ?? undefined;
  const kind = matchStringField(code, 'kind') ?? undefined;
  const visibility = matchStringField(code, 'visibility') ?? undefined;
  const domain = matchStringField(code, 'domain') ?? undefined;
  const stabilityRaw = matchStringField(code, 'stability');
  const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
  const owners = matchStringArrayField(code, 'owners');
  const tags = matchStringArrayField(code, 'tags');

  // Extract docs
  const docs = extractDocs(code);

  // Extract surfaces
  const surfaces = extractSurfaces(code);

  // Extract entrypoints
  const entrypoints = extractEntrypoints(code);

  return {
    filePath,
    key,
    version,
    title,
    description,
    summary,
    kind,
    visibility,
    domain,
    stability,
    owners,
    tags,
    docs,
    surfaces,
    entrypoints,
  };
}

/**
 * Extract docs section from source code.
 */
function extractDocs(code: string): ExampleScanResult['docs'] {
  const docsMatch = code.match(/docs\s*:\s*\{([\s\S]*?)\}/);
  if (!docsMatch?.[1]) return undefined;

  const docsContent = docsMatch[1];
  return {
    rootDocId: matchStringFieldIn(docsContent, 'rootDocId') ?? undefined,
    goalDocId: matchStringFieldIn(docsContent, 'goalDocId') ?? undefined,
    usageDocId: matchStringFieldIn(docsContent, 'usageDocId') ?? undefined,
  };
}

/**
 * Extract surfaces section from source code.
 */
function extractSurfaces(code: string): ExampleScanResult['surfaces'] {
  const surfaces: ExampleScanResult['surfaces'] = {
    templates: false,
    sandbox: { enabled: false, modes: [] },
    studio: { enabled: false, installable: false },
    mcp: { enabled: false },
  };

  const surfacesMatch = code.match(/surfaces\s*:\s*\{([\s\S]*?)\}(?=\s*[,}])/);
  if (!surfacesMatch?.[1]) return surfaces;

  const surfacesContent = surfacesMatch[1];

  // Check templates
  surfaces.templates = /templates\s*:\s*true/.test(surfacesContent);

  // Check sandbox
  const sandboxMatch = surfacesContent.match(
    /sandbox\s*:\s*\{([\s\S]*?)\}(?=\s*[,}])/
  );
  if (sandboxMatch?.[1]) {
    const sandboxContent = sandboxMatch[1];
    surfaces.sandbox.enabled = /enabled\s*:\s*true/.test(sandboxContent);
    const modesMatch = sandboxContent.match(/modes\s*:\s*\[([\s\S]*?)\]/);
    if (modesMatch?.[1]) {
      surfaces.sandbox.modes = Array.from(
        modesMatch[1].matchAll(/['"]([^'"]+)['"]/g)
      )
        .map((m) => m[1])
        .filter((v): v is string => typeof v === 'string');
    }
  }

  // Check studio
  const studioMatch = surfacesContent.match(
    /studio\s*:\s*\{([\s\S]*?)\}(?=\s*[,}])/
  );
  if (studioMatch?.[1]) {
    const studioContent = studioMatch[1];
    surfaces.studio.enabled = /enabled\s*:\s*true/.test(studioContent);
    surfaces.studio.installable = /installable\s*:\s*true/.test(studioContent);
  }

  // Check mcp
  const mcpMatch = surfacesContent.match(/mcp\s*:\s*\{([\s\S]*?)\}(?=\s*[,}])/);
  if (mcpMatch?.[1]) {
    surfaces.mcp.enabled = /enabled\s*:\s*true/.test(mcpMatch[1]);
  }

  return surfaces;
}

/**
 * Extract entrypoints section from source code.
 */
function extractEntrypoints(code: string): ExampleScanResult['entrypoints'] {
  const entrypoints: ExampleScanResult['entrypoints'] = {
    packageName: '',
  };

  const entrypointsMatch = code.match(
    /entrypoints\s*:\s*\{([\s\S]*?)\}(?=\s*[,}])/
  );
  if (!entrypointsMatch?.[1]) return entrypoints;

  const content = entrypointsMatch[1];

  entrypoints.packageName =
    matchStringFieldIn(content, 'packageName') ?? 'unknown';
  entrypoints.feature = matchStringFieldIn(content, 'feature') ?? undefined;
  entrypoints.blueprint = matchStringFieldIn(content, 'blueprint') ?? undefined;
  entrypoints.contracts = matchStringFieldIn(content, 'contracts') ?? undefined;
  entrypoints.presentations =
    matchStringFieldIn(content, 'presentations') ?? undefined;
  entrypoints.handlers = matchStringFieldIn(content, 'handlers') ?? undefined;
  entrypoints.ui = matchStringFieldIn(content, 'ui') ?? undefined;
  entrypoints.docs = matchStringFieldIn(content, 'docs') ?? undefined;

  return entrypoints;
}

/**
 * Extract key from file path as fallback.
 */
function extractKeyFromFilePath(filePath: string): string {
  // Try to get package name from path
  const parts = filePath.split('/');
  const examplesIndex = parts.findIndex((p) => p === 'examples');
  const exampleName = parts[examplesIndex + 1];
  if (examplesIndex !== -1 && exampleName !== undefined) {
    return exampleName;
  }
  // Fallback to filename
  const fileName = parts.pop() ?? filePath;
  return fileName
    .replace(/\.example\.[jt]s$/, '')
    .replace(/[^a-zA-Z0-9-]/g, '-');
}

/**
 * Match a string field in source code.
 */
function matchStringField(code: string, field: string): string | null {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*['"]([^'"]+)['"]`);
  const match = code.match(regex);
  return match?.[1] ?? null;
}

/**
 * Match a string field within a limited scope.
 */
function matchStringFieldIn(code: string, field: string): string | null {
  const regex = new RegExp(`${escapeRegex(field)}\\s*:\\s*['"]([^'"]+)['"]`);
  const match = code.match(regex);
  return match?.[1] ?? null;
}

/**
 * Match a string array field in source code.
 */
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

/**
 * Check if a value is a valid stability.
 */
function isStability(value: string | null): value is Stability {
  return (
    value === 'experimental' ||
    value === 'beta' ||
    value === 'stable' ||
    value === 'deprecated'
  );
}

/**
 * Escape regex special characters.
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
