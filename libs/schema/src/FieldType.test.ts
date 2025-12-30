import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import { FieldType } from './FieldType';
import { Kind } from 'graphql';

describe('FieldType', () => {
  describe('constructor and basic methods', () => {
    it('should create a field type with all required config', () => {
      const stringField = new FieldType<string>({
        name: 'TestString',
        description: 'A test string field',
        zod: z.string(),
        parseValue: (v) => String(v),
        serialize: (v) => v as string,
        jsonSchema: { type: 'string' },
      });

      expect(stringField.name).toBe('TestString');
      expect(stringField.description).toBe('A test string field');
    });
  });

  describe('getZod', () => {
    it('should return the attached zod schema', () => {
      const emailField = new FieldType<string>({
        name: 'Email',
        zod: z.string().email(),
        parseValue: (v) => z.string().email().parse(v),
        serialize: (v) => v as string,
        jsonSchema: { type: 'string', format: 'email' },
      });

      const zodSchema = emailField.getZod();
      expect(zodSchema.parse('test@example.com')).toBe('test@example.com');
      expect(() => zodSchema.parse('invalid')).toThrow();
    });

    it('should work with number schema', () => {
      const intField = new FieldType<number>({
        name: 'Integer',
        zod: z.number().int(),
        parseValue: (v) => Number(v),
        serialize: (v) => v as number,
        jsonSchema: { type: 'integer' },
      });

      const zodSchema = intField.getZod();
      expect(zodSchema.parse(42)).toBe(42);
      expect(() => zodSchema.parse(3.14)).toThrow();
    });
  });

  describe('getPothos', () => {
    it('should return the GraphQL scalar instance', () => {
      const boolField = new FieldType<boolean>({
        name: 'TestBool',
        zod: z.boolean(),
        parseValue: (v) => Boolean(v),
        serialize: (v) => v as boolean,
        jsonSchema: { type: 'boolean' },
      });

      const pothos = boolField.getPothos();
      expect(pothos).toBe(boolField);
      expect(pothos.name).toBe('TestBool');
    });
  });

  describe('getJson / getJsonSchema', () => {
    it('should return the JSON schema definition', () => {
      const urlField = new FieldType<string>({
        name: 'URL',
        zod: z.string().url(),
        parseValue: (v) => z.string().url().parse(v),
        serialize: (v) => v as string,
        jsonSchema: { type: 'string', format: 'uri' },
      });

      expect(urlField.getJson()).toEqual({ type: 'string', format: 'uri' });
      expect(urlField.getJsonSchema()).toEqual({
        type: 'string',
        format: 'uri',
      });
    });

    it('should evaluate factory function for JSON schema', () => {
      const dynamicField = new FieldType<string>({
        name: 'Dynamic',
        zod: z.string(),
        parseValue: (v) => String(v),
        serialize: (v) => v as string,
        jsonSchema: () => ({ type: 'string', minLength: 1 }),
      });

      expect(dynamicField.getJson()).toEqual({ type: 'string', minLength: 1 });
    });

    it('should deep resolve nested factories in getJsonSchema', () => {
      const nestedField = new FieldType<Record<string, unknown>>({
        name: 'Nested',
        zod: z.object({}),
        parseValue: (v) => v as Record<string, unknown>,
        serialize: (v) => v as Record<string, unknown>,
        jsonSchema: {
          type: 'object',
          properties: () => ({
            name: { type: 'string' },
          }),
        },
      });

      const resolved = nestedField.getJsonSchema() as Record<string, unknown>;
      expect(resolved.type).toBe('object');
      expect(resolved.properties).toEqual({ name: { type: 'string' } });
    });
  });

  describe('GraphQL scalar behavior', () => {
    it('should serialize values correctly', () => {
      const dateField = new FieldType<Date, string>({
        name: 'Date',
        zod: z.date(),
        parseValue: (v) => new Date(String(v)),
        serialize: (v) => (v as Date).toISOString(),
        jsonSchema: { type: 'string', format: 'date-time' },
      });

      const date = new Date('2024-01-01T00:00:00.000Z');
      expect(dateField.serialize(date)).toBe('2024-01-01T00:00:00.000Z');
    });

    it('should parse literal values when parseLiteral is provided', () => {
      const stringField = new FieldType<string>({
        name: 'LiteralString',
        zod: z.string(),
        parseValue: (v) => String(v),
        serialize: (v) => v as string,
        parseLiteral: (ast) => {
          if (ast.kind !== Kind.STRING) throw new TypeError('Expected string');
          return ast.value;
        },
        jsonSchema: { type: 'string' },
      });

      expect(
        stringField.parseLiteral({ kind: Kind.STRING, value: 'hello' }, {})
      ).toBe('hello');
    });
  });
});
