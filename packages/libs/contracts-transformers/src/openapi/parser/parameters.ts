import type {
  OpenApiDocument,
  OpenApiParameter,
  ParsedParameter,
  OpenApiSchema,
} from '../types';
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { isReference, resolveRef, dereferenceSchema } from './resolvers';

/**
 * Parse parameters from an operation.
 */
export function parseParameters(
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
      schema: dereferenceSchema(doc, resolved.schema as OpenApiSchema) as OpenApiSchema,
      deprecated: resolved.deprecated ?? false,
    };

    result[resolved.in as keyof typeof result]?.push(parsed);
  }

  return result;
}
