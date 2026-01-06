import {
  isStability,
  matchStringArrayField,
  matchStringField,
  matchStringFieldIn,
} from './utils/matchers';
import type { ExampleScanResult } from '../types/analysis-types';

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

  // Check templates directly in the surfaces section
  surfaces.templates = /surfaces\s*:\s*\{[\s\S]*?templates\s*:\s*true/.test(
    code
  );

  // Check sandbox - look for the sandbox object and extract its content
  const sandboxMatch = code.match(
    /sandbox\s*:\s*\{\s*enabled\s*:\s*(true|false)\s*,\s*modes\s*:\s*\[([^\]]*)\]/
  );
  if (sandboxMatch) {
    surfaces.sandbox.enabled = sandboxMatch[1] === 'true';
    if (sandboxMatch[2]) {
      surfaces.sandbox.modes = Array.from(
        sandboxMatch[2].matchAll(/['"]([^'"]+)['"]/g)
      )
        .map((m) => m[1])
        .filter((v): v is string => typeof v === 'string');
    }
  }

  // Check studio - look for studio object
  const studioMatch = code.match(
    /studio\s*:\s*\{\s*enabled\s*:\s*(true|false)\s*,\s*installable\s*:\s*(true|false)/
  );
  if (studioMatch) {
    surfaces.studio.enabled = studioMatch[1] === 'true';
    surfaces.studio.installable = studioMatch[2] === 'true';
  }

  // Check mcp
  const mcpMatch = code.match(/mcp\s*:\s*\{\s*enabled\s*:\s*(true|false)/);
  if (mcpMatch) {
    surfaces.mcp.enabled = mcpMatch[1] === 'true';
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
