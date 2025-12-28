import { describe, it, expect } from 'bun:test';
import type { ExampleSpec, ExampleMeta } from './types';
import {
  ExampleKindEnum,
  ExampleVisibilityEnum,
  ExampleSandboxModeEnum,
  isSpecPointer,
  isFeatureRef,
  isExampleKind,
  isExampleVisibility,
} from './types';

describe('ExampleKindEnum', () => {
  it('should have all expected values', () => {
    expect(ExampleKindEnum.Template).toBe('template');
    expect(ExampleKindEnum.Workflow).toBe('workflow');
    expect(ExampleKindEnum.Integration).toBe('integration');
    expect(ExampleKindEnum.Knowledge).toBe('knowledge');
    expect(ExampleKindEnum.Blueprint).toBe('blueprint');
    expect(ExampleKindEnum.UI).toBe('ui');
    expect(ExampleKindEnum.Script).toBe('script');
    expect(ExampleKindEnum.Library).toBe('library');
  });
});

describe('ExampleVisibilityEnum', () => {
  it('should have all expected values', () => {
    expect(ExampleVisibilityEnum.Public).toBe('public');
    expect(ExampleVisibilityEnum.Internal).toBe('internal');
    expect(ExampleVisibilityEnum.Experimental).toBe('experimental');
  });
});

describe('ExampleSandboxModeEnum', () => {
  it('should have all expected values', () => {
    expect(ExampleSandboxModeEnum.Playground).toBe('playground');
    expect(ExampleSandboxModeEnum.Specs).toBe('specs');
    expect(ExampleSandboxModeEnum.Builder).toBe('builder');
    expect(ExampleSandboxModeEnum.Markdown).toBe('markdown');
    expect(ExampleSandboxModeEnum.Evolution).toBe('evolution');
  });
});

describe('isSpecPointer', () => {
  it('should return true for SpecPointer objects', () => {
    expect(isSpecPointer({ key: 'my-blueprint' })).toBe(true);
    expect(isSpecPointer({ key: 'my-blueprint', version: 1 })).toBe(true);
  });

  it('should return false for AppBlueprintSpec objects', () => {
    const blueprint = {
      meta: {
        key: 'test',
        version: 1,
        appId: 'test',
        description: 'Test blueprint',
        stability: 'experimental' as const,
        owners: ['@test'],
        tags: ['test'],
      },
    };
    expect(isSpecPointer(blueprint)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isSpecPointer(undefined)).toBe(false);
  });
});

describe('isFeatureRef', () => {
  it('should return true for FeatureRef objects', () => {
    expect(isFeatureRef({ key: 'my-feature' })).toBe(true);
  });

  it('should return false for FeatureModuleSpec objects', () => {
    const feature = {
      meta: {
        key: 'test',
        version: 1,
        description: 'Test',
        stability: 'experimental' as const,
        owners: [],
        tags: [],
      },
    };
    expect(isFeatureRef(feature)).toBe(false);
  });
});

describe('isExampleKind', () => {
  it('should return true for valid kinds', () => {
    expect(isExampleKind('template')).toBe(true);
    expect(isExampleKind('workflow')).toBe(true);
    expect(isExampleKind('integration')).toBe(true);
    expect(isExampleKind('knowledge')).toBe(true);
    expect(isExampleKind('blueprint')).toBe(true);
    expect(isExampleKind('ui')).toBe(true);
    expect(isExampleKind('script')).toBe(true);
    expect(isExampleKind('library')).toBe(true);
  });

  it('should return false for invalid kinds', () => {
    expect(isExampleKind('invalid')).toBe(false);
    expect(isExampleKind('')).toBe(false);
    expect(isExampleKind(null)).toBe(false);
    expect(isExampleKind(123)).toBe(false);
  });
});

describe('isExampleVisibility', () => {
  it('should return true for valid visibility values', () => {
    expect(isExampleVisibility('public')).toBe(true);
    expect(isExampleVisibility('internal')).toBe(true);
    expect(isExampleVisibility('experimental')).toBe(true);
  });

  it('should return false for invalid visibility values', () => {
    expect(isExampleVisibility('private')).toBe(false);
    expect(isExampleVisibility('')).toBe(false);
    expect(isExampleVisibility(null)).toBe(false);
  });
});

describe('ExampleMeta type', () => {
  it('should allow valid ExampleMeta objects', () => {
    const meta: ExampleMeta = {
      key: 'test-example',
      version: 1,
      description: 'Test description',
      stability: 'experimental',
      owners: ['@team'],
      tags: ['test'],
      kind: 'template',
      visibility: 'public',
    };
    expect(meta.key).toBe('test-example');
    expect(meta.kind).toBe('template');
  });

  it('should allow optional fields', () => {
    const meta: ExampleMeta = {
      key: 'test-example',
      version: 1,
      description: 'Test description',
      stability: 'experimental',
      owners: [],
      tags: [],
      kind: 'workflow',
      visibility: 'internal',
      title: 'Test Title',
      summary: 'Short summary',
      domain: 'testing',
    };
    expect(meta.title).toBe('Test Title');
    expect(meta.summary).toBe('Short summary');
  });
});

describe('ExampleSpec type', () => {
  it('should allow valid ExampleSpec objects', () => {
    const spec: ExampleSpec = {
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
    expect(spec.meta.key).toBe('test-example');
    expect(spec.surfaces.templates).toBe(true);
  });

  it('should allow optional blueprint and features', () => {
    const spec: ExampleSpec = {
      meta: {
        key: 'test-example',
        version: 1,
        description: 'Test description',
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
      entrypoints: {
        packageName: '@test/example',
        feature: './feature',
        contracts: './contracts',
      },
      blueprint: { key: 'my-blueprint', version: 1 },
      features: [{ key: 'my-feature' }],
    };
    expect(spec.blueprint).toBeDefined();
    expect(spec.features).toHaveLength(1);
  });
});
