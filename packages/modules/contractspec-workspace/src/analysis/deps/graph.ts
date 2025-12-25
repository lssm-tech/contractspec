/**
 * Contract dependency graph utilities.
 * Extracted from cli-contractspec/src/commands/deps/graph.ts
 */

import type { ContractNode, ContractGraph } from '../../types/analysis-types';

export type { ContractNode, ContractGraph };

/**
 * Build reverse edges (dependents) for all nodes in the graph.
 */
export function buildReverseEdges(graph: ContractGraph): void {
  for (const node of graph.values()) {
    node.dependents = [];
  }

  for (const [key, node] of graph) {
    for (const dep of node.dependencies) {
      const depNode = graph.get(dep);
      if (depNode) {
        depNode.dependents.push(key);
      }
    }
  }

  for (const node of graph.values()) {
    node.dependents.sort((a, b) => a.localeCompare(b));
  }
}

/**
 * Detect circular dependencies in the graph.
 */
export function detectCycles(graph: ContractGraph): string[][] {
  const visited = new Set<string>();
  const stack = new Set<string>();
  const cycles: string[][] = [];

  function dfs(key: string, path: string[]) {
    if (stack.has(key)) {
      const start = path.indexOf(key);
      if (start >= 0) cycles.push([...path.slice(start), key]);
      return;
    }
    if (visited.has(key)) return;

    visited.add(key);
    stack.add(key);

    const node = graph.get(key);
    if (node) {
      for (const dep of node.dependencies) {
        dfs(dep, [...path, key]);
      }
    }

    stack.delete(key);
  }

  for (const key of graph.keys()) {
    if (!visited.has(key)) dfs(key, []);
  }

  return cycles;
}

/**
 * Find missing dependencies (referenced but not defined).
 */
export function findMissingDependencies(
  graph: ContractGraph
): { contract: string; missing: string[] }[] {
  const missing: { contract: string; missing: string[] }[] = [];

  for (const [key, node] of graph) {
    const absent = node.dependencies.filter((dep) => !graph.has(dep));
    if (absent.length > 0) {
      missing.push({ contract: key, missing: absent });
    }
  }

  return missing;
}

/**
 * Generate DOT format output for visualization.
 */
export function toDot(graph: ContractGraph): string {
  const lines: string[] = [];
  lines.push('digraph ContractDependencies {');
  lines.push('  rankdir=LR;');
  lines.push('  node [shape=box];');

  for (const [key, node] of graph) {
    for (const dep of node.dependencies) {
      lines.push(`  "${key}" -> "${dep}";`);
    }
    if (node.dependencies.length === 0) {
      lines.push(`  "${key}";`);
    }
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * Create an empty contract graph.
 */
export function createContractGraph(): ContractGraph {
  return new Map();
}

/**
 * Add a node to the contract graph.
 */
export function addContractNode(
  graph: ContractGraph,
  key: string,
  file: string,
  dependencies: string[]
): void {
  graph.set(key, {
    key,
    file,
    dependencies,
    dependents: [],
  });
}
