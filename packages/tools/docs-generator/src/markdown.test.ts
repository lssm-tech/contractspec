import { describe, expect, test } from 'bun:test';
import { extractSummary, extractTitle } from './markdown';

describe('docs-generator markdown', () => {
  test('extractTitle falls back when missing', () => {
    expect(extractTitle('No heading', 'fallback')).toBe('fallback');
  });

  test('extractTitle reads first heading', () => {
    const content = '# Hello World\n\nBody';
    expect(extractTitle(content, 'fallback')).toBe('Hello World');
  });

  test('extractSummary skips comment and heading', () => {
    const content = [
      '<!-- @generated -->',
      '',
      '# Title',
      '',
      'First line summary.',
      'Second line summary.',
    ].join('\n');

    expect(extractSummary(content)).toBe(
      'First line summary. Second line summary.'
    );
  });
});
