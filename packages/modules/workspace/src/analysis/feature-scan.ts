/**
 * Feature file scanning utilities.
 *
 * Extracts FeatureModuleSpec metadata from source code without execution.
 */

import type { FeatureScanResult, RefInfo } from '../types/analysis-types';
import type { Stability } from '../types/spec-types';

/**
 * Check if a file is a feature file based on naming conventions.
 */
export function isFeatureFile(filePath: string): boolean {
  return filePath.includes('.feature.');
}

/**
 * Scan a feature source file to extract metadata.
 */
export function scanFeatureSource(
  code: string,
  filePath: string
): FeatureScanResult {
  const key = matchStringField(code, 'key') ?? extractKeyFromFilePath(filePath);
  const title = matchStringField(code, 'title') ?? undefined;
  const description = matchStringField(code, 'description') ?? undefined;
  const goal = matchStringField(code, 'goal') ?? undefined;
  const context = matchStringField(code, 'context') ?? undefined;
  const domain = matchStringField(code, 'domain') ?? undefined;
  const stabilityRaw = matchStringField(code, 'stability');
  const stability = isStability(stabilityRaw) ? stabilityRaw : undefined;
  const owners = matchStringArrayField(code, 'owners');
  const tags = matchStringArrayField(code, 'tags');

  // Extract operations
  const operations = extractRefsFromArray(code, 'operations');

  // Extract events
  const events = extractRefsFromArray(code, 'events');

  // Extract presentations
  const presentations = extractRefsFromArray(code, 'presentations');

  // Extract experiments
  const experiments = extractRefsFromArray(code, 'experiments');

  // Extract capabilities
  const capabilities = extractCapabilities(code);

  // Extract op to presentation links
  const opToPresentationLinks = extractOpToPresentationLinks(code);

  return {
    filePath,
    key,
    title,
    description,
    goal,
    context,
    domain,
    stability,
    owners,
    tags,
    operations,
    events,
    presentations,
    experiments,
    capabilities,
    opToPresentationLinks,
    sourceBlock: code,
  };
}

/**
 * Extract refs from a named array (e.g., operations, events, presentations).
 */
function extractRefsFromArray(code: string, fieldName: string): RefInfo[] {
  const refs: RefInfo[] = [];

  // Match the array section
  const arrayPattern = new RegExp(
    `${escapeRegex(fieldName)}\\s*:\\s*\\[([\\s\\S]*?)\\]`,
    'm'
  );
  const arrayMatch = code.match(arrayPattern);

  if (!arrayMatch?.[1]) return refs;

  // Extract each { key: 'x', version: 'x.y.z' } entry
  const refPattern =
    /\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = refPattern.exec(arrayMatch[1])) !== null) {
    if (match[1] && match[2]) {
      refs.push({
        key: match[1],
        version: match[2],
      });
    }
  }

  return refs;
}

/**
 * Extract capability bindings (provides and requires).
 */
function extractCapabilities(code: string): {
  provides: RefInfo[];
  requires: RefInfo[];
} {
  const provides: RefInfo[] = [];
  const requires: RefInfo[] = [];

  // Match the capabilities section
  const capabilitiesMatch = code.match(/capabilities\s*:\s*\{([\s\S]*?)\}/);
  if (!capabilitiesMatch?.[1]) {
    return { provides, requires };
  }

  const capabilitiesContent = capabilitiesMatch[1];

  // Extract provides
  const providesMatch = capabilitiesContent.match(
    /provides\s*:\s*\[([\s\S]*?)\]/
  );
  if (providesMatch?.[1]) {
    const refPattern =
      /\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = refPattern.exec(providesMatch[1])) !== null) {
      if (match[1] && match[2]) {
        provides.push({
          key: match[1],
          version: match[2],
        });
      }
    }
  }

  // Extract requires
  const requiresMatch = capabilitiesContent.match(
    /requires\s*:\s*\[([\s\S]*?)\]/
  );
  if (requiresMatch?.[1]) {
    // Requires can have key+version or just key
    const refPatternWithVersion =
      /\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*['"]([^'"]+)['"]/g;
    const refPatternKeyOnly = /\{\s*key:\s*['"]([^'"]+)['"]\s*\}/g;

    let match: RegExpExecArray | null = null;
    while ((match = refPatternWithVersion.exec(requiresMatch[1])) !== null) {
      if (match[1] && match[2]) {
        requires.push({
          key: match[1],
          version: match[2],
        });
      }
    }

    // Also match key-only requires (version defaults to 1)
    while ((match = refPatternKeyOnly.exec(requiresMatch[1])) !== null) {
      if (match && match[1]) {
        // Check if we already added this with a version
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const alreadyExists = requires.some((r) => r.key === match![1]);
        if (!alreadyExists) {
          requires.push({
            key: match[1],
            version: '1.0.0', // Default version
          });
        }
      }
    }
  }

  return { provides, requires };
}

/**
 * Extract opToPresentation links.
 */
function extractOpToPresentationLinks(
  code: string
): { op: RefInfo; pres: RefInfo }[] {
  const links: { op: RefInfo; pres: RefInfo }[] = [];

  // Match the opToPresentation array
  const arrayMatch = code.match(/opToPresentation\s*:\s*\[([\s\S]*?)\]/);
  if (!arrayMatch?.[1]) return links;

  // Match each link entry
  // Pattern: { op: { key: 'x', version: 'N' }, pres: { key: 'y', version: 'M' } }
  const linkPattern =
    /\{\s*op:\s*\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*['"]([^'"]+)['"]\s*\}\s*,\s*pres:\s*\{\s*key:\s*['"]([^'"]+)['"]\s*,\s*version:\s*['"]([^'"]+)['"]\s*\}/g;

  let match;
  while ((match = linkPattern.exec(arrayMatch[1])) !== null) {
    if (match[1] && match[2] && match[3] && match[4]) {
      links.push({
        op: { key: match[1], version: match[2] },
        pres: { key: match[3], version: match[4] },
      });
    }
  }

  return links;
}

/**
 * Extract key from file path as fallback.
 */
function extractKeyFromFilePath(filePath: string): string {
  const fileName = filePath.split('/').pop() ?? filePath;
  return fileName
    .replace(/\.feature\.[jt]s$/, '')
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
