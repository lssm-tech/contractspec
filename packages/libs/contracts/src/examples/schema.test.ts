import { describe, it, expect } from 'bun:test';
import {
  ExampleSpecSchema,
  ExampleMetaSchema,
  ExampleKindSchema,
  ExampleVisibilitySchema,
  parseExampleSpec,
  safeParseExampleSpec,
} from './schema';

describe('ExampleKindSchema', () => {
  it('should accept valid kinds', () => {
    expect(ExampleKindSchema.parse('template')).toBe('template');
    expect(ExampleKindSchema.parse('workflow')).toBe('workflow');
    expect(ExampleKindSchema.parse('integration')).toBe('integration');
  });

  it('should reject invalid kinds', () => {
    expect(() => ExampleKindSchema.parse('invalid')).toThrow();
    expect(() => ExampleKindSchema.parse('')).toThrow();
  });
});

describe('ExampleVisibilitySchema', () => {
  it('should accept valid visibility values', () => {
    expect(ExampleVisibilitySchema.parse('public')).toBe('public');
    expect(ExampleVisibilitySchema.parse('internal')).toBe('internal');
    expect(ExampleVisibilitySchema.parse('experimental')).toBe('experimental');
  });

  it('should reject invalid visibility values', () => {
    expect(() => ExampleVisibilitySchema.parse('private')).toThrow();
  });
});

describe('ExampleMetaSchema', () => {
  it('should accept valid meta', () => {
    const meta = {
      key: 'test-example',
      version: 1,
      description: 'Test description',
      stability: 'experimental',
      owners: ['@team'],
      tags: ['test'],
      kind: 'template',
      visibility: 'public',
    };
    expect(() => ExampleMetaSchema.parse(meta)).not.toThrow();
  });

  it('should require key', () => {
    const meta = {
      version: 1,
      description: 'Test',
      stability: 'experimental',
      owners: [],
      tags: [],
      kind: 'template',
      visibility: 'public',
    };
    expect(() => ExampleMetaSchema.parse(meta)).toThrow();
  });

  it('should require description', () => {
    const meta = {
      key: 'test',
      version: 1,
      stability: 'experimental',
      owners: [],
      tags: [],
      kind: 'template',
      visibility: 'public',
    };
    expect(() => ExampleMetaSchema.parse(meta)).toThrow();
  });

  it('should accept optional fields', () => {
    const meta = {
      key: 'test-example',
      version: 1,
      description: 'Test description',
      stability: 'experimental',
      owners: [],
      tags: [],
      kind: 'template',
      visibility: 'public',
      title: 'Test Title',
      summary: 'Short summary',
      domain: 'testing',
    };
    const parsed = ExampleMetaSchema.parse(meta);
    expect(parsed.title).toBe('Test Title');
    expect(parsed.summary).toBe('Short summary');
  });
});

describe('ExampleSpecSchema', () => {
  const validSpec = {
    meta: {
      key: 'test-example',
      version: 1,
      description: 'Test description',
      stability: 'experimental',
      owners: ['@team'],
      tags: ['test'],
      kind: 'template',
      visibility: 'public',
    },
    surfaces: {
      templates: true,
      sandbox: { enabled: true, modes: ['playground', 'specs'] },
      studio: { enabled: true, installable: true },
      mcp: { enabled: false },
    },
    entrypoints: {
      packageName: '@test/example',
    },
  };

  it('should accept valid spec', () => {
    expect(() => ExampleSpecSchema.parse(validSpec)).not.toThrow();
  });

  it('should require meta', () => {
    const spec = { ...validSpec, meta: undefined };
    expect(() => ExampleSpecSchema.parse(spec)).toThrow();
  });

  it('should require surfaces', () => {
    const spec = { ...validSpec, surfaces: undefined };
    expect(() => ExampleSpecSchema.parse(spec)).toThrow();
  });

  it('should require entrypoints', () => {
    const spec = { ...validSpec, entrypoints: undefined };
    expect(() => ExampleSpecSchema.parse(spec)).toThrow();
  });

  it('should accept optional docs', () => {
    const spec = {
      ...validSpec,
      docs: {
        rootDocId: 'docs.example.test',
        usageDocId: 'docs.example.usage',
      },
    };
    const parsed = ExampleSpecSchema.parse(spec);
    expect(parsed.docs?.rootDocId).toBe('docs.example.test');
  });

  it('should accept optional blueprint as SpecPointer', () => {
    const spec = {
      ...validSpec,
      blueprint: { key: 'my-blueprint', version: 1 },
    };
    expect(() => ExampleSpecSchema.parse(spec)).not.toThrow();
  });

  it('should accept optional features as array', () => {
    const spec = {
      ...validSpec,
      features: [{ key: 'my-feature' }],
    };
    expect(() => ExampleSpecSchema.parse(spec)).not.toThrow();
  });
});

describe('parseExampleSpec', () => {
  it('should return parsed spec for valid input', () => {
    const spec = {
      meta: {
        key: 'test',
        version: 1,
        description: 'Test',
        stability: 'experimental',
        owners: [],
        tags: [],
        kind: 'template',
        visibility: 'public',
      },
      surfaces: {
        templates: true,
        sandbox: { enabled: false, modes: [] },
        studio: { enabled: false, installable: false },
        mcp: { enabled: false },
      },
      entrypoints: { packageName: '@test/example' },
    };
    const result = parseExampleSpec(spec);
    expect(result.meta.key).toBe('test');
  });

  it('should throw for invalid input', () => {
    expect(() => parseExampleSpec({})).toThrow();
  });
});

describe('safeParseExampleSpec', () => {
  it('should return success for valid input', () => {
    const spec = {
      meta: {
        key: 'test',
        version: 1,
        description: 'Test',
        stability: 'experimental',
        owners: [],
        tags: [],
        kind: 'template',
        visibility: 'public',
      },
      surfaces: {
        templates: true,
        sandbox: { enabled: false, modes: [] },
        studio: { enabled: false, installable: false },
        mcp: { enabled: false },
      },
      entrypoints: { packageName: '@test/example' },
    };
    const result = safeParseExampleSpec(spec);
    expect(result.success).toBe(true);
  });

  it('should return failure for invalid input', () => {
    const result = safeParseExampleSpec({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });
});
