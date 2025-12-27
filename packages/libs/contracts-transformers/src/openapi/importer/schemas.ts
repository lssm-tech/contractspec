import type { ParsedOperation, OpenApiSchema } from '../types';

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
      required: operation.queryParams.filter((p) => p.required).map((p) => p.name),
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
 * Build a merged input schema from all parameter sources (legacy/merged view).
 */
export function buildInputSchema(operation: ParsedOperation): {
  schema: OpenApiSchema | null;
  fields: { name: string; schema: OpenApiSchema; required: boolean }[];
} {
  const schemas = buildInputSchemas(operation);
  const fields: {
    name: string;
    schema: OpenApiSchema;
    required: boolean;
  }[] = [];

  // Path params
  if (schemas.params) {
    const props = (schemas.params as any).properties;
    const req = (schemas.params as any).required || [];
    for (const [name, schema] of Object.entries(props)) {
      fields.push({
        name,
        schema: schema as OpenApiSchema,
        required: req.includes(name),
      });
    }
  }

  // Query params
  if (schemas.query) {
    const props = (schemas.query as any).properties;
    const req = (schemas.query as any).required || [];
    for (const [name, schema] of Object.entries(props)) {
      fields.push({
        name,
        schema: schema as OpenApiSchema,
        required: req.includes(name),
      });
    }
  }

  // Header params
  if (schemas.headers) {
    const props = (schemas.headers as any).properties;
    const req = (schemas.headers as any).required || [];
    for (const [name, schema] of Object.entries(props)) {
      fields.push({
        name,
        schema: schema as OpenApiSchema,
        required: req.includes(name),
      });
    }
  }

  // Body
  if (schemas.body) {
    const bodySchema = schemas.body;
    if (!('$ref' in bodySchema)) {
      const schemaObj = bodySchema as Record<string, unknown>;
      const properties = schemaObj['properties'] as
        | Record<string, OpenApiSchema>
        | undefined;
      const required = (schemaObj['required'] as string[]) ?? [];

      if (properties) {
        for (const [propName, propSchema] of Object.entries(properties)) {
          fields.push({
            name: propName,
            schema: propSchema,
            required: required.includes(propName),
          });
        }
      } else {
         // Generic body
         fields.push({ name: 'body', schema: bodySchema, required: true });
      }
    } else {
      fields.push({
        name: 'body',
        schema: bodySchema,
        required: operation.requestBody?.required ?? false,
      });
    }
  }

  if (fields.length === 0) {
    return { schema: null, fields: [] };
  }

  const mergedSchema: OpenApiSchema = {
    type: 'object',
    properties: fields.reduce(
      (acc, f) => {
        acc[f.name] = f.schema;
        return acc;
      },
      {} as Record<string, OpenApiSchema>
    ),
    required: fields.filter((f) => f.required).map((f) => f.name),
  } as unknown as OpenApiSchema;

  return { schema: mergedSchema, fields };
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
