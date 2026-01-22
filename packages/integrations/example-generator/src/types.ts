import type { AnySchemaModel } from '@contractspec/lib.schema';
export type SpecDefinition = unknown;

/**
 * Configuration for the ExampleGeneratorPlugin
 */
export interface ExampleGeneratorPluginConfig {
  /** Directory where markdown files will be generated */
  outputDir: string;
  /** Output format: table, list, detail, or auto */
  format?: 'table' | 'list' | 'detail' | 'auto';
  /** Title for the generated documentation */
  title?: string;
  /** Description to include below the title */
  description?: string;
  /** Maximum number of items to render in tables */
  maxItems?: number;
  /** Maximum nesting depth for nested objects */
  maxDepth?: number;
  /** Only include these fields (if not specified, all fields are included) */
  includeFields?: string[];
  /** Exclude these fields from output */
  excludeFields?: string[];
  /** Custom field labels (field name -> display label) */
  fieldLabels?: Record<string, string>;
  /** Fields to use for summary in list format */
  summaryFields?: string[];
}

/**
 * Context provided during generation
 */
export interface GeneratorContext {
  /** The spec definition being processed */
  spec: SpecDefinition;
  /** Schema models from the spec */
  schemas: Record<string, AnySchemaModel>;
  /** Instance data (optional) */
  data?: unknown;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Result of generation
 */
export interface GeneratorResult {
  /** Path to the generated file */
  outputPath: string;
  /** Number of items processed */
  itemCount: number;
  /** Generation metadata */
  metadata: {
    specId: string;
    generatedAt: Date;
    format: string;
    config: Partial<ExampleGeneratorPluginConfig>;
  };
}

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly author: string;
  readonly homepage?: string;
}

/**
 * Error types for the plugin
 */
export class ExampleGeneratorError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ExampleGeneratorError';
  }
}

/**
 * Validation errors
 */
export class ValidationError extends ExampleGeneratorError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Configuration errors
 */
export class ConfigurationError extends ExampleGeneratorError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIGURATION_ERROR', details);
    this.name = 'ConfigurationError';
  }
}

/**
 * Generation errors
 */
export class GenerationError extends ExampleGeneratorError {
  constructor(message: string, details?: unknown) {
    super(message, 'GENERATION_ERROR', details);
    this.name = 'GenerationError';
  }
}
