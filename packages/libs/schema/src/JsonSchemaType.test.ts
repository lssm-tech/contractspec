import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import { JsonSchemaType, fromJsonSchema } from './JsonSchemaType';

describe('JsonSchemaType', () => {
  describe('constructor', () => {
    it('should create with JSON schema definition', () => {
      const jsonSchema = new JsonSchemaType({
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      });

      expect(jsonSchema.getJsonSchema()).toEqual({
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
      });
    });

    it('should accept options with name', () => {
      const jsonSchema = new JsonSchemaType(
        { type: 'object' },
        { name: 'CustomType' }
      );

      expect(jsonSchema.getName()).toBe('CustomType');
    });
  });

  describe('getZod', () => {
    describe('additionalProperties handling', () => {
      it('should handle additionalProperties: true as record', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          additionalProperties: true,
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ any: 'value', num: 123 })).toEqual({
          any: 'value',
          num: 123,
        });
      });

      it('should handle additionalProperties: false as strict object', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          additionalProperties: false,
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({})).toEqual({});
      });

      it('should handle typed additionalProperties', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          additionalProperties: { type: 'string' },
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ key1: 'value1', key2: 'value2' })).toBeDefined();
      });
    });

    describe('explicit properties handling', () => {
      it('should handle object with properties', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            name: { type: 'string' },
            age: { type: 'number' },
          },
          required: ['name'],
        });

        const zodSchema = jsonSchema.getZod();
        
        // Required field must be present
        expect(zodSchema.parse({ name: 'John' })).toEqual({ name: 'John' });
        
        // Optional field can be included
        expect(zodSchema.parse({ name: 'John', age: 30 })).toEqual({
          name: 'John',
          age: 30,
        });
      });
    });

    describe('property type conversion', () => {
      it('should convert string type', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            text: { type: 'string' },
          },
          required: ['text'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ text: 'hello' })).toEqual({ text: 'hello' });
      });

      it('should convert number type', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            value: { type: 'number' },
          },
          required: ['value'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ value: 42 })).toEqual({ value: 42 });
      });

      it('should convert integer type', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            count: { type: 'integer' },
          },
          required: ['count'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ count: 5 })).toEqual({ count: 5 });
      });

      it('should convert boolean type', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            active: { type: 'boolean' },
          },
          required: ['active'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ active: true })).toEqual({ active: true });
      });

      it('should convert array type with items', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            tags: { type: 'array', items: { type: 'string' } },
          },
          required: ['tags'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ tags: ['a', 'b'] })).toEqual({ tags: ['a', 'b'] });
      });

      it('should convert nested object type', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            address: {
              type: 'object',
              properties: {
                city: { type: 'string' },
              },
            },
          },
          required: ['address'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ address: { city: 'NYC' } })).toEqual({
          address: { city: 'NYC' },
        });
      });

      it('should convert null type', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            empty: { type: 'null' },
          },
          required: ['empty'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ empty: null })).toEqual({ empty: null });
      });

      it('should handle unknown type as z.unknown', () => {
        const jsonSchema = new JsonSchemaType({
          type: 'object',
          properties: {
            data: { type: 'custom' },
          },
          required: ['data'],
        });

        const zodSchema = jsonSchema.getZod();
        expect(zodSchema.parse({ data: 'anything' })).toEqual({ data: 'anything' });
      });
    });

    it('should return passthrough object for empty schema', () => {
      const jsonSchema = new JsonSchemaType({});
      const zodSchema = jsonSchema.getZod();
      
      expect(zodSchema.parse({ any: 'value' })).toEqual({ any: 'value' });
    });
  });

  describe('getJsonSchema', () => {
    it('should return the original JSON schema', () => {
      const originalSchema = {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
      };
      
      const jsonSchemaType = new JsonSchemaType(originalSchema);
      expect(jsonSchemaType.getJsonSchema()).toEqual(originalSchema);
    });
  });

  describe('getPothos', () => {
    it('should return JSON type with name', () => {
      const jsonSchema = new JsonSchemaType(
        { type: 'object' },
        { name: 'CustomData' }
      );

      expect(jsonSchema.getPothos()).toEqual({ type: 'JSON', name: 'CustomData' });
    });

    it('should return JSON type without name', () => {
      const jsonSchema = new JsonSchemaType({ type: 'object' });

      expect(jsonSchema.getPothos()).toEqual({ type: 'JSON', name: undefined });
    });
  });

  describe('getName', () => {
    it('should return configured name', () => {
      const jsonSchema = new JsonSchemaType({}, { name: 'TestType' });
      expect(jsonSchema.getName()).toBe('TestType');
    });

    it('should return undefined when no name configured', () => {
      const jsonSchema = new JsonSchemaType({});
      expect(jsonSchema.getName()).toBeUndefined();
    });
  });
});

describe('fromJsonSchema helper', () => {
  it('should create JsonSchemaType instance', () => {
    const schema = fromJsonSchema({
      type: 'object',
      properties: { name: { type: 'string' } },
    });

    expect(schema).toBeInstanceOf(JsonSchemaType);
  });

  it('should pass options to constructor', () => {
    const schema = fromJsonSchema(
      { type: 'object' },
      { name: 'HelperCreated' }
    );

    expect(schema.getName()).toBe('HelperCreated');
  });

  it('should work for metadata schema example from docs', () => {
    const MetadataSchema = fromJsonSchema({
      type: 'object',
      properties: {
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
      required: ['createdAt'],
    });

    const zodSchema = MetadataSchema.getZod();
    expect(zodSchema.parse({ createdAt: '2024-01-01T00:00:00Z' })).toEqual({
      createdAt: '2024-01-01T00:00:00Z',
    });
  });
});
