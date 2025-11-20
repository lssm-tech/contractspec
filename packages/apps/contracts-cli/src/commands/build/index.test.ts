import { describe, it, expect } from 'vitest';
import { __buildInternals } from './index';

describe('build command internals', () => {
  const { detectSpecType, stripCode, ensureTrailingNewline } = __buildInternals;

  describe('detectSpecType', () => {
    it('detects operation specs by filename', () => {
      expect(detectSpecType('user.contracts.ts', 'defineCommand({})')).toBe('operation');
    });

    it('detects presentation specs by content', () => {
      expect(detectSpecType('some-file.ts', 'export interface PresentationSpec {}')).toBe(
        'presentation'
      );
    });

    it('falls back to unknown for unrecognized specs', () => {
      expect(detectSpecType('random.ts', 'const x = 1;')).toBe('unknown');
    });
  });

  describe('stripCode', () => {
    it('removes markdown code fences', () => {
      const source = '```ts\nconsole.log("hello");\n```';
      expect(stripCode(source)).toBe('console.log("hello");');
    });

    it('returns trimmed text when no fences present', () => {
      const source = '  console.log("hi");  ';
      expect(stripCode(source)).toBe('console.log("hi");');
    });
  });

  describe('ensureTrailingNewline', () => {
    it('adds newline when missing', () => {
      expect(ensureTrailingNewline('const a = 1;')).toBe('const a = 1;\n');
    });

    it('keeps newline when already present', () => {
      expect(ensureTrailingNewline('const a = 1;\n')).toBe('const a = 1;\n');
    });
  });
});






