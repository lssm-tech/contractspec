import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import { ZodSchemaType, fromZod } from './ZodSchemaType';

describe('ZodSchemaType', () => {
  describe('constructor', () => {
    it('should wrap a Zod schema', () => {
      const zodSchema = z.object({
        name: z.string(),
        age: z.number(),
      });

      const wrapper = new ZodSchemaType(zodSchema);
      expect(wrapper.getZod()).toBe(zodSchema);
    });

    it('should accept options', () => {
      const wrapper = new ZodSchemaType(z.string(), {
        name: 'CustomString',
        description: 'A custom string type',
      });

      expect(wrapper.getName()).toBe('CustomString');
      expect(wrapper.getDescription()).toBe('A custom string type');
    });
  });

  describe('getZod', () => {
    it('should return the wrapped Zod schema', () => {
      const originalSchema = z.object({
        id: z.string().uuid(),
        email: z.string().email(),
      });

      const wrapper = new ZodSchemaType(originalSchema);
      const returnedSchema = wrapper.getZod();

      expect(returnedSchema).toBe(originalSchema);
    });

    it('should validate data correctly', () => {
      const wrapper = new ZodSchemaType(
        z.object({
          count: z.number().min(0),
        })
      );

      const zodSchema = wrapper.getZod();
      expect(zodSchema.parse({ count: 10 })).toEqual({ count: 10 });
      expect(() => zodSchema.parse({ count: -1 })).toThrow();
    });
  });

  describe('getJsonSchema', () => {
    it('should convert Zod schema to JSON Schema', () => {
      const wrapper = new ZodSchemaType(
        z.object({
          name: z.string(),
          active: z.boolean(),
        })
      );

      const jsonSchema = wrapper.getJsonSchema() as Record<string, unknown>;

      expect(jsonSchema).toBeDefined();
      expect(jsonSchema.type).toBe('object');
    });

    it('should handle primitive types', () => {
      const stringWrapper = new ZodSchemaType(z.string());
      const jsonSchema = stringWrapper.getJsonSchema() as Record<
        string,
        unknown
      >;

      expect(jsonSchema.type).toBe('string');
    });
  });

  describe('getPothos', () => {
    it('should return JSON type for complex schemas', () => {
      const wrapper = new ZodSchemaType(z.object({ data: z.unknown() }), {
        name: 'ComplexType',
      });

      expect(wrapper.getPothos()).toEqual({
        type: 'JSON',
        name: 'ComplexType',
      });
    });

    it('should return JSON type without name', () => {
      const wrapper = new ZodSchemaType(z.object({}));

      expect(wrapper.getPothos()).toEqual({ type: 'JSON', name: undefined });
    });
  });

  describe('getName', () => {
    it('should return configured name', () => {
      const wrapper = new ZodSchemaType(z.string(), { name: 'TestName' });
      expect(wrapper.getName()).toBe('TestName');
    });

    it('should return undefined when no name configured', () => {
      const wrapper = new ZodSchemaType(z.string());
      expect(wrapper.getName()).toBeUndefined();
    });
  });

  describe('getDescription', () => {
    it('should return configured description', () => {
      const wrapper = new ZodSchemaType(z.string(), {
        description: 'A test description',
      });
      expect(wrapper.getDescription()).toBe('A test description');
    });

    it('should return undefined when no description configured', () => {
      const wrapper = new ZodSchemaType(z.string());
      expect(wrapper.getDescription()).toBeUndefined();
    });
  });
});

describe('fromZod helper', () => {
  it('should create ZodSchemaType instance', () => {
    const wrapper = fromZod(z.string());
    expect(wrapper).toBeInstanceOf(ZodSchemaType);
  });

  it('should pass options to constructor', () => {
    const wrapper = fromZod(z.number(), {
      name: 'MyNumber',
      description: 'A number type',
    });

    expect(wrapper.getName()).toBe('MyNumber');
    expect(wrapper.getDescription()).toBe('A number type');
  });

  it('should work for address schema example from docs', () => {
    const AddressSchema = fromZod(
      z.object({
        street: z.string(),
        city: z.string(),
        country: z.string(),
      }),
      { name: 'Address', description: 'Physical address' }
    );

    const zodSchema = AddressSchema.getZod();
    const validAddress = { street: '123 Main', city: 'NYC', country: 'USA' };

    expect(zodSchema.parse(validAddress)).toEqual(validAddress);
  });

  it('should work for user schema example from docs', () => {
    const UserSchema = fromZod(
      z.object({
        id: z.string().uuid(),
        name: z.string().min(1),
        email: z.string().email(),
      }),
      { name: 'User' }
    );

    expect(UserSchema.getName()).toBe('User');
    expect(UserSchema.getPothos()).toEqual({ type: 'JSON', name: 'User' });
  });
});
