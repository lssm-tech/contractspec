import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import { isSchemaType, type SchemaModelType } from './SchemaModelType';

describe('SchemaModelType interface', () => {
  it('should be implementable with getZod method', () => {
    const customType: SchemaModelType<string> = {
      getZod: () => z.string(),
    };

    expect(customType.getZod().parse('hello')).toBe('hello');
  });

  it('should support optional getPothos method', () => {
    const typeWithPothos: SchemaModelType = {
      getZod: () => z.unknown(),
      getPothos: () => ({ type: 'JSON' }),
    };

    expect(typeWithPothos.getPothos?.()).toEqual({ type: 'JSON' });
  });

  it('should support optional getJsonSchema method', () => {
    const typeWithJsonSchema: SchemaModelType = {
      getZod: () => z.string(),
      getJsonSchema: () => ({ type: 'string' }),
    };

    expect(typeWithJsonSchema.getJsonSchema?.()).toEqual({ type: 'string' });
  });
});

describe('isSchemaType', () => {
  it('should return true for objects with getZod method', () => {
    const validType = {
      getZod: () => z.string(),
    };

    expect(isSchemaType(validType)).toBe(true);
  });

  it('should return true for objects with all methods', () => {
    const fullType = {
      getZod: () => z.string(),
      getPothos: () => 'String',
      getJsonSchema: () => ({ type: 'string' }),
    };

    expect(isSchemaType(fullType)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isSchemaType(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isSchemaType(undefined)).toBe(false);
  });

  it('should return false for primitives', () => {
    expect(isSchemaType('string')).toBe(false);
    expect(isSchemaType(123)).toBe(false);
    expect(isSchemaType(true)).toBe(false);
  });

  it('should return false for objects without getZod', () => {
    expect(isSchemaType({})).toBe(false);
    expect(isSchemaType({ getPothos: () => 'String' })).toBe(false);
  });

  it('should return false when getZod is not a function', () => {
    expect(isSchemaType({ getZod: 'not a function' })).toBe(false);
    expect(isSchemaType({ getZod: null })).toBe(false);
  });
});
