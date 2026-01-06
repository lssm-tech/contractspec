import { describe, expect, it } from 'bun:test';
import { formatAsSarif, sarifToJson } from './sarif';
import type { CICheckResult } from '../services/ci-check/types';

describe('SARIF Formatter', () => {
  const mockResult: CICheckResult = {
    success: false,
    totalErrors: 1,
    totalWarnings: 0,
    totalNotes: 0,
    durationMs: 100,
    timestamp: '2025-01-01T00:00:00.000Z',
    categories: [],
    issues: [
      {
        ruleId: 'test-rule',
        severity: 'error',
        message: 'Test message',
        category: 'structure',
        file: 'test.ts',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 10,
      },
      // Issues without files should be filtered out by logic
      {
        ruleId: 'global-error',
        severity: 'error',
        message: 'Global error',
        category: 'structure',
      },
    ],
  };

  it('should generate valid SARIF structure', () => {
    const sarif = formatAsSarif(mockResult);

    expect(sarif.$schema).toBeDefined();
    expect(sarif.version).toBe('2.1.0');
    expect(sarif.runs).toHaveLength(1);
    
    const run = sarif.runs[0];
    expect(run?.tool.driver.name).toBe('ContractSpec');
    expect(run?.results).toHaveLength(1); // Only file-based issues included
  });

  it('should map rules correctly', () => {
    const sarif = formatAsSarif(mockResult);
    const rules = sarif.runs[0]?.tool.driver.rules;
    expect(rules).toBeDefined();
    
    expect(rules![0]?.id).toBe('test-rule');
    expect(rules![0]?.defaultConfiguration?.level).toBe('error');

    // Rule metadata
    const rule = rules![0];
    expect(rule?.name).toBe('test-rule');

    const result = sarif.runs[0]!.results![0];
    expect(result).toBeDefined();
    expect(result?.locations).toBeDefined();
    expect(result!.locations?.[0]?.physicalLocation?.artifactLocation?.uri).toBe('test.ts');
    expect(result!.locations?.[0]?.physicalLocation?.region).toEqual({
      startLine: 1,
      startColumn: 5,
      endLine: 1,
      endColumn: 10,
    });
  });

  it('should support options', () => {
    const sarif = formatAsSarif(mockResult, {
      toolName: 'CustomTool',
      repositoryUri: 'https://github.com/example/repo',
    });

    expect(sarif.runs[0]?.tool.driver.name).toBe('CustomTool');
    expect(sarif.runs[0]?.versionControlProvenance).toBeDefined();
    expect(sarif.runs[0]?.versionControlProvenance?.[0]?.repositoryUri).toBe(
      'https://github.com/example/repo'
    );
  });

  it('should serialize to JSON', () => {
    const sarif = formatAsSarif(mockResult);
    const json = sarifToJson(sarif);
    
    expect(json).toContain('"version": "2.1.0"');
  });
});
