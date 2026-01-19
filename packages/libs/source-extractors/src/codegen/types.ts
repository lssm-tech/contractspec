/**
 * Code generation types.
 */

/**
 * A generated file.
 */
export interface GeneratedFile {
  /** Relative path from output directory */
  path: string;
  /** File content */
  content: string;
  /** Type of generated file */
  type: 'operation' | 'schema' | 'registry' | 'index';
}

/**
 * Options for code generation.
 */
export interface GenerationOptions {
  /** Output directory */
  outputDir: string;
  /** Whether to overwrite existing files */
  overwrite?: boolean;
  /** Schema format to use */
  schemaFormat?: 'zod' | 'typescript';
  /** Default auth level */
  defaultAuth?: 'anonymous' | 'user' | 'admin';
  /** Default owners */
  defaultOwners?: string[];
  /** Prefix for generated names */
  prefix?: string;
}

/**
 * Result of code generation.
 */
export interface GenerationResult {
  /** Generated files */
  files: GeneratedFile[];
  /** Number of operations generated */
  operationsGenerated: number;
  /** Number of schemas generated */
  schemasGenerated: number;
  /** Warnings during generation */
  warnings: string[];
}
