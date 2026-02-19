import { describe, expect, test } from 'bun:test';
import {
  parseFrontmatter,
  serializeFrontmatter,
} from '../../src/utils/frontmatter.js';

describe('parseFrontmatter', () => {
  test('parses YAML frontmatter', () => {
    const input = `---
root: true
targets: ["*"]
description: "Test"
---

# Hello World

Body content here.`;

    const result = parseFrontmatter(input);
    expect(result.data.root).toBe(true);
    expect(result.data.targets).toEqual(['*']);
    expect(result.data.description).toBe('Test');
    expect(result.content).toContain('# Hello World');
    expect(result.content).toContain('Body content here.');
  });

  test('handles missing frontmatter', () => {
    const input = '# Just content\n\nNo frontmatter.';
    const result = parseFrontmatter(input);
    expect(result.data).toEqual({});
    expect(result.content).toContain('# Just content');
  });

  test('handles empty frontmatter', () => {
    const input = '---\n---\n\nContent.';
    const result = parseFrontmatter(input);
    expect(result.data).toEqual({});
    expect(result.content).toBe('Content.');
  });
});

describe('serializeFrontmatter', () => {
  test('serializes data and content', () => {
    const result = serializeFrontmatter(
      { name: 'test', description: 'A test' },
      '# Content\n\nBody.'
    );
    expect(result).toContain('---');
    expect(result).toContain('name: test');
    expect(result).toContain('# Content');
  });

  test('handles empty data', () => {
    const result = serializeFrontmatter({}, '# Just content');
    expect(result).toBe('# Just content');
    expect(result).not.toContain('---');
  });
});
