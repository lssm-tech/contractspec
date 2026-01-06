import { describe, expect, it } from 'bun:test';
import {
  formatAsJson,
  formatAsJsonCompact,
  formatAsJsonFull,
} from './json';
import type { CICheckResult } from '../services/ci-check/types';

describe('JSON Formatter', () => {
  const mockDate = '2025-01-01T00:00:00.000Z';
  const mockResult: CICheckResult = {
    success: false,
    totalErrors: 1,
    totalWarnings: 1,
    totalNotes: 0,
    durationMs: 100,
    timestamp: mockDate,
    commitSha: 'abc1234',
    branch: 'main',
    categories: [
      {
        category: 'structure',
        label: 'Structure',
        passed: false,
        errors: 1,
        warnings: 0,
        notes: 0,
        durationMs: 50,
      },
    ],
    issues: [
      {
        ruleId: 'error-rule',
        severity: 'error',
        message: 'Error message',
        category: 'structure',
        file: 'spec.ts',
        line: 10,
      },
      {
        ruleId: 'warning-rule',
        severity: 'warning',
        message: 'Warning message',
        category: 'structure',
      },
    ],
  };

  describe('formatAsJsonCompact', () => {
    it('should format minimal output', () => {
      const output = formatAsJsonCompact(mockResult);

      expect(output.success).toBe(false);
      expect(output.errors).toBe(1);
      expect(output.warnings).toBe(1);
      expect(output.timestamp).toBe(mockDate);
      expect(output.commit).toBe('abc1234');
      
      expect(output.issues).toHaveLength(2);
      expect(output.issues[0]).toEqual({
        rule: 'error-rule',
        severity: 'error',
        message: 'Error message',
        file: 'spec.ts',
        line: 10,
      });
      // Should omit undefined fields
      expect(output.issues[1]?.file).toBeUndefined();
    });
  });

  describe('formatAsJsonFull', () => {
    it('should format detailed output', () => {
      const output = formatAsJsonFull(mockResult);

      expect(output.success).toBe(false);
      expect(output.summary.totalErrors).toBe(1);
      
      expect(output.categories).toHaveLength(1);
      expect(output.categories[0]?.category).toBe('structure');
      
      expect(output.issues).toHaveLength(2);
      expect(output.issues[0]?.category).toBe('structure');
    });
  });

  describe('formatAsJson', () => {
    it('should return pretty JSON by default', () => {
      const json = formatAsJson(mockResult);
      expect(json).toContain('\n');
      expect(json).toContain('"success": false');
    });

    it('should return compact JSON when pretty is false', () => {
      const json = formatAsJson(mockResult, { pretty: false });
      expect(json).not.toContain('\n');
    });

    it('should support toggle between full and compact details', () => {
      const fullJson = formatAsJson(mockResult, { includeDetails: true });
      const compactJson = formatAsJson(mockResult, { includeDetails: false });

      expect(JSON.parse(fullJson)).toHaveProperty('summary');
      expect(JSON.parse(compactJson)).not.toHaveProperty('summary');
      expect(JSON.parse(compactJson)).toHaveProperty('errors');
    });
  });
});
