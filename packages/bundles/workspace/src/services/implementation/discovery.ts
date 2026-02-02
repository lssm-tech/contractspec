/**
 * Implementation auto-discovery service.
 *
 * Scans workspace files to find implementations that reference specs.
 * Uses regex-based pattern matching for performance (avoids full AST parsing).
 */

import type { FsAdapter } from '../../ports/fs';
import type { ImplementationType } from '@contractspec/lib.contracts';
import type { DiscoveryOptions, SpecReferenceMatch } from './types';
import { DEFAULT_FS_IGNORES, DEFAULT_SPEC_PATTERNS } from '../../adapters';

/**
 * Patterns for detecting spec references in source code.
 */
const SPEC_REFERENCE_PATTERNS = {
  // import { SpecName } from './path'
  namedImport:
    /import\s*\{[^}]*\b(\w+(?:Spec|Contract|Command|Query))\b[^}]*\}\s*from/g,
  // import SpecName from './path'
  defaultImport: /import\s+(\w+(?:Spec|Contract|Command|Query))\s+from/g,
  // ContractHandler<typeof SpecName>
  contractHandler: /ContractHandler\s*<\s*typeof\s+(\w+)\s*>/g,
  // typeof SpecName (generic usage)
  typeofSpec: /typeof\s+(\w+(?:Spec|Contract|Command|Query))\b/g,
  // spec: SpecKey or spec = SpecKey
  specAssignment:
    /(?:spec|contract)\s*[:=]\s*(\w+(?:Spec|Contract|Command|Query))\b/gi,
};

/**
 * File patterns that indicate implementation types.
 */
const IMPLEMENTATION_TYPE_PATTERNS: Record<string, ImplementationType> = {
  '.handler.ts': 'handler',
  '.handler.tsx': 'handler',
  '.service.ts': 'service',
  '.service.tsx': 'service',
  '.test.ts': 'test',
  '.test.tsx': 'test',
  '.spec.ts': 'test',
  '.spec.tsx': 'test',
  '.component.tsx': 'component',
  '.tsx': 'component', // Default for TSX files
  '.form.tsx': 'form',
  '.hook.ts': 'hook',
  '.hook.tsx': 'hook',
};

/**
 * Infer implementation type from file path.
 */
export function inferImplementationType(filePath: string): ImplementationType {
  const lowerPath = filePath.toLowerCase();

  // Check specific patterns first (order matters)
  for (const [pattern, type] of Object.entries(IMPLEMENTATION_TYPE_PATTERNS)) {
    if (lowerPath.endsWith(pattern)) {
      return type;
    }
  }

  // Check directory patterns
  if (lowerPath.includes('/handlers/')) return 'handler';
  if (lowerPath.includes('/services/')) return 'service';
  if (lowerPath.includes('/components/')) return 'component';
  if (lowerPath.includes('/forms/')) return 'form';
  if (lowerPath.includes('/hooks/')) return 'hook';
  if (lowerPath.includes('/__tests__/')) return 'test';

  return 'other';
}

/**
 * Extract spec references from source code.
 */
