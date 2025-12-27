import { z } from 'zod';
import type { SchemaModelType } from './SchemaModelType';

/**
 * Wrapper for GraphQL Type Definitions to be used in ContractSpec Schemas.
 * Note: Runtime validation is limited to 'unknown' (pass-through) as SDL is not parsed at runtime.
 */
export class GraphQLSchemaType implements SchemaModelType {
  readonly _isSchemaType = true;

  constructor(
    public readonly typeDef: string,
    public readonly name: string
  ) {}

  getZod(): z.ZodType {
    return z.unknown();
  }
}
