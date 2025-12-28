/**
 * OpenAPI types and ContractSpec mapping types.
 */

import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import type { SpecSource, TransportHints } from '../common/types';
import type {
  FolderConventions,
  OpenApiSourceConfig,
} from '@contractspec/lib.contracts';

// Re-export config types for convenience
export type { OpenApiSourceConfig, FolderConventions };

/**
 * OpenAPI import options (alias for OpenApiSource from config).
 * @deprecated Use OpenApiSource from @contractspec/lib.contracts instead
 */
export type OpenApiImportOptions = Partial<OpenApiSourceConfig>;

/**
 * Supported OpenAPI versions.
 */
export type OpenApiVersion = '3.0' | '3.1';

/**
 * OpenAPI document (union of supported versions).
 */
export type OpenApiDocument = OpenAPIV3.Document | OpenAPIV3_1.Document;

/**
 * OpenAPI operation object.
 */
export type OpenApiOperation =
  | OpenAPIV3.OperationObject
  | OpenAPIV3_1.OperationObject;

/**
 * OpenAPI schema object.
 */
export type OpenApiSchema =
  | OpenAPIV3.SchemaObject
  | OpenAPIV3_1.SchemaObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.ReferenceObject;

/**
 * OpenAPI parameter object.
 */
export type OpenApiParameter =
  | OpenAPIV3.ParameterObject
  | OpenAPIV3_1.ParameterObject
  | OpenAPIV3.ReferenceObject
  | OpenAPIV3_1.ReferenceObject;

/**
 * HTTP methods supported by OpenAPI.
 */
export type HttpMethod =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'head'
  | 'options'
  | 'trace';

/**
 * Parameter location in OpenAPI.
 */
export type ParameterLocation = 'path' | 'query' | 'header' | 'cookie';

/**
 * Server configuration for OpenAPI export.
 */
export interface OpenApiServer {
  url: string;
  description?: string;
  variables?: Record<
    string,
    {
      default: string;
      enum?: string[];
      description?: string;
    }
  >;
}

/**
 * Options for exporting to OpenAPI.
 */
export interface OpenApiExportOptions {
  /** API title */
  title?: string;
  /** API version */
  version?: string;
  /** API description */
  description?: string;
  /** Server configurations */
  servers?: OpenApiServer[];
  /** Additional OpenAPI extensions */
  extensions?: Record<string, unknown>;
}

/**
 * Options for parsing OpenAPI documents.
 */
export interface OpenApiParseOptions {
  /** Base URL for resolving relative references */
  baseUrl?: string;
  /** Whether to resolve $ref references */
  resolveRefs?: boolean;
  /** Timeout for HTTP requests (ms) */
  timeout?: number;
}

/**
 * Parsed operation with resolved metadata.
 */
export interface ParsedOperation {
  /** Operation ID (generated if not present) */
  operationId: string;
  /** HTTP method */
  method: HttpMethod;
  /** Path template */
  path: string;
  /** Operation summary */
  summary?: string;
  /** Operation description */
  description?: string;
  /** Operation tags */
  tags: string[];
  /** Path parameters */
  pathParams: ParsedParameter[];
  /** Query parameters */
  queryParams: ParsedParameter[];
  /** Header parameters */
  headerParams: ParsedParameter[];
  /** Cookie parameters */
  cookieParams: ParsedParameter[];
  /** Request body schema */
  requestBody?: {
    required: boolean;
    schema: OpenApiSchema;
    contentType: string;
  };
  /** Response schemas by status code */
  responses: Record<
    string,
    {
      description: string;
      schema?: OpenApiSchema;
      contentType?: string;
    }
  >;
  /** Whether the operation is deprecated */
  deprecated: boolean;
  /** Security requirements */
  security?: Record<string, string[]>[];
  /** ContractSpec extension data if present */
  contractSpecMeta?: {
    name: string;
    version: string;
    kind: 'command' | 'query';
  };
}

/**
 * Parsed parameter with resolved schema.
 */