export function extractSpecReferences(
  code: string,
  filePath: string
): SpecReferenceMatch[] {
  const matches: SpecReferenceMatch[] = [];
  const seenSpecs = new Set<string>();

  // Helper to add unique matches
  const addMatch = (
    specKey: string,
    referenceType: SpecReferenceMatch['referenceType'],
    lineNumber?: number
  ) => {
    const key = `${specKey}:${referenceType}`;
    if (seenSpecs.has(key)) return;
    seenSpecs.add(key);

    matches.push({
      filePath,
      specKey,
      referenceType,
      lineNumber,
      inferredType: inferImplementationType(filePath),
    });
  };

  // Find line number for a match position
  const getLineNumber = (position: number): number => {
    const lines = code.substring(0, position).split('\n');
    return lines.length;
  };

  // Check ContractHandler pattern (most specific)
  let match: RegExpExecArray | null;
  const handlerPattern = new RegExp(SPEC_REFERENCE_PATTERNS.contractHandler);
  while ((match = handlerPattern.exec(code)) !== null) {
    if (match[1]) {
      addMatch(match[1], 'handler', getLineNumber(match.index));
    }
  }

  // Check typeof pattern
  const typeofPattern = new RegExp(SPEC_REFERENCE_PATTERNS.typeofSpec);
  while ((match = typeofPattern.exec(code)) !== null) {
    if (match[1]) {
      addMatch(match[1], 'typeof', getLineNumber(match.index));
    }
  }

  // Check named imports
  const namedPattern = new RegExp(SPEC_REFERENCE_PATTERNS.namedImport);
  while ((match = namedPattern.exec(code)) !== null) {
    // Extract all spec names from the import statement
    const importBlock = match[0];
    const specNames = importBlock.match(
      /\b(\w+(?:Spec|Contract|Command|Query))\b/g
    );
    if (specNames) {
      for (const name of specNames) {
        addMatch(name, 'import', getLineNumber(match.index));
      }
    }
  }

  // Check default imports
  const defaultPattern = new RegExp(SPEC_REFERENCE_PATTERNS.defaultImport);
  while ((match = defaultPattern.exec(code)) !== null) {
    if (match[1]) {
      addMatch(match[1], 'import', getLineNumber(match.index));
    }
  }

  // Check spec assignments
  const assignPattern = new RegExp(SPEC_REFERENCE_PATTERNS.specAssignment);
  while ((match = assignPattern.exec(code)) !== null) {
    if (match[1]) {
      addMatch(match[1], 'unknown', getLineNumber(match.index));
    }
  }

  return matches;
}

/**
 * Default glob patterns for implementation files.
 */
const DEFAULT_INCLUDE_PATTERNS = ['**/*.ts(x)'];

/**
 * Discover implementations that reference a specific spec.
 */
export async function discoverImplementationsForSpec(
  specKey: string,
  adapters: { fs: FsAdapter },
  options: DiscoveryOptions = {}
): Promise<SpecReferenceMatch[]> {
  const { fs } = adapters;
  const includePatterns = options.includePatterns ?? DEFAULT_INCLUDE_PATTERNS;
  const excludePatterns = options.excludePatterns ?? [
    ...new Set([...DEFAULT_FS_IGNORES, ...DEFAULT_SPEC_PATTERNS]),
  ];

  const allMatches: SpecReferenceMatch[] = [];

  // Scan each include pattern
  for (const pattern of includePatterns) {
    const files = await fs.glob({ pattern, ignore: excludePatterns });

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath);
        const references = extractSpecReferences(content, filePath);

        // Filter to only references for the target spec
        const matchingRefs = references.filter(
          (ref) => ref.specKey === specKey
        );
        allMatches.push(...matchingRefs);
      } catch {
        // Skip files that can't be read
      }
    }
  }

  return allMatches;
}

/**
 * Discover all spec references in the workspace.
 * Returns a map of spec key to implementation references.
 */
export async function discoverAllImplementations(
  adapters: { fs: FsAdapter },
  options: DiscoveryOptions = {}
): Promise<Map<string, SpecReferenceMatch[]>> {
  const { fs } = adapters;
  const includePatterns = options.includePatterns ?? DEFAULT_INCLUDE_PATTERNS;
  const excludePatterns = options.excludePatterns ?? [
    ...new Set([...DEFAULT_FS_IGNORES, ...DEFAULT_SPEC_PATTERNS]),
  ];

  const specToImplementations = new Map<string, SpecReferenceMatch[]>();

  // Scan each include pattern
  for (const pattern of includePatterns) {
    const files = await fs.glob({ pattern, ignore: excludePatterns });

    for (const filePath of files) {
      try {
        const content = await fs.readFile(filePath);
        const references = extractSpecReferences(content, filePath);

        // Group by spec key
        for (const ref of references) {
          const existing = specToImplementations.get(ref.specKey) ?? [];
          existing.push(ref);
          specToImplementations.set(ref.specKey, existing);
        }
      } catch {
        // Skip files that can't be read
      }
    }
  }

  return specToImplementations;
}
