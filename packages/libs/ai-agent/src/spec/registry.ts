import type { AgentSpec } from './spec';
import { getDefaultI18n } from '../i18n';
import { compareVersions } from 'compare-versions';
import { SpecContractRegistry } from '@contractspec/lib.contracts/registry';

/**
 * Registry for managing agent specifications.
 *
 * Provides registration, lookup, and version management for agent specs.
 */
export class AgentRegistry extends SpecContractRegistry<'agent', AgentSpec> {
  public constructor(items?: AgentSpec[]) {
    super('agent', items);
  }

  /**
   * List all unique agent names (without versions).
   */
  listNames(): string[] {
    const names = new Set<string>();
    for (const spec of this.items.values()) {
      names.add(spec.meta.key);
    }
    return [...names];
  }

  /**
   * Get an agent specification or throw if not found.
   *
   * @param name - Agent name
   * @param version - Optional version
   * @returns The agent spec
   * @throws Error if the spec is not found
   */
  require(name: string, version?: string): AgentSpec {
    const spec = this.get(name, version);
    if (!spec) {
      throw new Error(
        getDefaultI18n().t('error.agentSpecNotFound', {
          name: `${name}${version != null ? `.v${version}` : ''}`,
        })
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
  has(name: string, version?: string): boolean {
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
    for (const spec of this.items.values()) {
      if (spec.meta.key === name) {
        versions.push(spec);
      }
    }
    return versions.sort((a, b) =>
      compareVersions(a.meta.version, b.meta.version)
    );
  }
}

/**
 * Create a new agent registry.
 */
export function createAgentRegistry(): AgentRegistry {
  return new AgentRegistry();
}
