import { describe, expect, it } from 'bun:test';
import { GraphQLSchemaType } from './GraphQLSchemaType';

describe('GraphQLSchemaType', () => {
  describe('constructor', () => {
    it('should create with type definition and name', () => {
      const gqlType = new GraphQLSchemaType(
        'type User { id: ID! name: String! }',
        'User'
      );

      expect(gqlType.typeDef).toBe('type User { id: ID! name: String! }');
      expect(gqlType.name).toBe('User');
    });

    it('should set _isSchemaType marker', () => {
      const gqlType = new GraphQLSchemaType('type Query { hello: String }', 'Query');
      expect(gqlType._isSchemaType).toBe(true);
    });
  });

  describe('getZod', () => {
    it('should return z.unknown for runtime validation', () => {
      const gqlType = new GraphQLSchemaType(
        'type Product { id: ID! price: Float! }',
        'Product'
      );

      const zodSchema = gqlType.getZod();
      
      // Should accept any value since SDL is not parsed at runtime
      expect(zodSchema.parse({ id: '123', price: 99.99 })).toEqual({
        id: '123',
        price: 99.99,
      });
      
      expect(zodSchema.parse('any string')).toBe('any string');
      expect(zodSchema.parse(123)).toBe(123);
      expect(zodSchema.parse(null)).toBeNull();
    });
  });

  describe('implements SchemaModelType', () => {
    it('should be usable as SchemaModelType', () => {
      const gqlType = new GraphQLSchemaType(
        'input CreateUserInput { name: String! email: String! }',
        'CreateUserInput'
      );

      // Verify it has getZod method
      expect(typeof gqlType.getZod).toBe('function');
      
      // Verify the schema works
      const schema = gqlType.getZod();
      expect(schema.parse({ test: 'value' })).toBeDefined();
    });
  });

  describe('typeDef property', () => {
    it('should store complete GraphQL type definition', () => {
      const complexTypeDef = `
        type Order {
          id: ID!
          items: [OrderItem!]!
          total: Float!
          createdAt: DateTime!
        }
      `;
      
      const gqlType = new GraphQLSchemaType(complexTypeDef, 'Order');
      expect(gqlType.typeDef).toBe(complexTypeDef);
    });
  });
});