export interface ParsedParameter {
  /** Parameter name */
  name: string;
  /** Parameter location */
  in: ParameterLocation;
  /** Whether the parameter is required */
  required: boolean;
  /** Parameter description */
  description?: string;
  /** Parameter schema */
  schema: OpenApiSchema;
  /** Whether the parameter is deprecated */
  deprecated: boolean;
}

/**
 * Result of parsing an OpenAPI document.
 */
export interface ParseResult {
  /** Original document */
  document: OpenApiDocument;
  /** Detected OpenAPI version */
  version: OpenApiVersion;
  /** API info */
  info: {
    title: string;
    version: string;
    description?: string;
  };
  /** Parsed operations */
  operations: ParsedOperation[];
  /** Component schemas (resolved) */
  schemas: Record<string, OpenApiSchema>;
  /** Servers */
  servers: OpenApiServer[];
  /** Parse warnings */
  warnings: string[];
  /** Parsed events (webhooks) */
  events: ParsedEvent[];
}

/**
 * Parsed event (webhook).
 */
export interface ParsedEvent {
  /** Event name */
  name: string;
  /** Event description */
  description?: string;
  /** Event payload schema */
  payload: OpenApiSchema;
}

/**
 * OpenAPI-specific transport hints.
 */
export interface OpenApiTransportHints extends TransportHints {
  rest: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
    path: string;
    params?: {
      path?: string[];
      query?: string[];
      header?: string[];
      cookie?: string[];
    };
  };
}

/**
 * OpenAPI-specific source information.
 */
export interface OpenApiSource extends SpecSource {
  type: 'openapi';
  /** OpenAPI version of source document */
  openApiVersion: OpenApiVersion;
  /** Original operationId from OpenAPI */
  operationId: string;
}

/**
 * ContractSpec-compatible OpenAPI document structure.
 * Used for export to maintain compatibility with existing code.
 */
export interface ContractSpecOpenApiDocument {
  openapi: '3.1.0';
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: OpenApiServer[];
  paths: Record<string, Record<string, unknown>>;
  components: {
    schemas: Record<string, Record<string, unknown>>;
  };
  /** ContractSpec extensions for features */
  'x-contractspec-features'?: unknown[];
  /** ContractSpec extensions for events */
  'x-contractspec-events'?: unknown[];
  /** ContractSpec extensions for presentations */
  'x-contractspec-presentations'?: unknown[];
  /** ContractSpec extensions for forms */
  'x-contractspec-forms'?: unknown[];
  /** ContractSpec extensions for data views */
  'x-contractspec-dataviews'?: unknown[];
  /** ContractSpec extensions for workflows */
  'x-contractspec-workflows'?: unknown[];
}

/**
 * Unified export options for all ContractSpec surfaces.
 */
export interface ContractSpecExportOptions extends OpenApiExportOptions {
  /** Include operations in export (default: true) */
  operations?: boolean;
  /** Include events in export (default: true) */
  events?: boolean;
  /** Include features in export (default: true) */
  features?: boolean;
  /** Include presentations (V1 and V2) in export (default: true) */
  presentations?: boolean;
  /** Include forms in export (default: true) */
  forms?: boolean;
  /** Include data views in export (default: true) */
  dataViews?: boolean;
  /** Include workflows in export (default: true) */
  workflows?: boolean;
  /** Generate TypeScript registry code (default: true) */
  generateRegistries?: boolean;
}

/**
 * Generated registry code for a specific surface.
 */
export interface GeneratedRegistryCode {
  /** The generated TypeScript code */
  code: string;
  /** Suggested filename for the registry */
  fileName: string;
}

/**
 * Result of unified ContractSpec export.
 */
export interface ContractSpecExportResult {
  /** OpenAPI document with ContractSpec extensions */
  openApi: ContractSpecOpenApiDocument;
  /** Generated TypeScript code for registries */
  registries?: {
    operations?: GeneratedRegistryCode;
    events?: GeneratedRegistryCode;
    features?: GeneratedRegistryCode;
    presentations?: GeneratedRegistryCode;
    forms?: GeneratedRegistryCode;
    dataViews?: GeneratedRegistryCode;
    workflows?: GeneratedRegistryCode;
    /** Index file that re-exports all registries */
    index?: GeneratedRegistryCode;
  };
}
