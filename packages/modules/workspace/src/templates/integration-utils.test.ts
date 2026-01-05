import { describe, expect, it } from 'bun:test';
import {
  renderConfigSchema,
  renderConstraints,
  stabilityToEnum,
} from './integration-utils';

describe('Integration Utils', () => {
  describe('renderConfigSchema', () => {
    it('renders empty schema', () => {
      const code = renderConfigSchema([]);
      expect(code).toContain("type: 'object'");
      expect(code).not.toContain('required:');
    });

    it('renders fields and required array', () => {
      const code = renderConfigSchema([
        { key: 'f1', type: 'string', required: true },
        { key: 'f2', type: 'number', required: false },
      ]);
      expect(code).toContain("required: ['f1']");
      expect(code).toContain("f1: { type: 'string' }");
      expect(code).toContain("f2: { type: 'number' }");
    });
  });

  describe('renderConstraints', () => {
    it('renders nothing if no limits', () => {
      expect(renderConstraints()).toBe('');
    });

    it('renders rate limits', () => {
      const code = renderConstraints(100, 1000);
      expect(code).toContain('rpm: 100');
      expect(code).toContain('rph: 1000');
    });
  });

  describe('stabilityToEnum', () => {
    it('converts stability strings to enums', () => {
      expect(stabilityToEnum('stable')).toBe('Stable');
      expect(stabilityToEnum('beta')).toBe('Beta');
      expect(stabilityToEnum('experimental')).toBe('Experimental');
    });
  });
});
