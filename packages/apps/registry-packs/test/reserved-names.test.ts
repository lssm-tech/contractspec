/**
 * Tests for pack name validation and squatting prevention.
 */
import { describe, test, expect } from 'bun:test';
import {
  validatePackName,
  isReservedName,
} from '../src/utils/reserved-names.js';

describe('validatePackName', () => {
  describe('valid names', () => {
    test('accepts standard names', () => {
      expect(validatePackName('my-pack').valid).toBe(true);
      expect(validatePackName('typescript-rules').valid).toBe(true);
      expect(validatePackName('ab').valid).toBe(true);
    });

    test('accepts scoped names', () => {
      expect(validatePackName('@myorg/my-pack').valid).toBe(true);
      expect(validatePackName('@company/rules').valid).toBe(true);
    });

    test('accepts names with numbers', () => {
      expect(validatePackName('pack123').valid).toBe(true);
      expect(validatePackName('v2-config').valid).toBe(true);
    });
  });

  describe('invalid: too short', () => {
    test('rejects single character', () => {
      const result = validatePackName('a');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('at least 2');
    });

    test('rejects empty string', () => {
      const result = validatePackName('');
      expect(result.valid).toBe(false);
    });
  });

  describe('invalid: too long', () => {
    test('rejects names over 100 characters', () => {
      const longName = 'a'.repeat(101);
      const result = validatePackName(longName);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('maximum length');
    });
  });

  describe('invalid: format', () => {
    test('rejects uppercase letters', () => {
      const result = validatePackName('MyPack');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('lowercase');
    });

    test('rejects spaces', () => {
      const result = validatePackName('my pack');
      expect(result.valid).toBe(false);
    });

    test('rejects special characters', () => {
      expect(validatePackName('my_pack').valid).toBe(false);
      expect(validatePackName('my.pack').valid).toBe(false);
      expect(validatePackName('my@pack').valid).toBe(false);
    });

    test('rejects separator-only names', () => {
      const result = validatePackName('---');
      expect(result.valid).toBe(false);
    });
  });

  describe('invalid: reserved names', () => {
    test('rejects platform names', () => {
      expect(validatePackName('agentpacks').valid).toBe(false);
      expect(validatePackName('registry').valid).toBe(false);
      expect(validatePackName('cli').valid).toBe(false);
    });

    test('rejects tool names', () => {
      expect(validatePackName('cursor').valid).toBe(false);
      expect(validatePackName('claude').valid).toBe(false);
      expect(validatePackName('copilot').valid).toBe(false);
      expect(validatePackName('openai').valid).toBe(false);
    });

    test('rejects generic confusable names', () => {
      expect(validatePackName('test').valid).toBe(false);
      expect(validatePackName('example').valid).toBe(false);
      expect(validatePackName('default').valid).toBe(false);
    });

    test('reserved names within scoped packs check bare name', () => {
      // @org/test — the bare name "test" is reserved
      expect(validatePackName('@org/test').valid).toBe(false);
    });
  });
});

describe('isReservedName', () => {
  test('returns true for reserved names', () => {
    expect(isReservedName('agentpacks')).toBe(true);
    expect(isReservedName('cursor')).toBe(true);
    expect(isReservedName('test')).toBe(true);
  });

  test('returns false for non-reserved names', () => {
    expect(isReservedName('my-awesome-pack')).toBe(false);
    expect(isReservedName('typescript-rules')).toBe(false);
  });
});
