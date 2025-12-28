import { describe, it, expect } from 'bun:test';
import {
  validateExample,
  validateExamples,
  validateExampleReferences,
} from './validation';
import type { ExampleSpec } from './types';

function createValidExample(key: string): ExampleSpec {
  return {
    meta: {
      key,
      version: 1,
      description: 'Test example',
      stability: 'experimental',
      owners: ['@team'],
      tags: ['test'],
      kind: 'template',
      visibility: 'public',
    },
    surfaces: {
      templates: true,
      sandbox: { enabled: true, modes: ['playground'] },
      studio: { enabled: true, installable: true },
      mcp: { enabled: false },
    },
    entrypoints: {
      packageName: '@contractspec/example.test',
    },
  };
}

describe('validateExample', () => {
  it('should validate a correct example', () => {
    const example = createValidExample('test-1');
    const result = validateExample(example);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should fail for missing required fields', () => {
    const result = validateExample({});
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should fail for invalid meta.kind', () => {
    const example = {
      ...createValidExample('test'),
      meta: {
        ...createValidExample('test').meta,
        kind: 'invalid' as ExampleSpec['meta']['kind'],
      },
    };
    const result = validateExample(example);
    expect(result.valid).toBe(false);
  });

  it('should warn for unscoped package name', () => {
    const example = createValidExample('test');
    example.entrypoints.packageName = 'unscoped-package';
    const result = validateExample(example);
    expect(result.warnings.some((w) => w.path === 'entrypoints.packageName')).toBe(
      true
    );
  });

  it('should error when studio.installable is true but studio.enabled is false', () => {
    const example = createValidExample('test');
    example.surfaces.studio = { enabled: false, installable: true };
    const result = validateExample(example);
    expect(result.valid).toBe(false);
    expect(
      result.errors.some((e) => e.code === 'STUDIO_INSTALLABLE_REQUIRES_ENABLED')
    ).toBe(true);
  });

  it('should warn when sandbox is enabled but has no modes', () => {
    const example = createValidExample('test');
    example.surfaces.sandbox = { enabled: true, modes: [] };
    const result = validateExample(example);
    expect(
      result.warnings.some((w) => w.path === 'surfaces.sandbox.modes')
    ).toBe(true);
  });

  it('should warn when features present but no feature entrypoint', () => {
    const example = createValidExample('test');
    example.features = [{ key: 'some-feature' }];
    const result = validateExample(example);
    expect(
      result.warnings.some((w) => w.path === 'entrypoints.feature')
    ).toBe(true);
  });

  it('should warn for public example in idea stability', () => {
    const example = createValidExample('test');
    example.meta.stability = 'idea';
    example.meta.visibility = 'public';
    const result = validateExample(example);
    expect(result.warnings.some((w) => w.path === 'meta.stability')).toBe(true);
  });
});

describe('validateExamples', () => {
  it('should validate multiple examples', () => {
    const examples = [
      createValidExample('test-1'),
      createValidExample('test-2'),
    ];
    const result = validateExamples(examples);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.examples).toHaveLength(2);
    }
  });

  it('should detect duplicate keys', () => {
    const examples = [
      createValidExample('test-1'),
      createValidExample('test-1'),
    ];
    const result = validateExamples(examples);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.some((e) => e.code === 'DUPLICATE_KEY')).toBe(true);
    }
  });

  it('should collect errors from all examples', () => {
    const example1 = createValidExample('test-1');
    example1.surfaces.studio = { enabled: false, installable: true };
    const example2 = createValidExample('test-2');
    example2.surfaces.studio = { enabled: false, installable: true };

    const result = validateExamples([example1, example2]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors.length).toBe(2);
    }
  });
});

describe('validateExampleReferences', () => {
  it('should warn when package name not in workspace', () => {
    const example = createValidExample('test');
    const context = {
      packageNames: new Set(['@other/package']),
    };
    const result = validateExampleReferences(example, context);
    expect(
      result.warnings.some((w) => w.path === 'entrypoints.packageName')
    ).toBe(true);
  });

  it('should not warn when package name is in workspace', () => {
    const example = createValidExample('test');
    const context = {
      packageNames: new Set(['@contractspec/example.test']),
    };
    const result = validateExampleReferences(example, context);
    expect(
      result.warnings.filter((w) => w.path === 'entrypoints.packageName')
    ).toHaveLength(0);
  });

  it('should warn when feature ref not found', () => {
    const example = createValidExample('test');
    example.features = [{ key: 'unknown-feature' }];
    const context = {
      featureKeys: new Set(['other-feature']),
    };
    const result = validateExampleReferences(example, context);
    expect(result.warnings.some((w) => w.path === 'features')).toBe(true);
  });

  it('should warn when blueprint ref not found', () => {
    const example = createValidExample('test');
    example.blueprint = { key: 'unknown-blueprint' };
    const context = {
      blueprintKeys: new Set(['other-blueprint']),
    };
    const result = validateExampleReferences(example, context);
    expect(result.warnings.some((w) => w.path === 'blueprint')).toBe(true);
  });

  it('should return valid result when all references exist', () => {
    const example = createValidExample('test');
    example.features = [{ key: 'my-feature' }];
    example.blueprint = { key: 'my-blueprint' };
    const context = {
      packageNames: new Set(['@contractspec/example.test']),
      featureKeys: new Set(['my-feature']),
      blueprintKeys: new Set(['my-blueprint']),
    };
    const result = validateExampleReferences(example, context);
    expect(result.valid).toBe(true);
    expect(result.warnings).toHaveLength(0);
  });
});
