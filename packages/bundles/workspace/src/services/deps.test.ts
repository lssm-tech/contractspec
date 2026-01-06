import { describe, expect, it, mock, beforeEach, afterEach } from 'bun:test';
import { analyzeDeps, getGraphStats } from './deps';

const mockCreateContractGraph = mock(() => new Map());
const mockAddContractNode = mock();
const mockBuildReverseEdges = mock();
const mockDetectCycles = mock(() => [] as string[][]);
const mockFindMissingDependencies = mock(() => [] as any[]);
const mockParseImportedSpecNames = mock(() => []);

describe('Deps Service', () => {
  const mockFs = {
    glob: mock(() => Promise.resolve(['spec1.ts', 'spec2.ts'])),
    readFile: mock(() => Promise.resolve('content')),
    relative: mock((from: string, to: string) => to),
    basename: mock((p: string) => p),
  };

  beforeEach(() => {
    mockFs.glob.mockClear();
    mockFs.readFile.mockClear();
    
    mockCreateContractGraph.mockClear();
    mockAddContractNode.mockClear();
    
    // Default mocked return for graph creation
    const graphMap = new Map();
    Object.defineProperty(graphMap, 'size', { value: 2 });
    mockCreateContractGraph.mockReturnValue(graphMap);

    mock.module('@contractspec/module.workspace', () => ({
      createContractGraph: mockCreateContractGraph,
      addContractNode: mockAddContractNode,
      buildReverseEdges: mockBuildReverseEdges,
      detectCycles: mockDetectCycles,
      findMissingDependencies: mockFindMissingDependencies,
      parseImportedSpecNames: mockParseImportedSpecNames,
      toDot: mock(() => 'dot-graph'),
    }));
  });

  afterEach(() => {
    mock.restore();
  });

  describe('analyzeDeps', () => {
    it('should build dependency graph', async () => {
      const result = await analyzeDeps({ fs: mockFs as any });
      
      expect(result.graph).toBeDefined();
      expect(result.total).toBe(2);
      expect(mockFs.glob).toHaveBeenCalled();
      expect(mockAddContractNode).toHaveBeenCalledTimes(2);
      expect(mockBuildReverseEdges).toHaveBeenCalled();
    });

    it('should detect cycles and missing deps', async () => {
      mockDetectCycles.mockReturnValue([['a', 'b', 'a']] as string[][]);
      mockFindMissingDependencies.mockReturnValue([{ contract: 'a', missing: ['c'] }]);

      const result = await analyzeDeps({ fs: mockFs as any });
      
      expect(result.cycles).toHaveLength(1);
      expect(result.missing).toHaveLength(1);
    });
  });

  describe('getGraphStats', () => {
    it('should calculate stats', () => {
      const graph = new Map<string, any>();
      graph.set('a', { dependencies: ['b'], dependents: [] });
      graph.set('b', { dependencies: [], dependents: ['a'] });
      
      const stats = getGraphStats(graph);
      
      expect(stats.total).toBe(2);
      expect(stats.withDeps).toBe(1); // a has deps
      expect(stats.withoutDeps).toBe(1); // b has no deps
      expect(stats.used).toBe(1); // b is used by a
      expect(stats.unused).toBe(1); // a is unused
    });
  });
});
