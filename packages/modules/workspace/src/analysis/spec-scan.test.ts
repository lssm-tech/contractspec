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

  it('identifies example spec', () => {
    const code =
      'export const example = defineExample({ meta: { key: "ex" } });';
    const result = scanSpecSource(code, 'src/test.example.ts');
    expect(result.specType).toBe('example');
    expect(result.kind).toBe('example');
  });

  it('identifies app-config spec', () => {
    const code =
      'export const app = defineAppConfig({ meta: { key: "app" } });';
    const result = scanSpecSource(code, 'src/test.app-config.ts');
    expect(result.specType).toBe('app-config');
    expect(result.kind).toBe('app-config');
  });

  it('identifies workflow spec', () => {
    const code = 'export const wf = defineWorkflow({ meta: { key: "wf" } });';
    const result = scanSpecSource(code, 'src/test.workflow.ts');
    expect(result.specType).toBe('workflow');
    expect(result.kind).toBe('workflow');
  });

  it('identifies integration spec', () => {
    const code =
      'export const integration = defineIntegration({ meta: { key: "int" } });';
    const result = scanSpecSource(code, 'src/test.integration.ts');
    expect(result.specType).toBe('integration');
    expect(result.kind).toBe('integration');
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

    expect(results[0]?.key).toBe('op-1');
    expect(results[0]?.kind).toBe('command');
    expect(results[1]?.key).toBe('op-2');
    expect(results[1]?.kind).toBe('query');
  });

  it('captured sourceBlock includes closing parenthesis', () => {
    const code = `export const op = defineCommand({
  meta: { key: 'op-1', version: '1' }
});`;
    const results = scanAllSpecsFromSource(code, 'src/test.contracts.ts');
    expect(results).toHaveLength(1);
    // Should include the closing );
    expect(results[0]?.sourceBlock).toBe(code);
  });

  it('resolves spread variables in source block', () => {
    const code = `
const OWNERS = ['alice', 'bob'];
export const op = defineCommand({
  meta: { key: 'op-1', version: '1', owners: [...OWNERS] }
});`;
    const results = scanAllSpecsFromSource(code, 'src/test.contracts.ts');
    expect(results).toHaveLength(1);
    const block = results[0]?.sourceBlock;
    expect(block).toContain("owners: ['alice', 'bob']");
    expect(block).not.toContain('...OWNERS');
    expect(results[0]?.owners).toEqual(['alice', 'bob']);
  });
});
