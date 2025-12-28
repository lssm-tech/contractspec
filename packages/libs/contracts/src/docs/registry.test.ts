import { describe, expect, it } from 'bun:test';
import { DocRegistry, registerDocBlocks, docId } from './registry';
import type { DocBlock } from './types';

describe('DocRegistry', () => {
  const createDocBlock = (
    id: string,
    overrides?: Partial<DocBlock>
  ): DocBlock => ({
    id,
    title: `Title for ${id}`,
    body: `# ${id}\n\nBody content for ${id}`,
    summary: `Summary for ${id}`,
    kind: 'goal',
    visibility: 'public',
    route: `/docs/${id.replace(/\./g, '/')}`,
    ...overrides,
  });

  describe('constructor', () => {
    it('should create empty registry', () => {
      const registry = new DocRegistry();
      expect(registry.list()).toEqual([]);
    });

    it('should initialize with doc blocks', () => {
      const block = createDocBlock('test.doc');
      const registry = new DocRegistry([block]);
      expect(registry.list()).toHaveLength(1);
    });

    it('should accept options during initialization', () => {
      const block = createDocBlock('test.doc');
      const registry = new DocRegistry([block], { routePrefix: '/custom' });
      expect(registry.list()).toHaveLength(1);
    });
  });

  describe('register', () => {
    it('should register a doc block', () => {
      const registry = new DocRegistry();
      const block = createDocBlock('docs.new');

      registry.register(block);
      expect(registry.list()).toHaveLength(1);
    });

    it('should return this for chaining', () => {
      const registry = new DocRegistry();
      const block1 = createDocBlock('docs.one');
      const block2 = createDocBlock('docs.two');

      registry.register(block1).register(block2);
      expect(registry.list()).toHaveLength(2);
    });

    it('should create presentation route from doc block', () => {
      const registry = new DocRegistry();
      const block = createDocBlock('docs.feature', {
        title: 'Feature Documentation',
        route: '/docs/feature',
      });

      registry.register(block);
      const routes = registry.list();

      const route = routes[0];
      expect(route?.route).toBe('/docs/feature');
      expect(route?.block).toBe(block);
      expect(route?.descriptor.meta.title).toBe('Feature Documentation');
    });
  });

  describe('get', () => {
    it('should get route by id', () => {
      const registry = new DocRegistry();
      const block = createDocBlock('docs.target');

      registry.register(block);
      const result = registry.get('docs.target');

      expect(result).toBeDefined();
      expect(result?.block.id).toBe('docs.target');
    });

    it('should return undefined for non-existent id', () => {
      const registry = new DocRegistry();
      expect(registry.get('nonexistent')).toBeUndefined();
    });
  });

  describe('list', () => {
    it('should return all registered routes', () => {
      const registry = new DocRegistry();
      const blocks = [
        createDocBlock('docs.one'),
        createDocBlock('docs.two'),
        createDocBlock('docs.three'),
      ];

      blocks.forEach((b) => registry.register(b));
      expect(registry.list()).toHaveLength(3);
    });
  });

  describe('toRouteTuples', () => {
    it('should return route/descriptor tuples', () => {
      const registry = new DocRegistry();
      const block = createDocBlock('docs.api', { route: '/docs/api' });

      registry.register(block);
      const tuples = registry.toRouteTuples();

      expect(tuples).toHaveLength(1);
      const tuple = tuples[0];
      expect(tuple?.[0]).toBe('/docs/api');
      expect(tuple?.[1].meta.title).toBe('Title for docs.api');
    });
  });

  describe('toPresentationSpecs', () => {
    it('should return presentation specs', () => {
      const registry = new DocRegistry();
      const block = createDocBlock('docs.presentation');

      registry.register(block);
      const specs = registry.toPresentationSpecs();

      expect(specs).toHaveLength(1);
      expect(specs[0]?.meta.key).toBe('docs.presentation');
    });

    it('should apply options when converting', () => {
      const registry = new DocRegistry();
      const block = createDocBlock('docs.custom');

      registry.register(block);
      const specs = registry.toPresentationSpecs({ namespace: 'web' });

      expect(specs[0]?.meta.key).toBe('web.docs.custom');
    });
  });
});

describe('registerDocBlocks', () => {
  it('should throw when required field is missing', () => {
    const invalidBlock = {
      id: 'docs.invalid',
      // missing title, body, kind, visibility, route
    } as DocBlock;

    expect(() => registerDocBlocks([invalidBlock])).toThrow(/missing field/);
  });
});

describe('docId', () => {
  it('should throw for unregistered doc', () => {
    expect(() => docId('nonexistent.doc')).toThrow(/not registered/);
  });
});
