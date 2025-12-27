import { describe, expect, it } from 'bun:test';
import { EnumType, defineEnum } from './EnumType';

describe('EnumType', () => {
  describe('constructor and basic methods', () => {
    it('should create an enum with specified name and values', () => {
      const statusEnum = new EnumType('Status', ['ACTIVE', 'INACTIVE', 'PENDING']);
      
      expect(statusEnum.getName()).toBe('Status');
      expect(statusEnum.getEnumValues()).toEqual(['ACTIVE', 'INACTIVE', 'PENDING']);
    });

    it('should create enum with minimum one value', () => {
      const singleEnum = new EnumType('Single', ['ONLY']);
      
      expect(singleEnum.getEnumValues()).toHaveLength(1);
      expect(singleEnum.getEnumValues()[0]).toBe('ONLY');
    });
  });

  describe('getZod', () => {
    it('should return a valid zod enum schema', () => {
      const roleEnum = new EnumType('Role', ['ADMIN', 'USER', 'GUEST']);
      const zodSchema = roleEnum.getZod();
      
      // Valid values should pass
      expect(zodSchema.parse('ADMIN')).toBe('ADMIN');
      expect(zodSchema.parse('USER')).toBe('USER');
      expect(zodSchema.parse('GUEST')).toBe('GUEST');
    });

    it('should reject invalid enum values', () => {
      const roleEnum = new EnumType('Role', ['ADMIN', 'USER']);
      const zodSchema = roleEnum.getZod();
      
      expect(() => zodSchema.parse('INVALID')).toThrow();
      expect(() => zodSchema.parse('')).toThrow();
      expect(() => zodSchema.parse(123)).toThrow();
    });
  });

  describe('getPothos', () => {
    it('should return a GraphQL enum type', () => {
      const priorityEnum = new EnumType('Priority', ['LOW', 'MEDIUM', 'HIGH']);
      const gqlEnum = priorityEnum.getPothos();
      
      expect(gqlEnum.name).toBe('Priority');
      expect(gqlEnum.getValues()).toHaveLength(3);
    });

    it('should have correct enum values in GraphQL type', () => {
      const statusEnum = new EnumType('Status', ['ACTIVE', 'INACTIVE']);
      const gqlEnum = statusEnum.getPothos();
      const values = gqlEnum.getValues();
      
      const valueNames = values.map(v => v.name);
      expect(valueNames).toContain('ACTIVE');
      expect(valueNames).toContain('INACTIVE');
    });
  });

  describe('getJson / getJsonSchema', () => {
    it('should return JSON Schema representation', () => {
      const typeEnum = new EnumType('Type', ['A', 'B', 'C']);
      const jsonSchema = typeEnum.getJsonSchema();
      
      expect(jsonSchema).toEqual({
        type: 'string',
        enum: ['A', 'B', 'C'],
      });
    });

    it('should return same result from getJson and getJsonSchema', () => {
      const modeEnum = new EnumType('Mode', ['READ', 'WRITE']);
      
      expect(modeEnum.getJson()).toEqual(modeEnum.getJsonSchema());
    });
  });
});

describe('defineEnum helper', () => {
  it('should create an EnumType instance', () => {
    const colorEnum = defineEnum('Color', ['RED', 'GREEN', 'BLUE']);
    
    expect(colorEnum).toBeInstanceOf(EnumType);
    expect(colorEnum.getName()).toBe('Color');
    expect(colorEnum.getEnumValues()).toEqual(['RED', 'GREEN', 'BLUE']);
  });

  it('should be equivalent to direct constructor call', () => {
    const helperEnum = defineEnum('Test', ['A', 'B']);
    const directEnum = new EnumType('Test', ['A', 'B']);
    
    expect(helperEnum.getName()).toBe(directEnum.getName());
    expect(helperEnum.getEnumValues()).toEqual(directEnum.getEnumValues());
  });
});
