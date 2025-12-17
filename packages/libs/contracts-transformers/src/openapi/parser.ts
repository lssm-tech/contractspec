/**
 * OpenAPI document parser.
 * Parses OpenAPI 3.x documents from JSON/YAML files or URLs.
 */

import { parse as parseYaml } from 'yaml';
import type {
  OpenApiDocument,
  OpenApiParseOptions,
  ParseResult,
  ParsedOperation,
  ParsedParameter,
  HttpMethod,
  OpenApiVersion,
  OpenApiSchema,
  OpenApiParameter,
  OpenApiServer,
} from './types';
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';

const HTTP_METHODS: HttpMethod[] = [
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'head',
  'options',
  'trace',
];

/**
 * Parse an OpenAPI document from a string (JSON or YAML).
 */
export function parseOpenApiString(
  content: string,
  format: 'json' | 'yaml' = 'json'
): OpenApiDocument {
  if (format === 'yaml') {
    return parseYaml(content) as OpenApiDocument;
  }
  return JSON.parse(content) as OpenApiDocument;
}

/**
 * Detect the format of content (JSON or YAML).
 */
export function detectFormat(content: string): 'json' | 'yaml' {
  const trimmed = content.trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }
  return 'yaml';
}

/**
 * Detect OpenAPI version from document.
 */
export function detectVersion(doc: OpenApiDocument): OpenApiVersion {
  const version = doc.openapi;
  if (version.startsWith('3.1')) {
    return '3.1';
  }
  return '3.0';
}

/**
 * Check if a value is a reference object.
 */
function isReference(
  obj: unknown
): obj is OpenAPIV3.ReferenceObject | OpenAPIV3_1.ReferenceObject {
  return typeof obj === 'object' && obj !== null && '$ref' in obj;
}

/**
 * Resolve a $ref reference in the document.
 */
