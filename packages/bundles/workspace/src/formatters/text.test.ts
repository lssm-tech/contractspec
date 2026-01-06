import { describe, expect, it } from 'bun:test';
import { formatAsText, formatAsTextLines } from './text';
import type { CICheckResult, CIIssue } from '../services/ci-check/types';

describe('Text Formatter', () => {
  const mockResult: CICheckResult = {
    success: false,
    totalErrors: 1,
    totalWarnings: 1,
    totalNotes: 0,
    durationMs: 100,
    timestamp: '2025-01-01T00:00:00.000Z',
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

  describe('formatAsTextLines', () => {
    it('should generate header and summary', () => {
      const lines = formatAsTextLines(mockResult);

      const header = lines.find((l) =>
        l.text.includes('ContractSpec CI Check Results')
      );
      expect(header).toBeDefined();

      const failure = lines.find((l) => l.text.includes('CI checks failed'));
      expect(failure).toBeDefined();
    });

    it('should include category contents', () => {
      const lines = formatAsTextLines(mockResult);
      const categoryLine = lines.find((l) =>
        l.text.includes('Structure: 1 error(s)')
      );
      expect(categoryLine).toBeDefined();
    });

    it('should format issues', () => {
      const lines = formatAsTextLines(mockResult);

      const errorLine = lines.find((l) => l.text.includes('Error message'));
      expect(errorLine).toBeDefined();
      expect(errorLine?.style).toBe('error');

      const warningLine = lines.find((l) => l.text.includes('Warning message'));
      expect(warningLine).toBeDefined();
      expect(warningLine?.style).toBe('warning');
    });

    it('should support grouping by file', () => {
      const lines = formatAsTextLines(mockResult, { groupByFile: true });

      const fileLine = lines.find((l) => l.text.includes('spec.ts'));
      expect(fileLine).toBeDefined();

      const noFileLine = lines.find((l) => l.text.includes('(no file)'));
      expect(noFileLine).toBeDefined();
    });

    it('should show verbose details', () => {
      const resultWithContext: CICheckResult = {
        ...mockResult,
        issues: [
          {
            ...mockResult.issues[0],
            context: { foo: 'bar' },
          } as unknown as CIIssue,
        ],
      };

      const lines = formatAsTextLines(resultWithContext, { verbose: true });
      const contextLine = lines.find((l) => l.text.includes('{"foo":"bar"}'));
      expect(contextLine).toBeDefined();
    });
  });

  describe('formatAsText', () => {
    it('should return a string', () => {
      const text = formatAsText(mockResult);
      expect(text).toContain('ContractSpec CI Check Results');
      expect(text).toContain('Error message');
    });
  });
});
