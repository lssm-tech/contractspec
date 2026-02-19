import { describe, expect, test } from 'bun:test';
import {
  parseIgnoreContent,
  mergeIgnorePatterns,
} from '../../src/features/ignore.js';
import type { ParsedIgnore } from '../../src/features/ignore.js';

describe('parseIgnoreContent', () => {
  test('parses ignore patterns', () => {
    const content = `
# Comment
node_modules/
dist/

# Another comment
tmp/
*.log
`;
    const patterns = parseIgnoreContent(content);
    expect(patterns).toEqual(['node_modules/', 'dist/', 'tmp/', '*.log']);
  });

  test('handles empty content', () => {
    expect(parseIgnoreContent('')).toEqual([]);
    expect(parseIgnoreContent('\n\n')).toEqual([]);
  });

  test('strips comments and blanks', () => {
    const content = '# Only comments\n# More comments';
    expect(parseIgnoreContent(content)).toEqual([]);
  });
});

describe('mergeIgnorePatterns', () => {
  test('merges and deduplicates', () => {
    const configs: ParsedIgnore[] = [
      { packName: 'a', sourcePath: '/a', patterns: ['node_modules/', 'dist/'] },
      { packName: 'b', sourcePath: '/b', patterns: ['dist/', 'tmp/'] },
    ];
    expect(mergeIgnorePatterns(configs)).toEqual([
      'node_modules/',
      'dist/',
      'tmp/',
    ]);
  });

  test('handles empty configs', () => {
    expect(mergeIgnorePatterns([])).toEqual([]);
  });
});
