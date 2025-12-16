/**
 * Contract dependency graph utilities.
 * Extracted from cli-contracts/src/commands/deps/graph.ts
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

  for (const [name, node] of graph) {
    for (const dep of node.dependencies) {
      const depNode = graph.get(dep);
      if (depNode) {
        depNode.dependents.push(name);
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

  function dfs(name: string, path: string[]) {
    if (stack.has(name)) {
      const start = path.indexOf(name);
      if (start >= 0) cycles.push([...path.slice(start), name]);
      return;
    }
    if (visited.has(name)) return;

    visited.add(name);
    stack.add(name);

    const node = graph.get(name);
    if (node) {
      for (const dep of node.dependencies) {
        dfs(dep, [...path, name]);
      }
    }

    stack.delete(name);
  }

  for (const name of graph.keys()) {
    if (!visited.has(name)) dfs(name, []);
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

  for (const [name, node] of graph) {
    const absent = node.dependencies.filter((dep) => !graph.has(dep));
    if (absent.length > 0) {
      missing.push({ contract: name, missing: absent });
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

  for (const [name, node] of graph) {
    for (const dep of node.dependencies) {
      lines.push(`  "${name}" -> "${dep}";`);
    }
    if (node.dependencies.length === 0) {
      lines.push(`  "${name}";`);
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
  name: string,
  file: string,
  dependencies: string[]
): void {
  graph.set(name, {
    name,
    file,
    dependencies,
    dependents: [],
  });
}




