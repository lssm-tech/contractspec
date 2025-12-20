import type {
  OpenApiDocument,
  ParsedOperation,
  HttpMethod,
  OpenApiParameter,
  OpenApiSchema,
} from '../types';
import type { OpenAPIV3, OpenAPIV3_1 } from 'openapi-types';
import { isReference, resolveRef, resolveSchema } from './resolvers';
import { parseParameters } from './parameters';
import { generateOperationId } from './utils';

/**
 * Parse a single operation.
 */
export function parseOperation(
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
          schema:
            resolveSchema(doc, content.schema as OpenApiSchema) ??
            ({} as OpenApiSchema),
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
  const contractSpecMeta = (operation as Record<string, unknown>)?.[
    'x-contractspec'
  ] as ParsedOperation['contractSpecMeta'];

  return {
    operationId: operation.operationId ?? generateOperationId(method, path),
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
