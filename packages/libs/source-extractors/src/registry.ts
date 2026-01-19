/**
 * Source extractor registry.
 *
 * Manages extractor plugins and provides lookup by framework.
 */

import type { ExtractOptions, ExtractResult, ProjectInfo } from './types';

/**
 * Interface that all source extractors must implement.
 */
export interface SourceExtractor {
  /** Unique identifier for this extractor */
  id: string;
  /** Human-readable name */
  name: string;
  /** Frameworks this extractor supports */
  frameworks: string[];
  /** Priority (higher = preferred when multiple match) */
  priority: number;

  /**
   * Detect if this extractor can handle the given project.
   * @param project Project information
   * @returns true if this extractor should be used
   */
  detect(project: ProjectInfo): Promise<boolean>;

  /**
   * Extract contract candidates from the project.
   * @param project Project information
   * @param options Extraction options
   * @returns Extraction result with IR
   */
  extract(
    project: ProjectInfo,
    options: ExtractOptions
  ): Promise<ExtractResult>;
}

/**
 * Registry for source extractor plugins.
 */
export class ExtractorRegistry {
  private extractors = new Map<string, SourceExtractor>();

  /**
   * Register an extractor plugin.
   */
  register(extractor: SourceExtractor): void {
    this.extractors.set(extractor.id, extractor);
  }

  /**
   * Unregister an extractor plugin.
   */
  unregister(id: string): boolean {
    return this.extractors.delete(id);
  }

  /**
   * Get an extractor by ID.
   */
  get(id: string): SourceExtractor | undefined {
    return this.extractors.get(id);
  }

  /**
   * Get all registered extractors.
   */
  getAll(): SourceExtractor[] {
    return Array.from(this.extractors.values());
  }

  /**
   * Find extractors that can handle the given project.
   * Returns extractors sorted by priority (highest first).
   */
  async findMatching(project: ProjectInfo): Promise<SourceExtractor[]> {
    const matches: SourceExtractor[] = [];

    for (const extractor of this.extractors.values()) {
      try {
        if (await extractor.detect(project)) {
          matches.push(extractor);
        }
      } catch {
        // Skip extractors that fail detection
      }
    }

    return matches.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Find extractors for a specific framework.
   */
  findByFramework(framework: string): SourceExtractor[] {
    const matches: SourceExtractor[] = [];

    for (const extractor of this.extractors.values()) {
      if (extractor.frameworks.includes(framework)) {
        matches.push(extractor);
      }
    }

    return matches.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Alias for findByFramework.
   */
  findForFramework(framework: string): SourceExtractor[] {
    return this.findByFramework(framework);
  }

  /**
   * Check if an extractor exists for the given framework.
   */
  hasExtractorFor(framework: string): boolean {
    for (const extractor of this.extractors.values()) {
      if (
        extractor.frameworks.includes(framework) ||
        extractor.id === framework
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get list of all supported framework IDs.
   */
  getSupportedFrameworks(): string[] {
    const frameworks = new Set<string>();
    for (const extractor of this.extractors.values()) {
      frameworks.add(extractor.id);
      for (const fw of extractor.frameworks) {
        frameworks.add(fw);
      }
    }
    return Array.from(frameworks);
  }
}

/**
 * Global extractor registry instance.
 */
export const extractorRegistry = new ExtractorRegistry();

/**
 * Register built-in extractors.
 * Called automatically when the module is imported.
 */
export function registerBuiltInExtractors(): void {
  // Built-in extractors are registered in extractors/index.ts
  // This function is called after all extractors are imported
}
