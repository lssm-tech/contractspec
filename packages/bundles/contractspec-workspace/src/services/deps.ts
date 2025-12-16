/**
 * Dependency analysis service.
 */

import {
  createContractGraph,
  addContractNode,
  buildReverseEdges,
  detectCycles,
  findMissingDependencies,
  toDot,
  parseImportedSpecNames,
  type ContractGraph,
  type ContractNode,
} from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../ports/fs';

/**
 * Options for dependency analysis.
 */
export interface AnalyzeDepsOptions {
  /**
   * File pattern to search.
   */
  pattern?: string;
}

/**
 * Result of dependency analysis.
 */
export interface AnalyzeDepsResult {
  graph: ContractGraph;
  total: number;
  cycles: string[][];
  missing: { contract: string; missing: string[] }[];
}

/**
 * Analyze contract dependencies.
 */
export async function analyzeDeps(
  adapters: { fs: FsAdapter },
  options: AnalyzeDepsOptions = {}
): Promise<AnalyzeDepsResult> {
  const { fs } = adapters;

  const files = await fs.glob({ pattern: options.pattern });
  const graph = createContractGraph();

  for (const file of files) {
    const content = await fs.readFile(file);
    const relativePath = fs.relative('.', file);

    // Prefer explicit meta.name if present; otherwise fall back to filename stem
    const nameMatch = content.match(/name:\s*['"]([^'"]+)['"]/);
    const inferredName = nameMatch?.[1]
      ? nameMatch[1]
      : fs
          .basename(file)
          .replace(/\.[jt]s$/, '')
          .replace(
            /\.(contracts|event|presentation|workflow|data-view|migration|telemetry|experiment|app-config|integration|knowledge)$/,
            ''
          );

    const finalName = inferredName || 'unknown';
    const dependencies = parseImportedSpecNames(content, file);

    addContractNode(graph, finalName, relativePath, dependencies);
  }

  buildReverseEdges(graph);

  const cycles = detectCycles(graph);
  const missing = findMissingDependencies(graph);

  return {
    graph,
    total: graph.size,
    cycles,
    missing,
  };
}

/**
 * Get contract node by name.
 */
export function getContractNode(
  graph: ContractGraph,
  name: string
): ContractNode | undefined {
  return graph.get(name);
}

/**
 * Export graph as DOT format.
 */
export function exportGraphAsDot(graph: ContractGraph): string {
  return toDot(graph);
}

/**
 * Get graph statistics.
 */
export function getGraphStats(graph: ContractGraph): {
  total: number;
  withDeps: number;
  withoutDeps: number;
  used: number;
  unused: number;
} {
  const all = Array.from(graph.values());
  const withDeps = all.filter((c) => c.dependencies.length > 0);
  const withoutDeps = all.filter((c) => c.dependencies.length === 0);
  const used = all.filter((c) => c.dependents.length > 0);
  const unused = all.filter((c) => c.dependents.length === 0);

  return {
    total: graph.size,
    withDeps: withDeps.length,
    withoutDeps: withoutDeps.length,
    used: used.length,
    unused: unused.length,
  };
}


