/**
 * Tests for DependencyService — graph building, Mermaid, reverse lookup, cycles.
 */
import { describe, test, expect, beforeEach } from 'bun:test';
import { setupTestDb } from './test-app.js';
import * as schema from '../src/db/schema.js';
import type { Db } from '../src/db/client.js';
import { DependencyService } from '../src/services/dependency-service.js';

let db: Db;
let depService: DependencyService;

function seedPack(
  name: string,
  deps: string[] = [],
  overrides: Partial<schema.NewPack> = {}
) {
  db.insert(schema.packs)
    .values({
      name,
      displayName: name,
      description: `Pack ${name}`,
      authorName: 'tester',
      dependencies: deps,
      ...overrides,
    })
    .run();
}

describe('DependencyService', () => {
  beforeEach(() => {
    db = setupTestDb();
    depService = new DependencyService(db);
  });

  describe('buildGraph', () => {
    test('returns null for non-existent pack', async () => {
      const graph = await depService.buildGraph('nonexistent');
      expect(graph).toBeNull();
    });

    test('returns single node for pack with no deps', async () => {
      seedPack('solo-pack');
      const graph = await depService.buildGraph('solo-pack');

      expect(graph).not.toBeNull();
      expect(graph!.root).toBe('solo-pack');
      expect(graph!.nodes).toEqual(['solo-pack']);
      expect(graph!.edges).toEqual([]);
      expect(graph!.depth).toBe(0);
    });

    test('builds graph with direct dependencies', async () => {
      seedPack('root', ['dep-a', 'dep-b']);
      seedPack('dep-a');
      seedPack('dep-b');

      const graph = await depService.buildGraph('root');
      expect(graph!.nodes).toHaveLength(3);
      expect(graph!.edges).toHaveLength(2);
      expect(graph!.depth).toBe(1);
    });

    test('builds transitive dependency graph', async () => {
      seedPack('root', ['mid']);
      seedPack('mid', ['leaf']);
      seedPack('leaf');

      const graph = await depService.buildGraph('root');
      expect(graph!.nodes).toEqual(
        expect.arrayContaining(['root', 'mid', 'leaf'])
      );
      expect(graph!.edges).toHaveLength(2);
      expect(graph!.depth).toBe(2);
    });

    test('respects maxDepth', async () => {
      seedPack('a', ['b']);
      seedPack('b', ['c']);
      seedPack('c', ['d']);
      seedPack('d');

      const graph = await depService.buildGraph('a', 2);
      // Should reach a→b→c but not c→d
      expect(graph!.nodes).toContain('a');
      expect(graph!.nodes).toContain('b');
      expect(graph!.nodes).toContain('c');
      // d would only be added if c's deps are explored at depth=2
      // c is at depth 2, so c's children at depth 3 are skipped
      expect(graph!.nodes).not.toContain('d');
    });

    test('handles deps referencing non-existent packs', async () => {
      seedPack('root', ['missing']);
      const graph = await depService.buildGraph('root');
      expect(graph!.nodes).toContain('missing');
      expect(graph!.edges).toHaveLength(1);
    });

    test('handles diamond dependency graph', async () => {
      seedPack('root', ['left', 'right']);
      seedPack('left', ['shared']);
      seedPack('right', ['shared']);
      seedPack('shared');

      const graph = await depService.buildGraph('root');
      // shared should appear once in nodes
      const sharedCount = graph!.nodes.filter((n) => n === 'shared').length;
      expect(sharedCount).toBe(1);
      expect(graph!.nodes).toHaveLength(4);
    });
  });

  describe('getReverseDependencies', () => {
    test('finds packs that depend on a given pack', async () => {
      seedPack('used-by-many');
      seedPack('consumer-a', ['used-by-many'], { downloads: 100 });
      seedPack('consumer-b', ['used-by-many'], { downloads: 50 });
      seedPack('unrelated');

      const result = await depService.getReverseDependencies('used-by-many');
      expect(result).toHaveLength(2);
      expect(result[0]!.packName).toBe('consumer-a'); // Sorted by downloads desc
      expect(result[1]!.packName).toBe('consumer-b');
    });

    test('returns empty for pack with no dependents', async () => {
      seedPack('lonely');
      const result = await depService.getReverseDependencies('lonely');
      expect(result).toHaveLength(0);
    });
  });

  describe('toMermaid', () => {
    test('generates valid Mermaid diagram', () => {
      const mermaid = DependencyService.toMermaid({
        root: 'my-pack',
        nodes: ['my-pack', 'dep-a', 'dep-b'],
        edges: [
          { from: 'my-pack', to: 'dep-a' },
          { from: 'my-pack', to: 'dep-b' },
        ],
        depth: 1,
      });

      expect(mermaid).toContain('graph TD');
      expect(mermaid).toContain('my_pack["my-pack"]:::root');
      expect(mermaid).toContain('my_pack --> dep_a');
      expect(mermaid).toContain('my_pack --> dep_b');
      expect(mermaid).toContain('classDef root');
    });
  });

  describe('detectCycles', () => {
    test('returns null when no cycles', () => {
      const cycle = DependencyService.detectCycles({
        root: 'a',
        nodes: ['a', 'b', 'c'],
        edges: [
          { from: 'a', to: 'b' },
          { from: 'b', to: 'c' },
        ],
        depth: 2,
      });
      expect(cycle).toBeNull();
    });

    test('detects direct cycle', () => {
      const cycle = DependencyService.detectCycles({
        root: 'a',
        nodes: ['a', 'b'],
        edges: [
          { from: 'a', to: 'b' },
          { from: 'b', to: 'a' },
        ],
        depth: 1,
      });
      expect(cycle).not.toBeNull();
      expect(cycle).toContain('a');
      expect(cycle).toContain('b');
    });

    test('detects indirect cycle', () => {
      const cycle = DependencyService.detectCycles({
        root: 'a',
        nodes: ['a', 'b', 'c'],
        edges: [
          { from: 'a', to: 'b' },
          { from: 'b', to: 'c' },
          { from: 'c', to: 'a' },
        ],
        depth: 2,
      });
      expect(cycle).not.toBeNull();
    });
  });
});

describe('Dependency routes', () => {
  let app: typeof import('../src/server.js').app;

  beforeEach(async () => {
    db = setupTestDb();
    app = (await import('../src/server.js')).app;

    seedPack('main-pack', ['dep-pack']);
    seedPack('dep-pack');
  });

  test('GET /packs/:name/dependencies returns graph', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/main-pack/dependencies')
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.graph).toBeDefined();
    expect(body.graph.root).toBe('main-pack');
    expect(body.graph.nodes).toContain('dep-pack');
  });

  test('GET /packs/:name/dependencies?format=mermaid returns Mermaid', async () => {
    const res = await app.handle(
      new Request(
        'http://localhost/packs/main-pack/dependencies?format=mermaid'
      )
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.mermaid).toContain('graph TD');
  });

  test('GET /packs/:name/dependencies returns 404 for unknown pack', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/nonexistent/dependencies')
    );
    expect(res.status).toBe(404);
  });

  test('GET /packs/:name/dependents returns reverse deps', async () => {
    const res = await app.handle(
      new Request('http://localhost/packs/dep-pack/dependents')
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.packName).toBe('dep-pack');
    expect(body.dependents).toHaveLength(1);
    expect(body.dependents[0].packName).toBe('main-pack');
  });
});
