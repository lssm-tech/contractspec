/**
 * Implementation resolver service.
 *
 * Resolves all implementations for a spec by merging:
 * 1. Explicit mappings from spec.implementations
 * 2. Auto-discovered references from workspace scanning
 * 3. Convention-based paths (naming conventions)
 */

import { createHash } from 'crypto';
import path from 'path';

import type { WorkspaceConfig } from '@contractspec/module.workspace';
import { scanSpecSource } from '@contractspec/module.workspace';
import type { ImplementationType } from '@contractspec/lib.contracts';
import type { FsAdapter } from '../../../ports/fs';
import type {
  ResolverOptions,
  ResolvedImplementation,
  SpecImplementationResult,
} from '../types';
import { discoverImplementationsForSpec } from '../discovery';

import { getConventionPaths } from './conventions';
import { getSpecKeyVariants, parseExplicitImplementations } from './parsers';
import { determineStatus } from './status';

export * from './parsers';
export * from './conventions';
export * from './status';

const DEFAULT_OPTIONS: ResolverOptions = {
  includeExplicit: true,
  includeDiscovered: true,
  includeConvention: true,
  computeHashes: true,
};

/**
 * Compute SHA256 hash of content.
 */
function computeHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
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

  const specKey = scan.key ?? path.basename(specFile).replace(/\.[jt]s$/, '');
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
