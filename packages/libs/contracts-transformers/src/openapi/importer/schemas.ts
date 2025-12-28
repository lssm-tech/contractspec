import type { OpenApiSchema, ParsedOperation } from '../types';

/**
 * Build separate input schemas for each parameter source.
 */
export function buildInputSchemas(operation: ParsedOperation): {
  body?: OpenApiSchema;
  query?: OpenApiSchema;
  params?: OpenApiSchema;
  headers?: OpenApiSchema;
} {
  const result: {
    body?: OpenApiSchema;
    query?: OpenApiSchema;
    params?: OpenApiSchema;
    headers?: OpenApiSchema;
  } = {};

  // Path parameters -> params
  if (operation.pathParams.length > 0) {
    result.params = {
      type: 'object',
      properties: operation.pathParams.reduce(
        (acc, p) => {
          acc[p.name] = p.schema;
          return acc;
        },
        {} as Record<string, OpenApiSchema>
      ),
      required: operation.pathParams.map((p) => p.name),
    } as unknown as OpenApiSchema;
  }

  // Query parameters -> query
  if (operation.queryParams.length > 0) {
    result.query = {
      type: 'object',
      properties: operation.queryParams.reduce(
        (acc, p) => {
          acc[p.name] = p.schema;
          return acc;
        },
        {} as Record<string, OpenApiSchema>
      ),
      required: operation.queryParams
        .filter((p) => p.required)
        .map((p) => p.name),
    } as unknown as OpenApiSchema;
  }

  // Header parameters -> headers
  const excludedHeaders = [
    'authorization',
    'content-type',
    'accept',
    'user-agent',
  ];
  const actualHeaders = operation.headerParams.filter(
    (p) => !excludedHeaders.includes(p.name.toLowerCase())
  );
  if (actualHeaders.length > 0) {
    result.headers = {
      type: 'object',
      properties: actualHeaders.reduce(
        (acc, p) => {
          acc[p.name] = p.schema;
          return acc;
        },
        {} as Record<string, OpenApiSchema>
      ),
      required: actualHeaders.filter((p) => p.required).map((p) => p.name),
    } as unknown as OpenApiSchema;
  }

  // Request body -> body
  if (operation.requestBody?.schema) {
    result.body = operation.requestBody.schema;
  }

  return result;
}

/**
 * Get the output schema from the operation responses.
 */
export function getOutputSchema(
  operation: ParsedOperation
): OpenApiSchema | null {
  // Prefer 200, then 201, then 2xx responses
  const successCodes = ['200', '201', '202', '204'];

  for (const code of successCodes) {
    const response = operation.responses[code];
    if (response?.schema) {
      return response.schema;
    }
  }

  // Check for any 2xx response
  for (const [code, response] of Object.entries(operation.responses)) {
    if (code.startsWith('2') && response.schema) {
      return response.schema;
    }
  }

  return null;
}
