import type { FeatureId } from '../core/config.js';
import type { MergedFeatures } from '../core/feature-merger.js';

/**
 * Options passed to every target generator.
 */
export interface GenerateOptions {
  /** Project root directory */
  projectRoot: string;
  /** Base directory within the project (for monorepo) */
  baseDir: string;
  /** Merged features from all active packs */
  features: MergedFeatures;
  /** Which features to generate */
  enabledFeatures: FeatureId[];
  /** Whether to delete existing generated files first */
  deleteExisting: boolean;
  /** Whether this is a global (user-scope) generation */
  global: boolean;
  /** Verbose logging */
  verbose: boolean;
  /** Active model profile name (from workspace config) */
  modelProfile?: string;
}

/**
 * Result from a target generation run.
 */
export interface GenerateResult {
  /** Target identifier */
  targetId: string;
  /** Files that were written */
  filesWritten: string[];
  /** Files that were deleted */
  filesDeleted: string[];
  /** Warnings during generation */
  warnings: string[];
}

/**
 * Abstract base class for all target generators.
 */
export abstract class BaseTarget {
  abstract readonly id: string;
  abstract readonly name: string;

  /**
   * Which features this target supports.
   */
  abstract readonly supportedFeatures: FeatureId[];

  /**
   * Generate output files for this target.
   */
  abstract generate(options: GenerateOptions): GenerateResult;

  /**
   * Check if a feature is supported by this target.
   */
  supportsFeature(feature: FeatureId): boolean {
    return this.supportedFeatures.includes(feature);
  }

  /**
   * Get the effective features to generate (intersection of enabled + supported).
   */
  protected getEffectiveFeatures(enabledFeatures: FeatureId[]): FeatureId[] {
    return enabledFeatures.filter((f) => this.supportsFeature(f));
  }

  /**
   * Helper to create a standard result.
   */
  protected createResult(
    filesWritten: string[] = [],
    filesDeleted: string[] = [],
    warnings: string[] = []
  ): GenerateResult {
    return {
      targetId: this.id,
      filesWritten,
      filesDeleted,
      warnings,
    };
  }
}
