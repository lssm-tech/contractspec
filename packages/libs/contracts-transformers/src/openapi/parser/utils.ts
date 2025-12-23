import { parse as parseYaml } from 'yaml';
import type { OpenApiDocument, HttpMethod, OpenApiVersion } from '../types';

export const HTTP_METHODS: HttpMethod[] = [
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
 * Generate an operationId if not present.
 */
export function generateOperationId(method: HttpMethod, path: string): string {
  // Convert path to camelCase operationId
  const pathParts = path
    .split('/')
    .filter(Boolean)
    .map((part) => {
      // Remove path parameters
      if (part.startsWith('{') && part.endsWith('}')) {
        return (
          'By' + part.slice(1, -1).charAt(0).toUpperCase() + part.slice(2, -1)
        );
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    });

  return method + pathParts.join('');
}
