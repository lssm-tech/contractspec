import { describe, expect, it } from 'bun:test';
import { formatAsJson } from './json';
import type { CICheckResult } from '../services/ci-check/types';

describe('JSON Formatter', () => {
  const mockResult: CICheckResult = {
    success: false,
    totalErrors: 1,
    totalWarnings: 1,
    totalNotes: 0,
    durationMs: 100,
    timestamp: '2025-01-01T00:00:00.000Z',
    commitSha: 'abc1234',
    branch: 'main',
    categories: [
      {
        category: 'structure',
        label: 'Structure',
        passed: true,
        errors: 0,
        warnings: 0,
        notes: 0,
        durationMs: 50,
      },
      {
        category: 'integrity',
        label: 'Integrity',
        passed: false,
        errors: 1,
        warnings: 1,
        notes: 0,
        durationMs: 50,
      },
    ],
    issues: [
      {
        ruleId: 'struct-001',
        severity: 'error',
        message: 'Structure error',
        category: 'structure',
        file: 'spec.ts',
        line: 10,
        context: { detail: 'info' },
      },
      {
        ruleId: 'integ-001',
        severity: 'warning',
        message: 'Integrity warning',
        category: 'integrity',
        file: 'spec.ts',
        line: 20,
      },
    ],
  };

  it('should format as valid JSON with v1.0 schema', () => {
    const json = formatAsJson(mockResult);
    const parsed = JSON.parse(json);

    expect(parsed).toEqual({
      schemaVersion: '1.0',
      checks: [
        {
          name: 'struct-001',
          status: 'fail',
          category: 'structure',
          message: 'Structure error',
          file: 'spec.ts',
          line: 10,
          details: { detail: 'info' },
        },
        {
          name: 'integ-001',
          status: 'warn',
          category: 'integrity',
          message: 'Integrity warning',
          file: 'spec.ts',
          line: 20,
        },
      ],
      drift: {
        status: 'none',
        files: [],
      },
      summary: {
        pass: 0,
        fail: 1,
        warn: 1,
        total: 2,
        durationMs: 100,
        timestamp: '2025-01-01T00:00:00.000Z',
      },
      details: {
        commit: 'abc1234',
        branch: 'main',
      },
    });
  });

  it('should support compact output (no pretty print)', () => {
    const json = formatAsJson(mockResult, { pretty: false });
    expect(json).not.toContain('\n');
    const parsed = JSON.parse(json);
    expect(parsed.schemaVersion).toBe('1.0');
  });
});
