import { describe, expect, test } from 'bun:test';
import { listExamples } from './registry';
import { validateExamples } from '@contractspec/lib.contracts';

describe('@contractspec/module.examples registry', () => {
  test('should contain at least one example and all manifests should validate', () => {
    const examples = [...listExamples()];
    expect(examples.length).toBeGreaterThan(0);

    const result = validateExamples(examples);
    if (!result.ok) {
      const readable = result.errors
        .map(
          (e) =>
            `${e.exampleKey ?? 'unknown'}: ${e.message}${e.path ? ` (${e.path})` : ''}`
        )
        .join('\n');
      throw new Error(`validateExamples failed:\n${readable}`);
    }
  });

  test('should have unique ids', () => {
    const examples = [...listExamples()];
    const ids = examples.map((e) => e.meta.key);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});
