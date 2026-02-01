/**
 * Implementation resolver service.
 *
 * Resolves all implementations for a spec by merging:
 * 1. Explicit mappings from spec.implementations
 * 2. Auto-discovered references from workspace scanning
 * 3. Convention-based paths (naming conventions)
 */

import { createHash } from 'crypto';

import type { SpecScanResult } from '@contractspec/module.workspace';
import type {
  ImplementationType,
  ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts';
import type { FsAdapter } from '../../../ports/fs';
import type {
  ResolvedImplementation,
  ResolverOptions,
  SpecImplementationResult,
} from '../types';
import { discoverImplementationsForSpec } from '../discovery';

import { getConventionPaths } from './conventions';
import { parseExplicitImplementations } from './parsers';
import { determineStatus } from './status';
import path from 'path';
import type { Ora } from 'ora';

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
  specFile: SpecScanResult,
  adapters: { fs: FsAdapter },
  config: ResolvedContractsrcConfig,
  options: ResolverOptions = {},
  spinner?: Ora
): Promise<SpecImplementationResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const specHash = opts.computeHashes
    ? computeHash(specFile.sourceBlock || '')
    : undefined;

  const specKey =
    specFile.key ?? path.basename(specFile.filePath).replace(/\.[jt]s$/, '');
  const specVersion = specFile.version ?? '1.0.0';

  const { fs } = adapters;

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
    let implementationSourceContent: string | undefined = undefined;
    let implementationSourceHash: string | undefined = undefined;

    if (exists && opts.computeHashes) {
      try {
        implementationSourceContent = await fs.readFile(path);
        implementationSourceHash = computeHash(implementationSourceContent);
      } catch {
        // Ignore hash computation errors
      }
    }

    implementations.push({
      path,
      type,
      source,
      exists,
      implementationSourceContent,
      implementationSourceHash,
      description,
    });
  };

  // 1. Add explicit implementations from spec
  if (opts.includeExplicit && specFile.sourceBlock) {
    if (spinner) spinner.suffixText = `Discover explicit implementations`;

    // Parse explicit implementations from spec source
    const explicitImpls = parseExplicitImplementations(specFile.sourceBlock);
    for (const impl of explicitImpls) {
      await addImpl(impl.path, impl.type, 'explicit', impl.description);
    }
  }

  // 2. Add auto-discovered implementations
  if (opts.includeDiscovered) {
    if (spinner) spinner.suffixText = `Discover implementations`;

    const discovered = await discoverImplementationsForSpec(
      specKey,
      adapters,
      opts
    );

    for (const ref of discovered) {
      // Skip the spec file itself
      if (ref.filePath === specFile.filePath) continue;

      await addImpl(ref.filePath, ref.inferredType, 'discovered');
    }
  }

  // 3. Add convention-based implementations
  if (opts.includeConvention) {
    if (spinner)
      spinner.suffixText = `Discover implementations based on conventions`;

    const outputDir = opts.outputDir ?? config.outputDir ?? './src';
    const conventionPaths = getConventionPaths(
      specFile.specType,
      specKey,
      outputDir
    );

    for (const { path, type } of conventionPaths) {
      await addImpl(path, type, 'convention');
    }
  }

  if (spinner) spinner.suffixText = `Determine implementation status`;
  // Determine overall status
  const status = determineStatus(implementations);

  return {
    specKey,
    specVersion,
    specPath: specFile.filePath,
    specType: specFile.specType,
    implementations,
    status,
    specHash,
  };
}

/**
 * Resolve implementations for multiple spec files.
 */
export async function resolveAllImplementations(
  specFiles: SpecScanResult[],
  adapters: { fs: FsAdapter },
  config: ResolvedContractsrcConfig,
  options: ResolverOptions = {},
  spinner?: Ora
): Promise<SpecImplementationResult[]> {
  const results: SpecImplementationResult[] = [];

  for (const specFile of specFiles) {
    if (spinner)
      spinner.text = `Resolving implementation... (${results.length}/${specFiles.length})`;

    try {
      const result = await resolveImplementations(
        specFile,
        adapters,
        config,
        options,
        spinner
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
