import type { AgentSpec } from './spec';
import { agentKey } from './spec';

/**
 * Registry for managing agent specifications.
 *
 * Provides registration, lookup, and version management for agent specs.
 */
export class AgentRegistry {
  private readonly specs = new Map<string, AgentSpec>();

  /**
   * Register an agent specification.
   *
   * @param spec - The agent specification to register
   * @returns This registry for chaining
   * @throws Error if the spec is already registered
   */
  register(spec: AgentSpec): this {
    const key = agentKey(spec.meta);
    if (this.specs.has(key)) {
      throw new Error(`Duplicate agent spec registered for ${key}`);
    }
    this.specs.set(key, spec);
    return this;
  }

  /**
   * Unregister an agent specification.
   *
   * @param name - Agent name
   * @param version - Agent version
   * @returns True if the spec was removed
   */
  unregister(name: string, version: number): boolean {
    return this.specs.delete(`${name}.v${version}`);
  }

  /**
   * List all registered agent specifications.
   */
  list(): AgentSpec[] {
    return [...this.specs.values()];
  }

  /**
   * List all unique agent names (without versions).
   */
  listNames(): string[] {
    const names = new Set<string>();
    for (const spec of this.specs.values()) {
      names.add(spec.meta.key);
    }
    return [...names];
  }

  /**
   * Get an agent specification by name and optional version.
   *
   * @param name - Agent name
   * @param version - Optional version. If omitted, returns the latest version.
   * @returns The agent spec or undefined if not found
   */
  get(name: string, version?: number): AgentSpec | undefined {
    if (version != null) {
      return this.specs.get(`${name}.v${version}`);
    }

    // Find latest version
    let latest: AgentSpec | undefined;
    let maxVersion = -Infinity;
    for (const spec of this.specs.values()) {
      if (spec.meta.key !== name) continue;
      if (spec.meta.version > maxVersion) {
        latest = spec;
        maxVersion = spec.meta.version;
      }
    }
    return latest;
  }

  /**
   * Get an agent specification or throw if not found.
   *
   * @param name - Agent name
   * @param version - Optional version
   * @returns The agent spec
   * @throws Error if the spec is not found
   */
  require(name: string, version?: number): AgentSpec {
    const spec = this.get(name, version);
    if (!spec) {
      throw new Error(
        `Agent spec not found for ${name}${version != null ? `.v${version}` : ''}`
      );
    }
    return spec;
  }

  /**
   * Check if an agent is registered.
   *
   * @param name - Agent name
   * @param version - Optional version
   */
  has(name: string, version?: number): boolean {
    return this.get(name, version) !== undefined;
  }

  /**
   * Get all versions of an agent.
   *
   * @param name - Agent name
   * @returns Array of specs sorted by version (ascending)
   */
  getVersions(name: string): AgentSpec[] {
    const versions: AgentSpec[] = [];
    for (const spec of this.specs.values()) {
      if (spec.meta.key === name) {
        versions.push(spec);
      }
    }
    return versions.sort((a, b) => a.meta.version - b.meta.version);
  }

  /**
   * Clear all registered specs.
   */
  clear(): void {
    this.specs.clear();
  }
}

/**
 * Create a new agent registry.
 */
export function createAgentRegistry(): AgentRegistry {
  return new AgentRegistry();
}
