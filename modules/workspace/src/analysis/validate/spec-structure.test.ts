import { describe, expect, it } from 'bun:test';
import { validateSpecStructure } from './spec-structure';

describe('validateSpecStructure', () => {
  it('should validate operation with numeric version', () => {
    const code = `
            import { defineCommand } from '@contractspec/lib.contracts';
            export const MyCommand = defineCommand({
                meta: {
                    key: 'my.command',
                    version: 1,
                    description: 'desc'
                },
                io: {},
                policy: {}
            });
        `;
    const result = validateSpecStructure(code, 'my.operation.ts');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate operation with string version', () => {
    const code = `
            import { defineCommand } from '@contractspec/lib.contracts';
            export const MyCommand = defineCommand({
                meta: {
                    key: 'my.command',
                    version: '1.0.0',
                    description: 'desc'
                },
                io: {},
                policy: {}
            });
        `;
    const result = validateSpecStructure(code, 'my.operation.ts');
    // This is expected to fail before the fix
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate event with string version', () => {
    const code = `
            import { defineEvent } from '@contractspec/lib.contracts';
            export const MyEvent = defineEvent({
                meta: {
                    key: 'my.event.created',
                    version: '1.0.0'
                },
                payload: {}
            });
        `;
    const result = validateSpecStructure(code, 'my.event.ts');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should validate migration with string version', () => {
    const code = `
            import { defineMigration } from '@contractspec/lib.contracts';
            export const MyMigration: MigrationSpec = {
                name: 'my-migration',
                version: '1.0.0',
                plan: { up: [] }
            };
        `;
    const result = validateSpecStructure(code, 'my.migration.ts');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});
