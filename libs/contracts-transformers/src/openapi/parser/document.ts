import type {
  OpenApiDocument,
  OpenApiParameter,
  OpenApiParseOptions,
  OpenApiSchema,
  OpenApiServer,
  ParsedEvent,
  ParsedOperation,
  ParseResult,
} from '../types';
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import {
  detectFormat,
  detectVersion,
  HTTP_METHODS,
  parseOpenApiString,
} from './utils';
import { parseOperation } from './operation';

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
  // Parse servers
  const servers: OpenApiServer[] = (doc.servers ?? []).map((s) => ({
    url: s.url,
    description: s.description,
    variables: s.variables as OpenApiServer['variables'],
  }));

  // Parse webhooks (as events)
  const events: ParsedEvent[] = [];
  if ('webhooks' in doc && doc.webhooks) {
    for (const [name, pathItem] of Object.entries(doc.webhooks)) {
      if (typeof pathItem !== 'object' || !pathItem) continue;
      // Webhooks usually have a POST method defining the payload
      const operation = (pathItem as Record<string, unknown>)['post'] as
        | OpenAPIV3.OperationObject
        | OpenAPIV3_1.OperationObject
        | undefined;

      if (operation && operation.requestBody) {
        if ('$ref' in operation.requestBody) {
          throw new Error(`'$ref' isn't supported`);
        }
        // Extract payload schema
        const content = operation.requestBody.content?.['application/json'];
        if (content?.schema) {
          events.push({
            name,
            description: operation.summary || operation.description,
            payload: content.schema,
          });
        }
      }
    }
  }

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
    events,
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
  const {
    fetch: fetchFn = globalThis.fetch,
    readFile,
    timeout = 30000,
  } = options;

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
