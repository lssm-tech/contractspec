import { describe, expect, it } from 'bun:test';
import {
  inferSpecTypeFromFilePath,
  scanSpecSource,
  scanAllSpecsFromSource,
} from './spec-scan';

describe('inferSpecTypeFromFilePath', () => {
  it('identifies operation specs', () => {
    expect(inferSpecTypeFromFilePath('src/domain/my-op.contracts.ts')).toBe(
      'operation'
    );
    expect(inferSpecTypeFromFilePath('src/domain/operations/my-op.ts')).toBe(
      'operation'
    );
  });

  it('identifies event specs', () => {
    expect(inferSpecTypeFromFilePath('src/domain/my-event.event.ts')).toBe(
      'event'
    );
    expect(inferSpecTypeFromFilePath('src/domain/events/my-event.ts')).toBe(
      'event'
    );
  });

  it('identifies presentation specs', () => {
    expect(
      inferSpecTypeFromFilePath('src/domain/my-pres.presentation.ts')
    ).toBe('presentation');
    expect(
      inferSpecTypeFromFilePath('src/domain/presentations/my-pres.ts')
    ).toBe('presentation');
  });

  it('identifies feature specs', () => {
    expect(inferSpecTypeFromFilePath('src/domain/my-feature.feature.ts')).toBe(
      'feature'
    );
  });
});

describe('scanSpecSource', () => {
  it('extracts metadata from operation spec', () => {
    const code = `
      export const op = defineCommand({
        meta: { key: 'my-op', version: '1.0.0' },
        description: 'Does something',
        owners: ['team-a'],
        stability: 'stable',
      });
    `;
    const result = scanSpecSource(code, 'src/test.contracts.ts');
    expect(result.specType).toBe('operation');
    expect(result.kind).toBe('command');
    expect(result.key).toBe('my-op');
    expect(result.version).toBe('1.0.0');
    expect(result.description).toBe('Does something');
    expect(result.owners).toEqual(['team-a']);
    expect(result.stability).toBe('stable');
  });

  it('extracts emitted events', () => {
    const code = `
      export const op = defineCommand({
        // ...
        sideEffects: {
          emits: [
            { key: 'event.a', version: '1' },
            { key: 'event.b', version: '2.0' }
          ]
        }
      });
    `;
    const result = scanSpecSource(code, 'src/test.contracts.ts');
    expect(result.emittedEvents).toHaveLength(2);
    expect(result.emittedEvents?.[0]).toEqual({ key: 'event.a', version: '1' });
    expect(result.emittedEvents?.[1]).toEqual({
      key: 'event.b',
      version: '2.0',
    });
  });
  it('extracts test coverage info', () => {
    const code = `
      defineTestSpec({
        meta: { key: 'my-test', version: '1.0.0' },
        scenarios: [
          {
            when: { ... },
            then: [
              { type: 'expectOutput', match: {} }
            ]
          },
          {
            when: { ... },
            then: [
              { type: 'expectError' }
            ]
          }
        ]
      });
    `;
    const result = scanSpecSource(code, 'src/my.test-spec.ts');
    expect(result.testCoverage).toEqual({
      hasSuccess: true,
      hasError: true,
    });
  });

  it('detects missing test coverage scenarios', () => {
    const code = `
      defineTestSpec({
        meta: { key: 'my-test', version: '1.0.0' },
        scenarios: [
          {
            when: { ... },
            then: [
              { type: 'expectOutput', match: {} }
            ]
          }
        ]
      });
    `;
    const result = scanSpecSource(code, 'src/my.test-spec.ts');
    expect(result.testCoverage).toEqual({
      hasSuccess: true,
      hasError: false,
    });
  });
});

describe('scanAllSpecsFromSource', () => {
  it('extracts multiple specs from a single file', () => {
    const code = `
      export const op1 = defineCommand({
        meta: { key: 'op-1', version: '1' }
      });

      export const op2 = defineQuery({
        meta: { key: 'op-2', version: '1' }
      });
    `;
    const results = scanAllSpecsFromSource(code, 'src/multi.contracts.ts');
    expect(results).toHaveLength(2);

    // Sort by key to be deterministic
    results.sort((a, b) => (a.key || '').localeCompare(b.key || ''));

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(results[0]!.key).toBe('op-1');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(results[0]!.kind).toBe('command');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(results[1]!.key).toBe('op-2');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expect(results[1]!.kind).toBe('query');
  });
});