function resolveRef<T>(doc: OpenApiDocument, ref: string): T | undefined {
  // Only support local refs for now
  if (!ref.startsWith('#/')) {
    return undefined;
  }

  const path = ref.slice(2).split('/');
  let current: unknown = doc;

  for (const part of path) {
    if (current === null || current === undefined) return undefined;
    if (typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }

  return current as T;
}

/**
 * Resolve a schema, following $ref if needed.
 */
function resolveSchema(
  doc: OpenApiDocument,
  schema: OpenApiSchema | undefined
): OpenApiSchema | undefined {
  if (!schema) return undefined;
  if (isReference(schema)) {
    return resolveRef<OpenApiSchema>(doc, schema.$ref) ?? schema;
  }
  return schema;
}

/**
 * Parse parameters from an operation.
 */
function parseParameters(
  doc: OpenApiDocument,
  params: OpenApiParameter[] | undefined
): {
  path: ParsedParameter[];
  query: ParsedParameter[];
  header: ParsedParameter[];
  cookie: ParsedParameter[];
} {
  const result = {
    path: [] as ParsedParameter[],
    query: [] as ParsedParameter[],
    header: [] as ParsedParameter[],
    cookie: [] as ParsedParameter[],
  };

  if (!params) return result;

  for (const param of params) {
    let resolved: OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject;

    if (isReference(param)) {
      const ref = resolveRef<
        OpenAPIV3.ParameterObject | OpenAPIV3_1.ParameterObject
      >(doc, param.$ref);
      if (!ref) continue;
      resolved = ref;
    } else {
      resolved = param;
    }

    const parsed: ParsedParameter = {
      name: resolved.name,
      in: resolved.in as ParsedParameter['in'],
      required: resolved.required ?? resolved.in === 'path',
      description: resolved.description,
      schema: resolved.schema as OpenApiSchema,
      deprecated: resolved.deprecated ?? false,
    };

    result[resolved.in as keyof typeof result]?.push(parsed);
  }

  return result;
}

/**
 * Generate an operationId if not present.
 */
function generateOperationId(method: HttpMethod, path: string): string {
  // Convert path to camelCase operationId
  const pathParts = path
    .split('/')
    .filter(Boolean)
    .map((part) => {
      // Remove path parameters
      if (part.startsWith('{') && part.endsWith('}')) {
        return 'By' + part.slice(1, -1).charAt(0).toUpperCase() + part.slice(2, -1);
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    });

  return method + pathParts.join('');
}

/**
 * Parse a single operation.
 */
function parseOperation(
  doc: OpenApiDocument,
  method: HttpMethod,
  path: string,
  operation: OpenAPIV3.OperationObject | OpenAPIV3_1.OperationObject,
  pathParams: OpenApiParameter[] | undefined
): ParsedOperation {
  // Merge path-level and operation-level parameters
  const allParams = [...(pathParams ?? []), ...(operation.parameters ?? [])];
  const params = parseParameters(doc, allParams as OpenApiParameter[]);

  // Parse request body
  let requestBody: ParsedOperation['requestBody'];
  if (operation.requestBody) {
    const body = isReference(operation.requestBody)
      ? resolveRef<OpenAPIV3.RequestBodyObject | OpenAPIV3_1.RequestBodyObject>(
          doc,
          operation.requestBody.$ref
        )
      : operation.requestBody;

    if (body) {
      const contentType =
        Object.keys(body.content ?? {})[0] ?? 'application/json';
      const content = body.content?.[contentType];
      if (content?.schema) {
        requestBody = {
          required: body.required ?? false,
          schema: resolveSchema(doc, content.schema as OpenApiSchema)!,
          contentType,
        };
      }
    }
  }

  // Parse responses
  const responses: ParsedOperation['responses'] = {};
  for (const [status, response] of Object.entries(operation.responses ?? {})) {
    const resolved = isReference(response)
      ? resolveRef<OpenAPIV3.ResponseObject | OpenAPIV3_1.ResponseObject>(
          doc,
          response.$ref
        )
      : response;

    if (resolved) {
      const contentType = Object.keys(resolved.content ?? {})[0];
      const content = contentType ? resolved.content?.[contentType] : undefined;

      responses[status] = {
        description: resolved.description,
        schema: content?.schema
          ? resolveSchema(doc, content.schema as OpenApiSchema)
          : undefined,
        contentType,
      };
    }
  }

  // Check for x-contractspec extension
  const contractSpecMeta = (
    operation as Record<string, unknown>
  )?.['x-contractspec'] as ParsedOperation['contractSpecMeta'];

  return {
    operationId:
      operation.operationId ?? generateOperationId(method, path),
    method,
    path,
    summary: operation.summary,
    description: operation.description,
    tags: operation.tags ?? [],
    pathParams: params.path,
    queryParams: params.query,
    headerParams: params.header,
    cookieParams: params.cookie,
    requestBody,
    responses,
    deprecated: operation.deprecated ?? false,
    security: operation.security as ParsedOperation['security'],
    contractSpecMeta,
  };
}

/**
 * Parse an OpenAPI document into a structured result.
 */
export function parseOpenApiDocument(
  doc: OpenApiDocument,
  _options: OpenApiParseOptions = {}
): ParseResult {
  const version = detectVersion(doc);
  const warnings: string[] = [];
  const operations: ParsedOperation[] = [];

  // Parse operations from paths
  for (const [path, pathItem] of Object.entries(doc.paths ?? {})) {
    if (!pathItem) continue;

    // Get path-level parameters
    const pathParams = (pathItem as OpenAPIV3.PathItemObject).parameters;

    for (const method of HTTP_METHODS) {
      const operation = (pathItem as Record<string, unknown>)[method] as
        | OpenAPIV3.OperationObject
        | OpenAPIV3_1.OperationObject
        | undefined;

      if (operation) {
        try {
          operations.push(
            parseOperation(
              doc,
              method,
              path,
              operation,
              pathParams as OpenApiParameter[]
            )
          );
        } catch (error) {
          warnings.push(
            `Failed to parse ${method.toUpperCase()} ${path}: ${error}`
          );
        }
      }
    }
  }

  // Extract component schemas
  const schemas: Record<string, OpenApiSchema> = {};
  const components = doc.components;
  if (components?.schemas) {
    for (const [name, schema] of Object.entries(components.schemas)) {
      schemas[name] = schema as OpenApiSchema;
    }
  }

  // Parse servers
  const servers: OpenApiServer[] = (doc.servers ?? []).map((s) => ({
    url: s.url,
    description: s.description,
    variables: s.variables as OpenApiServer['variables'],
  }));

  return {
    document: doc,
    version,
    info: {
      title: doc.info.title,
      version: doc.info.version,
      description: doc.info.description,
    },
    operations,
    schemas,
    servers,
    warnings,
  };
}

/**
 * Parse OpenAPI from a file path or URL.
 * Note: This is an async function that requires I/O adapters.
 * For pure parsing, use parseOpenApiString or parseOpenApiDocument.
 */
export async function parseOpenApi(
  source: string,
  options: OpenApiParseOptions & {
    fetch?: typeof globalThis.fetch;
    readFile?: (path: string) => Promise<string>;
  } = {}
): Promise<ParseResult> {
  const { fetch: fetchFn = globalThis.fetch, readFile, timeout = 30000 } = options;

  let content: string;
  let format: 'json' | 'yaml';

  if (source.startsWith('http://') || source.startsWith('https://')) {
    // Fetch from URL
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetchFn(source, { signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      content = await response.text();
    } finally {
      clearTimeout(timeoutId);
    }

    // Detect format from URL or content
    if (source.endsWith('.yaml') || source.endsWith('.yml')) {
      format = 'yaml';
    } else if (source.endsWith('.json')) {
      format = 'json';
    } else {
      format = detectFormat(content);
    }
  } else {
    // Read from file
    if (!readFile) {
      throw new Error('readFile adapter required for file paths');
    }
    content = await readFile(source);

    // Detect format from extension or content
    if (source.endsWith('.yaml') || source.endsWith('.yml')) {
      format = 'yaml';
    } else if (source.endsWith('.json')) {
      format = 'json';
    } else {
      format = detectFormat(content);
    }
  }

  const doc = parseOpenApiString(content, format);
  return parseOpenApiDocument(doc, options);
}

