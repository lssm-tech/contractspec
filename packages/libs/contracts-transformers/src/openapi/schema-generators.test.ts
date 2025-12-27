import { describe, it, expect } from 'bun:test';
import { generateSchemaModelCode } from './schema-converter';
import type { OpenApiSchema } from './types';
import type { ContractsrcConfig } from '@lssm/lib.contracts';

const mockConfig: ContractsrcConfig = {
  conventions: { models: 'models' },
} as any;

describe('Schema Generators', () => {
  const userSchema: OpenApiSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      username: { type: 'string' },
      age: { type: 'integer' },
      active: { type: 'boolean' },
    },
    required: ['id', 'username'],
  };

  it('generates ContractSpec schema by default', () => {
    const result = generateSchemaModelCode(
      userSchema,
      'User',
      0,
      'contractspec',
      mockConfig
    );
    expect(result.code).toContain('defineSchemaModel');
    expect(result.code).toContain('ScalarTypeEnum.ID()');
    expect(result.name).toBe('User');
  });

  it('generates Zod schema', () => {
    const result = generateSchemaModelCode(
      userSchema,
      'User',
      0,
      'zod',
      mockConfig
    );
    expect(result.code).toContain('z.object');
    expect(result.code).toContain('z.string().uuid()');
    expect(result.code).toContain('new ZodSchemaType(UserSchema, { name:');
    expect(result.name).toBe('User');
    expect(result.imports?.some((i) => i.includes('zod'))).toBe(true);
  });

  it('generates JSON schema', () => {
    const result = generateSchemaModelCode(
      userSchema,
      'User',
      0,
      'json-schema',
      mockConfig
    );
    expect(result.code).toContain('const UserSchema = {');
    expect(result.code).toContain('"type": "object"');
    expect(result.code).toContain('new JsonSchemaType(UserSchema)');
    expect(result.name).toBe('User');
  });

  it('generates GraphQL schema', () => {
    const result = generateSchemaModelCode(
      userSchema,
      'User',
      0,
      'graphql',
      mockConfig
    );
    expect(result.code).toContain('type User {');
    expect(result.code).toContain('id: ID!');
    expect(result.code).toContain('username: String!');
    expect(result.code).toContain('age: Int'); // optional
    expect(result.code).toContain("new GraphQLSchemaType(UserTypeDef, 'User')");
    expect(result.name).toBe('User');
    expect(result.imports).toContain(
      "import { GraphQLSchemaType } from '@lssm/lib.schema';"
    );
  });
});

describe('Nested Models', () => {
  const nestedSchema: OpenApiSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          city: { type: 'string' },
        },
        required: ['street'],
      },
    },
  };

  it('generates nested models for ContractSpec', () => {
    const result = generateSchemaModelCode(
      nestedSchema,
      'UserProfile',
      0,
      'contractspec',
      mockConfig
    );
    // Should include UserProfileAddress definition (flattened/hoisted)
    expect(result.code).toContain(
      'export const UserProfileAddress = defineSchemaModel'
    );
    expect(result.code).toContain("name: 'UserProfileAddress'");
    // And parent referencing it
    expect(result.code).toContain('type: UserProfileAddress,');
  });

  it('generates nested models for Zod (inline)', () => {
    const result = generateSchemaModelCode(
      nestedSchema,
      'UserProfile',
      0,
      'zod',
      mockConfig
    );
    // Zod generator handles nesting inline
    expect(result.code).toContain('address: z.object({');
    expect(result.code).toContain('city: z.string().optional()');
  });
});
