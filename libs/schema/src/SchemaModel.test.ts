import { describe, expect, it } from 'bun:test';
import * as z from 'zod';
import { SchemaModel, defineSchemaModel, isSchemaModel } from './SchemaModel';
import { ScalarTypeEnum } from './ScalarTypeEnum';
import { EnumType } from './EnumType';

describe('SchemaModel', () => {
  describe('constructor', () => {
    it('should create a schema model with fields', () => {
      const UserModel = new SchemaModel({
        name: 'User',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
          name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        },
      });

      expect(UserModel.config.name).toBe('User');
      expect(Object.keys(UserModel.config.fields)).toEqual(['id', 'name']);
    });

    it('should support description', () => {
      const Model = new SchemaModel({
        name: 'WithDescription',
        description: 'A model with description',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
        },
      });

      expect(Model.config.description).toBe('A model with description');
    });
  });

  describe('getZod', () => {
    it('should generate a valid zod object schema', () => {
      const UserModel = new SchemaModel({
        name: 'User',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
          email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
        },
      });

      const zodSchema = UserModel.getZod();
      const validUser = { id: 'abc123', email: 'test@example.com' };

      expect(zodSchema.parse(validUser)).toEqual(validUser);
    });

    it('should handle optional fields', () => {
      const Model = new SchemaModel({
        name: 'OptionalFields',
        fields: {
          required: {
            type: ScalarTypeEnum.String_unsecure(),
            isOptional: false,
          },
          optional: {
            type: ScalarTypeEnum.String_unsecure(),
            isOptional: true,
          },
        },
      });

      const zodSchema = Model.getZod();

      // Should pass without optional field
      expect(zodSchema.parse({ required: 'value' })).toEqual({
        required: 'value',
      });

      // Should pass with optional field
      expect(zodSchema.parse({ required: 'value', optional: 'extra' })).toEqual(
        {
          required: 'value',
          optional: 'extra',
        }
      );
    });

    it('should handle array fields', () => {
      const Model = new SchemaModel({
        name: 'ArrayFields',
        fields: {
          tags: {
            type: ScalarTypeEnum.String_unsecure(),
            isOptional: false,
            isArray: true,
          },
        },
      });

      const zodSchema = Model.getZod();
      expect(zodSchema.parse({ tags: ['a', 'b', 'c'] })).toEqual({
        tags: ['a', 'b', 'c'],
      });
    });

    it('should handle enum fields', () => {
      const StatusEnum = new EnumType('Status', ['ACTIVE', 'INACTIVE']);
      const Model = new SchemaModel({
        name: 'WithEnum',
        fields: {
          status: { type: StatusEnum, isOptional: false },
        },
      });

      const zodSchema = Model.getZod();
      expect(zodSchema.parse({ status: 'ACTIVE' })).toEqual({
        status: 'ACTIVE',
      });
      expect(() => zodSchema.parse({ status: 'INVALID' })).toThrow();
    });

    it('should handle nested SchemaModel fields', () => {
      const AddressModel = new SchemaModel({
        name: 'Address',
        fields: {
          street: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
          city: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        },
      });

      const PersonModel = new SchemaModel({
        name: 'Person',
        fields: {
          name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
          address: { type: AddressModel, isOptional: false },
        },
      });

      const zodSchema = PersonModel.getZod();
      const validPerson = {
        name: 'John',
        address: { street: '123 Main St', city: 'NYC' },
      };

      expect(zodSchema.parse(validPerson)).toEqual(validPerson);
    });
  });

  describe('getPothosInput', () => {
    it('should return the model name', () => {
      const Model = new SchemaModel({
        name: 'TestInput',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
        },
      });

      expect(Model.getPothosInput()).toBe('TestInput');
    });
  });
});

describe('isSchemaModel', () => {
  it('should return true for SchemaModel instances', () => {
    const model = new SchemaModel({
      name: 'Test',
      fields: {
        id: { type: ScalarTypeEnum.ID(), isOptional: false },
      },
    });

    expect(isSchemaModel(model)).toBe(true);
  });

  it('should return false for null/undefined', () => {
    expect(isSchemaModel(null)).toBe(false);
    expect(isSchemaModel(undefined)).toBe(false);
  });

  it('should return false for non-SchemaModel objects', () => {
    // Test with objects that look like SchemaModel but aren't
    const fakeModel = { getZod: () => z.object({}) };
    expect(isSchemaModel({} as unknown as null)).toBe(false);
    expect(isSchemaModel(fakeModel as unknown as null)).toBe(false);
  });
});

describe('defineSchemaModel helper', () => {
  it('should create a SchemaModel instance', () => {
    const Model = defineSchemaModel({
      name: 'HelperModel',
      fields: {
        id: { type: ScalarTypeEnum.ID(), isOptional: false },
      },
    });

    expect(Model).toBeInstanceOf(SchemaModel);
    expect(Model.config.name).toBe('HelperModel');
  });

  it('should be equivalent to direct constructor call', () => {
    const config = {
      name: 'Test',
      fields: {
        id: { type: ScalarTypeEnum.ID(), isOptional: false },
      },
    };

    const helperModel = defineSchemaModel(config);
    const directModel = new SchemaModel(config);

    expect(helperModel.config.name).toBe(directModel.config.name);
    expect(Object.keys(helperModel.config.fields)).toEqual(
      Object.keys(directModel.config.fields)
    );
  });
});
