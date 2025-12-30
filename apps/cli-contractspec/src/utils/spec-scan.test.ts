import { describe, it, expect } from 'bun:test';
import { inferSpecTypeFromFilePath, scanSpecSource } from './spec-scan';

describe('spec-scan', () => {
  describe('inferSpecTypeFromFilePath', () => {
    it('detects operation specs from .contracts suffix', () => {
      expect(inferSpecTypeFromFilePath('src/foo.contracts.ts')).toBe(
        'operation'
      );
    });

    it('detects telemetry specs from .telemetry suffix', () => {
      expect(inferSpecTypeFromFilePath('src/foo.telemetry.ts')).toBe(
        'telemetry'
      );
    });
  });

  describe('scanSpecSource', () => {
    it('extracts common meta fields', () => {
      const code = `
export const MySpec = defineCommand({
  meta: {
    key: 'billing.createInvoice',
    version: 2,
    kind: 'command',
    stability: 'beta',
    owners: ['@team-platform'],
    tags: ['billing', 'invoicing'],
    description: 'Create an invoice',
  },
  io: {},
  policy: {},
});
`;

      const result = scanSpecSource(code, 'billing.contracts.ts');
      expect(result.specType).toBe('operation');
      expect(result.name).toBe('billing.createInvoice');
      expect(result.version).toBe(2);
      expect(result.kind).toBe('command');
      expect(result.stability).toBe('beta');
      expect(result.owners).toEqual(['@team-platform']);
      expect(result.tags).toEqual(['billing', 'invoicing']);
      expect(result.description).toBe('Create an invoice');
      expect(result.hasMeta).toBe(true);
      expect(result.hasIo).toBe(true);
      expect(result.hasPolicy).toBe(true);
    });
  });
});
