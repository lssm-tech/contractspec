/**
 * Pack dependency resolution — topological sort and conflict detection.
 * Pure algorithm, no I/O.
 */
import type { PackManifest } from './config.js';

/**
 * A node in the dependency graph.
 */
export interface DependencyNode {
  name: string;
  manifest: PackManifest;
  dependencies: string[];
  conflicts: string[];
}

/**
 * Resolution result.
 */
export interface DependencyResolution {
  /** Packs in topological order (dependencies first). */
  sorted: string[];
  /** Circular dependency cycles detected. */
  cycles: string[][];
  /** Conflict pairs: [packA, packB] */
  conflictPairs: [string, string][];
  /** Missing dependencies: [pack, missingDep] */
  missingDeps: [string, string][];
  /** Whether resolution succeeded without errors. */
  ok: boolean;
}

/**
 * Build a dependency graph from pack manifests.
 */
export function buildDependencyGraph(
  manifests: PackManifest[]
): Map<string, DependencyNode> {
  const graph = new Map<string, DependencyNode>();
  for (const m of manifests) {
    graph.set(m.name, {
      name: m.name,
      manifest: m,
      dependencies: m.dependencies,
      conflicts: m.conflicts,
    });
  }
  return graph;
}

/**
 * Resolve pack dependencies with topological sort, cycle detection,
 * and conflict detection.
 */
export function resolveDependencies(
  manifests: PackManifest[]
): DependencyResolution {
  const graph = buildDependencyGraph(manifests);
  const allNames = new Set(graph.keys());

  // Detect missing dependencies
  const missingDeps: [string, string][] = [];
  for (const [name, node] of graph) {
    for (const dep of node.dependencies) {
      if (!allNames.has(dep)) {
        missingDeps.push([name, dep]);
      }
    }
  }

  // Topological sort with cycle detection (Kahn's algorithm)
  const { sorted, cycles } = topologicalSort(graph);

  // Conflict detection
  const conflictPairs = detectConflicts(graph);

  const ok =
    cycles.length === 0 &&
    conflictPairs.length === 0 &&
    missingDeps.length === 0;

  return { sorted, cycles, conflictPairs, missingDeps, ok };
}

/**
 * Kahn's algorithm for topological sort with cycle detection.
 */
function topologicalSort(graph: Map<string, DependencyNode>): {
  sorted: string[];
  cycles: string[][];
} {
  // Compute in-degrees (only for edges within the graph)
  const inDegree = new Map<string, number>();
  for (const name of graph.keys()) {
    inDegree.set(name, 0);
  }
  for (const [, node] of graph) {
    for (const dep of node.dependencies) {
      if (graph.has(dep)) {
        inDegree.set(dep, (inDegree.get(dep) ?? 0) + 1);
      }
    }
  }

  // Start with nodes that have no incoming edges
  const queue: string[] = [];
  for (const [name, degree] of inDegree) {
    if (degree === 0) queue.push(name);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);

    const node = graph.get(current)!;
    for (const dep of node.dependencies) {
      if (!graph.has(dep)) continue;
      const newDegree = (inDegree.get(dep) ?? 1) - 1;
      inDegree.set(dep, newDegree);
      if (newDegree === 0) {
        queue.push(dep);
      }
    }
  }

  // Detect cycles — nodes not in sorted output are in cycles
  const cycles: string[][] = [];
  if (sorted.length < graph.size) {
    const remaining = new Set<string>();
    for (const name of graph.keys()) {
      if (!sorted.includes(name)) remaining.add(name);
    }
    // Extract cycles using DFS
    const visited = new Set<string>();
    for (const start of remaining) {
      if (visited.has(start)) continue;
      const cycle = traceCycle(start, graph, remaining);
      if (cycle.length > 0) {
        cycles.push(cycle);
        for (const n of cycle) visited.add(n);
      }
    }
  }

  // Reverse: dependencies should come first in the result
  return { sorted: sorted.reverse(), cycles };
}

/**
 * Trace a single cycle starting from a node using DFS.
 */
function traceCycle(
  start: string,
  graph: Map<string, DependencyNode>,
  remaining: Set<string>
): string[] {
  const path: string[] = [];
  const pathSet = new Set<string>();
  let current: string | undefined = start;

  while (current && !pathSet.has(current)) {
    path.push(current);
    pathSet.add(current);
    const node = graph.get(current);
    if (!node) break;
    current = node.dependencies.find((d) => remaining.has(d) && graph.has(d));
  }

  if (current && pathSet.has(current)) {
    // Trim path to the actual cycle
    const cycleStart = path.indexOf(current);
    return path.slice(cycleStart);
  }

  return path;
}

/**
 * Detect conflicting pack pairs.
 */
function detectConflicts(
  graph: Map<string, DependencyNode>
): [string, string][] {
  const conflicts: [string, string][] = [];
  const seen = new Set<string>();

  for (const [name, node] of graph) {
    for (const conflict of node.conflicts) {
      if (graph.has(conflict)) {
        const key = [name, conflict].sort().join(':');
        if (!seen.has(key)) {
          seen.add(key);
          conflicts.push([name, conflict]);
        }
      }
    }
  }

  return conflicts;
}
