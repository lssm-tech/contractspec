import { eq, sql } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { packs } from '../db/schema.js';

/**
 * A single edge in the dependency graph.
 */
export interface DependencyEdge {
  from: string;
  to: string;
}

/**
 * Full dependency graph for a pack (transitive closure).
 */
export interface DependencyGraph {
  root: string;
  nodes: string[];
  edges: DependencyEdge[];
  depth: number;
}

/**
 * Reverse dependency result — packs that depend on a given pack.
 */
export interface ReverseDependency {
  packName: string;
  displayName: string;
  downloads: number;
}

/**
 * Service for computing pack dependency graphs and reverse lookups.
 */
export class DependencyService {
  constructor(private db: Db) {}

  /**
   * Build a full dependency graph starting from a root pack.
   * Performs BFS to discover all transitive dependencies.
   * Max depth prevents infinite loops from circular deps.
   */
  async buildGraph(
    rootName: string,
    maxDepth = 10
  ): Promise<DependencyGraph | null> {
    const rootPack = await this.db
      .select({ name: packs.name, dependencies: packs.dependencies })
      .from(packs)
      .where(eq(packs.name, rootName))
      .limit(1);

    if (!rootPack[0]) return null;

    const nodes = new Set<string>([rootName]);
    const edges: DependencyEdge[] = [];
    const queue: { name: string; depth: number }[] = [
      { name: rootName, depth: 0 },
    ];
    let maxReachedDepth = 0;

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      if (current.depth >= maxDepth) continue;

      const pack = await this.db
        .select({ name: packs.name, dependencies: packs.dependencies })
        .from(packs)
        .where(eq(packs.name, current.name))
        .limit(1);

      if (!pack[0]) continue;

      const deps = this.parseJsonArray(pack[0].dependencies);
      for (const dep of deps) {
        edges.push({ from: current.name, to: dep });
        if (!nodes.has(dep)) {
          nodes.add(dep);
          queue.push({ name: dep, depth: current.depth + 1 });
          maxReachedDepth = Math.max(maxReachedDepth, current.depth + 1);
        }
      }
    }

    return {
      root: rootName,
      nodes: Array.from(nodes),
      edges,
      depth: maxReachedDepth,
    };
  }

  /**
   * Find all packs that depend on a given pack (reverse lookup).
   * Uses SQLite JSON functions to search the dependencies array.
   */
  async getReverseDependencies(packName: string): Promise<ReverseDependency[]> {
    const results = await this.db.all<{
      name: string;
      display_name: string;
      downloads: number;
    }>(
      sql`SELECT p.name, p.display_name, p.downloads
          FROM packs p, json_each(p.dependencies) je
          WHERE je.value = ${packName}
          ORDER BY p.downloads DESC`
    );

    return results.map((r) => ({
      packName: r.name,
      displayName: r.display_name,
      downloads: r.downloads,
    }));
  }

  /**
   * Generate a Mermaid diagram from a dependency graph.
   */
  static toMermaid(graph: DependencyGraph): string {
    const lines: string[] = ['graph TD'];

    // Sanitize node IDs for Mermaid (replace special chars)
    const sanitize = (name: string) => name.replace(/[@/.-]/g, '_');

    // Add node labels
    for (const node of graph.nodes) {
      const id = sanitize(node);
      const isRoot = node === graph.root;
      if (isRoot) {
        lines.push(`  ${id}["${node}"]:::root`);
      } else {
        lines.push(`  ${id}["${node}"]`);
      }
    }

    // Add edges
    for (const edge of graph.edges) {
      lines.push(`  ${sanitize(edge.from)} --> ${sanitize(edge.to)}`);
    }

    // Style the root node
    lines.push('  classDef root fill:#4f46e5,color:#fff,stroke:#312e81');

    return lines.join('\n');
  }

  /**
   * Detect circular dependencies in the graph.
   * Returns the cycle path if found, null otherwise.
   */
  static detectCycles(graph: DependencyGraph): string[] | null {
    const adjacency = new Map<string, string[]>();
    for (const edge of graph.edges) {
      const existing = adjacency.get(edge.from) ?? [];
      existing.push(edge.to);
      adjacency.set(edge.from, existing);
    }

    const visited = new Set<string>();
    const inStack = new Set<string>();
    const path: string[] = [];

    function dfs(node: string): string[] | null {
      visited.add(node);
      inStack.add(node);
      path.push(node);

      for (const neighbor of adjacency.get(node) ?? []) {
        if (inStack.has(neighbor)) {
          // Found a cycle
          const cycleStart = path.indexOf(neighbor);
          return path.slice(cycleStart).concat(neighbor);
        }
        if (!visited.has(neighbor)) {
          const cycle = dfs(neighbor);
          if (cycle) return cycle;
        }
      }

      path.pop();
      inStack.delete(node);
      return null;
    }

    for (const node of graph.nodes) {
      if (!visited.has(node)) {
        const cycle = dfs(node);
        if (cycle) return cycle;
      }
    }
    return null;
  }

  /** Parse JSON array field that might be a string or array. */
  private parseJsonArray(value: unknown): string[] {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}
