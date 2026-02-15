/**
 * Example scan tests.
 *
 * Tests for example file scanning utilities.
 */

import { describe, expect, it } from 'bun:test';
import { isExampleFile, scanExampleSource } from './example-scan';

describe('isExampleFile', () => {
  it('should return true for example.ts files', () => {
    expect(isExampleFile('/path/to/src/example.ts')).toBe(true);
    expect(isExampleFile('/path/to/example.ts')).toBe(true);
  });

  it('should return true for .example.ts files', () => {
    expect(isExampleFile('/path/to/my-app.example.ts')).toBe(true);
  });

  it('should return false for non-example files', () => {
    expect(isExampleFile('/path/to/feature.ts')).toBe(false);
    expect(isExampleFile('/path/to/operation.ts')).toBe(false);
    expect(isExampleFile('/path/to/example-util.ts')).toBe(false);
  });
});

describe('scanExampleSource', () => {
  it('should extract basic meta fields', () => {
    const code = `
import type { ExampleSpec } from '@contractspec/lib.contracts-spec';

const example: ExampleSpec = {
  meta: {
    key: 'test-example',
    version: '1.0.0',
    title: 'Test Example',
    description: 'A test example for testing.',
    kind: 'template',
    visibility: 'public',
    stability: 'experimental',
    owners: ['@platform.core'],
    tags: ['test', 'example'],
  },
  entrypoints: {
    packageName: '@contractspec/example.test',
    feature: './feature',
  },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground'] },
    studio: { enabled: false, installable: false },
    mcp: { enabled: false },
  },
};

export default example;
`;

    const result = scanExampleSource(code, '/examples/test/src/example.ts');

    expect(result.key).toBe('test-example');
    expect(result.version).toBe('1.0.0');
    expect(result.title).toBe('Test Example');
    expect(result.description).toBe('A test example for testing.');
    expect(result.kind).toBe('template');
    expect(result.visibility).toBe('public');
    expect(result.stability).toBe('experimental');
    expect(result.owners).toEqual(['@platform.core']);
    expect(result.tags).toEqual(['test', 'example']);
  });

  it('should extract entrypoints', () => {
    const code = `
const example = {
  meta: { key: 'my-example', version: '1.0.0' },
  entrypoints: {
    packageName: '@my/package',
    feature: './feature',
    contracts: './contracts',
    presentations: './presentations',
    handlers: './handlers',
  },
  surfaces: { templates: false, sandbox: { enabled: false, modes: [] }, studio: { enabled: false, installable: false }, mcp: { enabled: false } },
};
`;

    const result = scanExampleSource(code, '/test/example.ts');

    expect(result.entrypoints.packageName).toBe('@my/package');
    expect(result.entrypoints.feature).toBe('./feature');
    expect(result.entrypoints.contracts).toBe('./contracts');
    expect(result.entrypoints.presentations).toBe('./presentations');
    expect(result.entrypoints.handlers).toBe('./handlers');
  });

  it('should extract surfaces', () => {
    const code = `
const example = {
  meta: { key: 'surface-example', version: '1.0.0' },
  entrypoints: { packageName: '@test/pkg' },
  surfaces: {
    templates: true,
    sandbox: { enabled: true, modes: ['playground', 'specs', 'builder'] },
    studio: { enabled: true, installable: true },
    mcp: { enabled: true },
  },
};
`;

    const result = scanExampleSource(code, '/test/example.ts');

    expect(result.surfaces.templates).toBe(true);
    expect(result.surfaces.sandbox.enabled).toBe(true);
    expect(result.surfaces.sandbox.modes).toContain('playground');
    expect(result.surfaces.sandbox.modes).toContain('specs');
    expect(result.surfaces.studio.enabled).toBe(true);
    expect(result.surfaces.studio.installable).toBe(true);
    expect(result.surfaces.mcp.enabled).toBe(true);
  });

  it('should extract docs section', () => {
    const code = `
const example = {
  meta: { key: 'docs-example', version: '1.0.0' },
  docs: {
    rootDocId: 'docs.examples.test',
    goalDocId: 'docs.goals.test',
  },
  entrypoints: { packageName: '@test/pkg' },
  surfaces: { templates: false, sandbox: { enabled: false, modes: [] }, studio: { enabled: false, installable: false }, mcp: { enabled: false } },
};
`;

    const result = scanExampleSource(code, '/test/example.ts');

    expect(result.docs?.rootDocId).toBe('docs.examples.test');
    expect(result.docs?.goalDocId).toBe('docs.goals.test');
  });

  it('should fallback to extracting key from file path', () => {
    const code = `
const example = {
  meta: { version: '1.0.0' },
  entrypoints: { packageName: '@test/pkg' },
  surfaces: { templates: false, sandbox: { enabled: false, modes: [] }, studio: { enabled: false, installable: false }, mcp: { enabled: false } },
};
`;

    const result = scanExampleSource(
      code,
      '/packages/examples/my-app/src/example.ts'
    );

    expect(result.key).toBe('my-app');
  });

  it('should handle minimal example spec', () => {
    const code = `
const example = {
  meta: {},
  entrypoints: {},
  surfaces: {},
};
`;

    const result = scanExampleSource(code, '/test/example.ts');

    expect(result.key).toBeDefined();
    expect(result.surfaces.templates).toBe(false);
    expect(result.surfaces.sandbox.enabled).toBe(false);
  });
});
