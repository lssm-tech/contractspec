import { describe, expect, it } from 'bun:test';
import { parseExplicitImplementations } from './parsers';

describe('parseExplicitImplementations', () => {
  it('should parse explicit implementations from defineCommand', () => {
    const code = `
            import { defineCommand } from '@contractspec/lib.contracts-spec';
            export const Command = defineCommand({
                meta: { key: 'cmd' },
                implementations: [
                    { path: 'src/handler.ts', type: 'handler', description: 'Main handler' }
                ]
            });
        `;
    const result = parseExplicitImplementations(code);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      path: 'src/handler.ts',
      type: 'handler',
      description: 'Main handler',
    });
  });

  it('should parse explicit implementations from object literal', () => {
    const code = `
            export const Spec = {
                implementations: [
                    { path: 'src/component.tsx', type: 'component' }
                ]
            };
        `;
    const result = parseExplicitImplementations(code);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      path: 'src/component.tsx',
      type: 'component',
      description: undefined,
    });
  });

  it('should handle multiple implementations', () => {
    const code = `
            export default defineCommand({
                implementations: [
                    { path: 'h1.ts', type: 'handler' },
                    { path: 't1.test.ts', type: 'test' }
                ]
            });
        `;
    const result = parseExplicitImplementations(code);
    expect(result).toHaveLength(2);
    expect(result[0]?.type).toBe('handler');
    expect(result[1]?.type).toBe('test');
  });

  it('should return empty array if no implementations', () => {
    const code = `export const c = defineCommand({});`;
    const result = parseExplicitImplementations(code);
    expect(result).toHaveLength(0);
  });
});
