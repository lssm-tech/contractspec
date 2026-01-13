import { describe, expect, it } from 'bun:test';
import {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  capitalize,
  escapeString,
} from './utils';

describe('Template Utils', () => {
  describe('toCamelCase', () => {
    it('converts to camelCase', () => {
      expect(toCamelCase('foo-bar')).toBe('fooBar');
      expect(toCamelCase('FooBar')).toBe('fooBar');
      expect(toCamelCase('foo.bar')).toBe('fooBar');
    });
  });

  describe('toPascalCase', () => {
    it('converts to PascalCase', () => {
      expect(toPascalCase('foo-bar')).toBe('FooBar');
      expect(toPascalCase('fooBar')).toBe('FooBar');
      expect(toPascalCase('foo.bar')).toBe('FooBar');
    });
  });

  describe('toKebabCase', () => {
    it('converts to kebab-case', () => {
      expect(toKebabCase('FooBar')).toBe('foo-bar');
      expect(toKebabCase('fooBar')).toBe('foo-bar');
      expect(toKebabCase('foo.bar')).toBe('foo-bar');
    });
  });

  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('foo')).toBe('Foo');
      expect(capitalize('Foo')).toBe('Foo');
    });
  });

  describe('escapeString', () => {
    it('escapes single quotes', () => {
      expect(escapeString("It's me")).toBe("It\\'s me");
    });
  });
});
