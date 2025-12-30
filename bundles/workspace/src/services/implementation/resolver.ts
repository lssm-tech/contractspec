/**
 * Implementation resolver service.
 *
 * Resolves all implementations for a spec by merging:
 * 1. Explicit mappings from spec.implementations
 * 2. Auto-discovered references from workspace scanning
 * 3. Convention-based paths (naming conventions)
 */

import { createHash } from 'crypto';
import type { WorkspaceConfig } from '@contractspec/module.workspace';
import { scanSpecSource } from '@contractspec/module.workspace';
import type {
  ImplementationRef,
  ImplementationType,
} from '@contractspec/lib.contracts';
import type { FsAdapter } from '../../ports/fs';
import type {
  DiscoveryOptions,
  ImplementationStatus,
  ResolvedImplementation,
  SpecImplementationResult,
} from './types';
import { discoverImplementationsForSpec } from './discovery';

/**
 * Options for resolving implementations.
 */
export interface ResolverOptions extends DiscoveryOptions {
  /** Include explicit implementations from spec */
  includeExplicit?: boolean;
  /** Include auto-discovered implementations */
  includeDiscovered?: boolean;
  /** Include convention-based implementations */
  includeConvention?: boolean;
  /** Output directory for convention-based paths */
  outputDir?: string;
}

const DEFAULT_OPTIONS: ResolverOptions = {
  includeExplicit: true,
  includeDiscovered: true,
  includeConvention: true,
  computeHashes: true,
};

/**
 * Convert string to kebab-case.
 */
function toKebabCase(value: string): string {
  return value
    .replace(/\./g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Compute SHA256 hash of content.
 */
function computeHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

/**
 * Get convention-based implementation paths for a spec.
 */
function getConventionPaths(
  specType: string,
  specKey: string,
  outputDir: string
): { path: string; type: ImplementationType }[] {
  const kebab = toKebabCase(specKey);
  const paths: { path: string; type: ImplementationType }[] = [];

  if (specType === 'operation') {
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.ts`,
      type: 'handler',
    });
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.test.ts`,
      type: 'test',
    });
  }

  if (specType === 'presentation') {
    paths.push({
      path: `${outputDir}/components/${kebab}.tsx`,
      type: 'component',
    });
    paths.push({
      path: `${outputDir}/components/${kebab}.test.tsx`,
      type: 'test',
    });
  }

  if (specType === 'form') {
    paths.push({
      path: `${outputDir}/forms/${kebab}.form.tsx`,
      type: 'form',
    });
    paths.push({
      path: `${outputDir}/forms/${kebab}.form.test.tsx`,
      type: 'test',
    });
  }

  if (specType === 'event') {
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.ts`,
      type: 'handler',
    });
    paths.push({
      path: `${outputDir}/handlers/${kebab}.handler.test.ts`,
      type: 'test',
    });
  }

  return paths;
}

/**
 * Determine overall implementation status.
 */
function determineStatus(
  implementations: ResolvedImplementation[]
): ImplementationStatus {
  if (implementations.length === 0) {
    return 'missing';
  }

  const existingImpls = implementations.filter((i) => i.exists);
  const _nonTestImpls = implementations.filter((i) => i.type !== 'test');
  const existingNonTestImpls = existingImpls.filter((i) => i.type !== 'test');

  // If no non-test implementations exist, it's missing
  if (existingNonTestImpls.length === 0) {
    return 'missing';
  }

  // If all expected implementations exist, it's fully implemented
  if (implementations.every((i) => i.exists)) {
    return 'implemented';
  }

  // Some exist, some don't
  return 'partial';
}

/**
 * Resolve all implementations for a spec file.
 */
export async function resolveImplementations(
  specFile: string,
  adapters: { fs: FsAdapter },
  config: WorkspaceConfig,
  options: ResolverOptions = {}
): Promise<SpecImplementationResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { fs } = adapters;

  // Read and parse spec file
  const specExists = await fs.exists(specFile);
  if (!specExists) {
    throw new Error(`Spec file not found: ${specFile}`);
  }

  const specContent = await fs.readFile(specFile);
  const specHash = opts.computeHashes ? computeHash(specContent) : undefined;
  const scan = scanSpecSource(specContent, specFile);

  const specKey = scan.key ?? fs.basename(specFile).replace(/\.[jt]s$/, '');
  const specVersion = scan.version ?? '1.0.0';
  const specType = scan.specType ?? 'operation';

  const implementations: ResolvedImplementation[] = [];
  const seenPaths = new Set<string>();

  // Helper to add unique implementations
  const addImpl = async (
    path: string,
    type: ImplementationType,
    source: ResolvedImplementation['source'],
    description?: string
  ) => {
    if (seenPaths.has(path)) return;
    seenPaths.add(path);

    const exists = await fs.exists(path);
    let contentHash: string | undefined;

    if (exists && opts.computeHashes) {
      try {
        const content = await fs.readFile(path);
        contentHash = computeHash(content);
      } catch {
        // Ignore hash computation errors
      }
    }

    implementations.push({
      path,
      type,
      source,
      exists,
      contentHash,
      description,
    });
  };

  // 1. Add explicit implementations from spec
  if (opts.includeExplicit) {
    // Parse explicit implementations from spec source
    const explicitImpls = parseExplicitImplementations(specContent);
    for (const impl of explicitImpls) {
      await addImpl(impl.path, impl.type, 'explicit', impl.description);
    }
  }

  // 2. Add auto-discovered implementations
  if (opts.includeDiscovered) {
    const discovered = await discoverImplementationsForSpec(
      specKey,
      adapters,
      opts
    );

    // Also search for spec key variants
    const specKeyVariants = getSpecKeyVariants(specKey);
    for (const variant of specKeyVariants) {
      const variantDiscovered = await discoverImplementationsForSpec(
        variant,
        adapters,
        opts
      );
      discovered.push(...variantDiscovered);
    }

    for (const ref of discovered) {
      // Skip the spec file itself
      if (ref.filePath === specFile) continue;

      await addImpl(ref.filePath, ref.inferredType, 'discovered');
    }
  }

  // 3. Add convention-based implementations
  if (opts.includeConvention) {
    const outputDir = opts.outputDir ?? config.outputDir ?? './src';
    const conventionPaths = getConventionPaths(specType, specKey, outputDir);

    for (const { path, type } of conventionPaths) {
      await addImpl(path, type, 'convention');
    }
  }

  // Determine overall status
  const status = determineStatus(implementations);

  return {
    specKey,
    specVersion,
    specPath: specFile,
    specType,
    implementations,
    status,
    specHash,
  };
}

/**
 * Parse explicit implementations from spec source code.
 * Looks for: implementations: [{ path: '...', type: '...' }]
 */
function parseExplicitImplementations(code: string): ImplementationRef[] {
  const implementations: ImplementationRef[] = [];

  // Simple regex to find implementations array
  const implMatch = code.match(/implementations\s*:\s*\[([\s\S]*?)\]/);

  if (!implMatch) return implementations;

  const implBlock = implMatch[1];
  if (!implBlock) return implementations;

  // Find each { path: '...', type: '...' } object
  const objRegex =
    /\{\s*path\s*:\s*['"`]([^'"`]+)['"`]\s*,\s*type\s*:\s*['"`]([^'"`]+)['"`](?:\s*,\s*description\s*:\s*['"`]([^'"`]+)['"`])?\s*\}/g;

  let match: RegExpExecArray | null;
  while ((match = objRegex.exec(implBlock)) !== null) {
    if (match[1] && match[2]) {
      implementations.push({
        path: match[1],
        type: match[2] as ImplementationType,
        description: match[3],
      });
    }
  }

  return implementations;
}

