import { describe, expect, it } from 'bun:test';
import {
  docBlockToPresentationSpec,
  docBlocksToPresentationRoutes,
  docBlocksToPresentationSpecs,
  mapDocRoutes,
} from './presentations';
import type { DocBlock } from './types';

describe('docBlockToPresentationSpec', () => {
  const createDocBlock = (overrides?: Partial<DocBlock>): DocBlock => ({
    id: 'docs.test',
    title: 'Test Documentation',
    body: '# Test\n\nContent here',
    summary: 'Test summary',
    kind: 'goal',
    visibility: 'public',
    route: '/docs/test',
    ...overrides,
  });

  it('should convert doc block to presentation spec', () => {
    const block = createDocBlock();
    const spec = docBlockToPresentationSpec(block);

    expect(spec.meta.key).toBe('docs.test');
    expect(spec.meta.title).toBe('Test Documentation');
    expect(spec.meta.version).toBe(1);
    expect(spec.meta.description).toBe('Test summary');
    expect(spec.source.type).toBe('blocknotejs');
  });

  it('should use title when summary is not provided', () => {
    const block = createDocBlock({ summary: undefined });
    const spec = docBlockToPresentationSpec(block);

    expect(spec.meta.description).toBe('Test Documentation');
  });

  it('should apply namespace option', () => {
    const block = createDocBlock({ id: 'feature.docs' });
    const spec = docBlockToPresentationSpec(block, { namespace: 'web-landing' });

    expect(spec.meta.key).toBe('web-landing.feature.docs');
  });

  it('should use block version when provided', () => {
    const block = createDocBlock({ version: 3 });
    const spec = docBlockToPresentationSpec(block);

    expect(spec.meta.version).toBe(3);
  });

  it('should use defaultVersion option when block has no version', () => {
    const block = createDocBlock({ version: undefined });
    const spec = docBlockToPresentationSpec(block, { defaultVersion: 5 });

    expect(spec.meta.version).toBe(5);
  });

  it('should use block stability when provided', () => {
    const block = createDocBlock({ stability: 'beta' });
    const spec = docBlockToPresentationSpec(block);

    expect(spec.meta.stability).toBe('beta');
  });

  it('should use defaultStability option when block has no stability', () => {
    const block = createDocBlock({ stability: undefined });
    const spec = docBlockToPresentationSpec(block, { defaultStability: 'experimental' });

    expect(spec.meta.stability).toBe('experimental');
  });

  it('should include policy flags for non-public visibility', () => {
    const block = createDocBlock({ visibility: 'internal' });
    const spec = docBlockToPresentationSpec(block);

    expect(spec.policy?.flags).toContain('internal');
  });

  it('should not include policy for public visibility', () => {
    const block = createDocBlock({ visibility: 'public' });
    const spec = docBlockToPresentationSpec(block);

    expect(spec.policy).toBeUndefined();
  });

  it('should use default targets', () => {
    const block = createDocBlock();
    const spec = docBlockToPresentationSpec(block);

    expect(spec.targets).toContain('markdown');
    expect(spec.targets).toContain('react');
  });

  it('should use custom targets from options', () => {
    const block = createDocBlock();
    const spec = docBlockToPresentationSpec(block, {
      defaultTargets: ['markdown', 'application/json'],
    });

    expect(spec.targets).toEqual(['markdown', 'application/json']);
  });

  it('should include tags and owners from block', () => {
    const block = createDocBlock({
      tags: ['api', 'reference'],
      owners: ['platform.core', 'team.docs'],
    });
    const spec = docBlockToPresentationSpec(block);

    expect(spec.meta.tags).toEqual(['api', 'reference']);
    expect(spec.meta.owners).toEqual(['platform.core', 'team.docs']);
  });
});

describe('docBlocksToPresentationRoutes', () => {
  const createDocBlocks = (): DocBlock[] => [
    {
      id: 'docs.one',
      title: 'Doc One',
      body: 'Content One',
      kind: 'goal',
      visibility: 'public',
      route: '/docs/one',
    },
    {
      id: 'docs.two',
      title: 'Doc Two',
      body: 'Content Two',
      kind: 'how',
      visibility: 'public',
      route: '/docs/two',
    },
  ];

  it('should convert blocks to routes', () => {
    const blocks = createDocBlocks();
    const routes = docBlocksToPresentationRoutes(blocks);

    expect(routes).toHaveLength(2);
    expect(routes[0]!.route).toBe('/docs/one');
    expect(routes[1]!.route).toBe('/docs/two');
  });

  it('should include block reference in route', () => {
    const blocks = createDocBlocks();
    const routes = docBlocksToPresentationRoutes(blocks);

    expect(routes[0]!.block).toBe(blocks[0]!);
  });

  it('should derive route from id when route not provided', () => {
    const blocks: DocBlock[] = [{
      id: 'docs.api.users',
      title: 'Users API',
      body: 'Content',
      kind: 'reference',
      visibility: 'public',
    }];
    const routes = docBlocksToPresentationRoutes(blocks);

    expect(routes[0]!.route).toBe('/docs/api/users');
  });

  it('should use custom route prefix', () => {
    const blocks: DocBlock[] = [{
      id: 'docs.feature',
      title: 'Feature',
      body: 'Content',
      kind: 'goal',
      visibility: 'public',
    }];
    const routes = docBlocksToPresentationRoutes(blocks, {
      routePrefix: '/documentation',
    });

    expect(routes[0]!.route).toBe('/documentation/feature');
  });
});

describe('docBlocksToPresentationSpecs', () => {
  it('should convert blocks to specs', () => {
    const blocks: DocBlock[] = [
      { id: 'a', title: 'A', body: 'Body', kind: 'goal', visibility: 'public' },
      { id: 'b', title: 'B', body: 'Body', kind: 'how', visibility: 'public' },
    ];
    const specs = docBlocksToPresentationSpecs(blocks);

    expect(specs).toHaveLength(2);
    expect(specs[0]!.meta.key).toBe('a');
    expect(specs[1]!.meta.key).toBe('b');
  });
});

describe('mapDocRoutes', () => {
  it('should map routes to tuples', () => {
    const blocks: DocBlock[] = [{
      id: 'docs.map',
      title: 'Map Test',
      body: 'Content',
      kind: 'goal',
      visibility: 'public',
      route: '/docs/map',
    }];
    const routes = docBlocksToPresentationRoutes(blocks);
    const tuples = mapDocRoutes(routes);

    expect(tuples).toHaveLength(1);
    expect(tuples[0]![0]).toBe('/docs/map');
    expect(tuples[0]![1].meta.key).toBe('docs.map');
  });
});
