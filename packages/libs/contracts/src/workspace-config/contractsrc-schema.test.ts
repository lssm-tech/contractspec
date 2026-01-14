import { describe, expect, it } from 'bun:test';
import { ContractsrcSchema, TestingConfigSchema } from './contractsrc-schema';

describe('TestingConfigSchema', () => {
  it('should parse valid testing config', () => {
    const valid = {
      runner: 'vitest',
      testMatch: ['**/tests/*.ts'],
      autoGenerate: true,
      integrity: {
        requireTestsFor: ['operation', 'presentation'],
        minCoverage: 80,
      },
    };
    const result = TestingConfigSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.runner).toBe('vitest');
      expect(result.data.autoGenerate).toBe(true);
      expect(result.data.integrity?.requireTestsFor).toEqual([
        'operation',
        'presentation',
      ]);
    }
  });

  it('should accept defaults', () => {
    const result = TestingConfigSchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.runner).toBe('internal');
      expect(result.data.testMatch).toEqual(['**/*.{test,spec}.{ts,js}']);
      expect(result.data.autoGenerate).toBe(false);
    }
  });

  it('should reject invalid runner', () => {
    const invalid = {
      runner: 'invalid-runner',
    };
    const result = TestingConfigSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});

describe('ContractsrcSchema with testing', () => {
  it('should allow testing section in full config', () => {
    const config = {
      testing: {
        runner: 'bun',
        autoGenerate: true,
      },
      conventions: {
        models: 'models',
        operations: 'operations',
        events: 'events',
        presentations: 'presentations',
        forms: 'forms',
        groupByFeature: true,
      },
    };
    const result = ContractsrcSchema.safeParse(config);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.testing?.runner).toBe('bun');
    }
  });
});
