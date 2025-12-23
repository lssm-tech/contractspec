import type { ParsedOperation, OpenApiSchema } from '../types';

/**
 * Build a merged input schema from all parameter sources.
 */
export function buildInputSchema(operation: ParsedOperation): {
  schema: OpenApiSchema | null;
  fields: { name: string; schema: OpenApiSchema; required: boolean }[];
} {
  const fields: {
    name: string;
    schema: OpenApiSchema;
    required: boolean;
  }[] = [];

  // Add path parameters
  for (const param of operation.pathParams) {
    fields.push({
      name: param.name,
      schema: param.schema,
      required: true, // Path params are always required
    });
  }

  // Add query parameters
  for (const param of operation.queryParams) {
    fields.push({
      name: param.name,
      schema: param.schema,
      required: param.required,
    });
  }

  // Add header parameters (excluding common headers)
  const excludedHeaders = [
    'authorization',
    'content-type',
    'accept',
    'user-agent',
  ];
  for (const param of operation.headerParams) {
    if (!excludedHeaders.includes(param.name.toLowerCase())) {
      fields.push({
        name: param.name,
        schema: param.schema,
        required: param.required,
      });
    }
  }

  // Add request body fields
  if (operation.requestBody?.schema) {
    const bodySchema = operation.requestBody.schema;
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
      }
    } else {
      // Reference to a schema - add as a single field
      fields.push({
        name: 'body',
        schema: bodySchema,
        required: operation.requestBody.required,
      });
    }
  }

  if (fields.length === 0) {
    return { schema: null, fields: [] };
  }

  // Build a merged schema
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
