/**
 * Intermediate Representation (IR) types for source extraction.
 *
 * The IR provides a framework-agnostic representation of API endpoints,
 * schemas, errors, and events discovered in source code.
 */

/**
 * Confidence level for extracted candidates.
 * Indicates how certain we are about the extraction.
 */
export type ConfidenceLevel = 'high' | 'medium' | 'low' | 'ambiguous';

/**
 * Reason for the assigned confidence level.
 */
export type ConfidenceReason =
  | 'explicit-schema' // Zod/class-validator/JSON Schema found
  | 'explicit-decorator' // Framework decorator with type info
  | 'inferred-types' // TypeScript types only, no runtime schema
  | 'decorator-hints' // Framework decorators without explicit types
  | 'naming-convention' // Guessed from naming patterns
  | 'missing-schema' // No schema information found
  | 'partial-extraction'; // Some parts could not be extracted

/**
 * Source location information.
 */
export interface SourceLocation {
  /** File path (relative to project root) */
  file: string;
  /** Start line number (1-indexed) */
  startLine: number;
  /** End line number (1-indexed) */
  endLine: number;
  /** Optional column information */
  startColumn?: number;
  endColumn?: number;
}

/**
 * HTTP method types.
 */
export type HttpMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS';

/**
 * Operation kind derived from HTTP method or explicit annotation.
 */
export type OpKind = 'command' | 'query';

/**
 * Confidence metadata attached to extracted items.
 */
export interface ConfidenceMeta {
  level: ConfidenceLevel;
  reasons: ConfidenceReason[];
  notes?: string[];
}

/**
 * Schema candidate extracted from source code.
 * Can represent Zod schemas, class-validator DTOs, JSON Schema, etc.
 */
export interface SchemaCandidate {
  /** Unique identifier for this schema */
  id: string;
  /** Schema name (e.g., class name, export name) */
  name: string;
  /** Type of schema source */
  schemaType:
    | 'zod'
    | 'class-validator'
    | 'json-schema'
    | 'typebox'
    | 'typescript'
    | 'unknown';
  /** Raw schema definition (for Zod, the code; for class-validator, the class def) */
  rawDefinition?: string;
  /** Parsed fields if available */
  fields?: SchemaField[];
  /** Source location */
  source: SourceLocation;
  /** Confidence in this extraction */
  confidence: ConfidenceMeta;
}

/**
 * Individual field in a schema.
 */
export interface SchemaField {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
  validation?: string[];
}

/**
 * Endpoint candidate extracted from source code.
 * Represents an API route/handler.
 */
export interface EndpointCandidate {
  /** Unique identifier for this endpoint */
  id: string;
  /** HTTP method */
  method: HttpMethod;
  /** Route path (e.g., '/users/:id') */
  path: string;
  /** Operation kind (command/query) */
  kind: OpKind;
  /** Handler function name */
  handlerName: string;
  /** Controller/router name if applicable */
  controllerName?: string;
  /** Input schema reference */
  input?: SchemaRef;
  /** Output schema reference */
  output?: SchemaRef;
  /** Path parameters */
  pathParams?: SchemaRef;
  /** Query parameters */
  queryParams?: SchemaRef;
  /** Associated errors */
  errors?: ErrorRef[];
  /** Framework-specific metadata */
  frameworkMeta?: Record<string, unknown>;
  /** Source location */
  source: SourceLocation;
  /** Confidence in this extraction */
  confidence: ConfidenceMeta;
}

/**
 * Reference to a schema (either inline or by ID).
 */
export interface SchemaRef {
  /** Reference to a SchemaCandidate.id */
  ref?: string;
  /** Inline schema definition if not a reference */
  inline?: SchemaCandidate;
}

/**
 * Error candidate extracted from source code.
 */
export interface ErrorCandidate {
  /** Unique identifier for this error */
  id: string;
  /** Error name/code */
  name: string;
  /** HTTP status code if applicable */
  httpStatus?: number;
  /** Error description */
  description?: string;
  /** Error payload schema if any */
  payload?: SchemaRef;
  /** Source location */
  source: SourceLocation;
  /** Confidence in this extraction */
  confidence: ConfidenceMeta;
}

/**
 * Reference to an error.
 */
export interface ErrorRef {
  /** Reference to an ErrorCandidate.id */
  ref?: string;
  /** Condition when this error is thrown */
  when?: string;
}

/**
 * Event candidate extracted from source code.
 */
export interface EventCandidate {
  /** Unique identifier for this event */
  id: string;
  /** Event name/key */
  name: string;
  /** Event payload schema */
  payload?: SchemaRef;
  /** Source location */
  source: SourceLocation;
  /** Confidence in this extraction */
  confidence: ConfidenceMeta;
}

/**
 * Ambiguity detected during extraction.
 * Used to flag items that need human review.
 */
export interface Ambiguity {
  /** Type of ambiguous item */
  type: 'endpoint' | 'schema' | 'error' | 'event';
  /** Reference to the item ID */
  itemId: string;
  /** Description of the ambiguity */
  description: string;
  /** Suggested resolution */
  suggestion?: string;
  /** Source location */
  source: SourceLocation;
}

/**
 * Framework detection result.
 */
export interface FrameworkInfo {
  /** Framework identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Version if detected */
  version?: string;
  /** Detection confidence */
  confidence: ConfidenceLevel;
}

/**
 * Project information used for extraction.
 */
export interface ProjectInfo {
  /** Project root path */
  rootPath: string;
  /** Detected frameworks */
  frameworks: FrameworkInfo[];
  /** TypeScript config path if found */
  tsConfigPath?: string;
  /** Package.json path if found */
  packageJsonPath?: string;
}

/**
 * Options for extraction.
 */
export interface ExtractOptions {
  /** Force a specific framework */
  framework?: string;
  /** Limit extraction to specific paths (glob patterns) */
  scope?: string[];
  /** Exclude paths (glob patterns) */
  exclude?: string[];
  /** Include node_modules */
  includeNodeModules?: boolean;
  /** Extraction mode */
  mode?: 'full' | 'endpoints-only' | 'schemas-only';
}

/**
 * The complete Intermediate Representation of extracted contracts.
 */
export interface ImportIR {
  /** IR schema version */
  version: '1.0';
  /** Extraction timestamp (ISO 8601) */
  extractedAt: string;
  /** Project information */
  project: ProjectInfo;
  /** Extracted endpoints */
  endpoints: EndpointCandidate[];
  /** Extracted schemas */
  schemas: SchemaCandidate[];
  /** Extracted errors */
  errors: ErrorCandidate[];
  /** Extracted events */
  events: EventCandidate[];
  /** Detected ambiguities requiring review */
  ambiguities: Ambiguity[];
  /** Extraction statistics */
  stats: {
    filesScanned: number;
    endpointsFound: number;
    schemasFound: number;
    errorsFound: number;
    eventsFound: number;
    ambiguitiesFound: number;
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
  };
}

/**
 * Result of an extraction operation.
 */
export interface ExtractResult {
  success: boolean;
  ir?: ImportIR;
  errors?: ExtractError[];
}

/**
 * Error during extraction.
 */
export interface ExtractError {
  code: string;
  message: string;
  source?: SourceLocation;
  recoverable: boolean;
}