/**
 * Get common variants of a spec key for discovery.
 */
function getSpecKeyVariants(specKey: string): string[] {
  const variants: string[] = [];

  // Remove common suffixes
  const base = specKey
    .replace(/Spec$/, '')
    .replace(/Contract$/, '')
    .replace(/Command$/, '')
    .replace(/Query$/, '');

  if (base !== specKey) {
    variants.push(base);
    variants.push(`${base}Spec`);
    variants.push(`${base}Contract`);
  }

  // Add PascalCase variant
  const parts = specKey.split('.');
  if (parts.length > 1) {
    const pascalName = parts
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
      .join('');
    variants.push(pascalName);
  }

  return variants;
}

/**
 * Resolve implementations for multiple spec files.
 */
export async function resolveAllImplementations(
  specFiles: string[],
  adapters: { fs: FsAdapter },
  config: WorkspaceConfig,
  options: ResolverOptions = {}
): Promise<SpecImplementationResult[]> {
  const results: SpecImplementationResult[] = [];

  for (const specFile of specFiles) {
    try {
      const result = await resolveImplementations(
        specFile,
        adapters,
        config,
        options
      );
      results.push(result);
    } catch (error) {
      // Log error but continue with other specs
      console.error(
        `Failed to resolve implementations for ${specFile}:`,
        error
      );
    }
  }

  return results;
}

/**
 * Get implementation summary statistics.
 */
export function getImplementationSummary(results: SpecImplementationResult[]): {
  total: number;
  implemented: number;
  partial: number;
  missing: number;
  coverage: number;
} {
  const implemented = results.filter((r) => r.status === 'implemented').length;
  const partial = results.filter((r) => r.status === 'partial').length;
  const missing = results.filter((r) => r.status === 'missing').length;

  return {
    total: results.length,
    implemented,
    partial,
    missing,
    coverage:
      results.length > 0
        ? Math.round((implemented / results.length) * 100)
        : 100,
  };
}
