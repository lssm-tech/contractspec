import { describe, expect, it } from 'bun:test';
import { ModelRegistry } from './model-registry';
import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import * as z from 'zod';
import { ZodSchemaType } from '@lssm/lib.schema';

describe('ModelRegistry', () => {
  describe('constructor', () => {
    it('should create empty registry', () => {
      const registry = new ModelRegistry();
      expect(registry.list()).toEqual([]);
    });

    it('should initialize with models', () => {
      const UserModel = new SchemaModel({
        name: 'User',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
        },
      });

      const registry = new ModelRegistry([UserModel]);
      expect(registry.list()).toHaveLength(1);
      expect(registry.list()[0]).toBe(UserModel);
    });
  });

  describe('register', () => {
    it('should register a model', () => {
      const registry = new ModelRegistry();
      const Model = new SchemaModel({
        name: 'TestModel',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
        },
      });

      registry.register(Model);
      expect(registry.list()).toContain(Model);
    });

    it('should return this for chaining', () => {
      const registry = new ModelRegistry();
      const Model1 = new SchemaModel({
        name: 'Model1',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
        },
      });
      const Model2 = new SchemaModel({
        name: 'Model2',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
        },
      });

      registry.register(Model1).register(Model2);
      expect(registry.list()).toHaveLength(2);
    });

    it('should throw on duplicate model name', () => {
      const registry = new ModelRegistry();
      const Model1 = new SchemaModel({
        name: 'DuplicateModel',
        fields: {
          id: { type: ScalarTypeEnum.ID(), isOptional: false },
        },
      });
      const Model2 = new SchemaModel({
        name: 'DuplicateModel',
        fields: {
          name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
        },
      });

      registry.register(Model1);
      expect(() => registry.register(Model2)).toThrow(/Duplicate contract/);
    });
  });

  describe('list', () => {
    it('should return all registered models', () => {
      const registry = new ModelRegistry();
      const models = [
        new SchemaModel({
          name: 'UserModel',
          fields: { id: { type: ScalarTypeEnum.ID(), isOptional: false } },
        }),
        new SchemaModel({
          name: 'PostModel',
          fields: { id: { type: ScalarTypeEnum.ID(), isOptional: false } },
        }),
      ];

      models.forEach((m) => registry.register(m));
      expect(registry.list()).toHaveLength(2);
    });

    it('should return a copy of the values', () => {
      const registry = new ModelRegistry();
      const Model = new SchemaModel({
        name: 'Test',
        fields: { id: { type: ScalarTypeEnum.ID(), isOptional: false } },
      });

      registry.register(Model);
      const list1 = registry.list();
      const list2 = registry.list();

      expect(list1).not.toBe(list2);
      expect(list1).toEqual(list2);
    });
  });

  describe('get', () => {
    it('should get model by name', () => {
      const registry = new ModelRegistry();
      const Model = new SchemaModel({
        name: 'TargetModel',
        fields: { id: { type: ScalarTypeEnum.ID(), isOptional: false } },
      });

      registry.register(Model);
      expect(registry.get('TargetModel')).toBe(Model);
    });

    it('should return undefined for non-existent name', () => {
      const registry = new ModelRegistry();
      expect(registry.get('NonExistent')).toBeUndefined();
    });
  });

  describe('with non-SchemaModel types', () => {
    it('should handle ZodSchemaType with generated name', () => {
      const registry = new ModelRegistry();
      const zodType = new ZodSchemaType(z.object({ data: z.string() }));

      registry.register(zodType);
      expect(registry.list()).toHaveLength(1);
    });
  });
});
