import type {
  ModelsConfig,
  AgentModel,
  ModelProfile,
} from '../features/models.js';

/**
 * Resolved model configuration after profile activation and target overrides.
 */
export interface ResolvedModels {
  /** Primary model ID */
  default?: string;
  /** Lightweight/small model ID */
  small?: string;
  /** Per-agent model assignments */
  agents: Record<string, AgentModel>;
  /** Provider configurations (options, model-level options, variants) */
  providers: Record<
    string,
    {
      options?: Record<string, unknown>;
      models?: Record<
        string,
        {
          options?: Record<string, unknown>;
          variants?: Record<string, Record<string, unknown>>;
        }
      >;
    }
  >;
  /** Routing rules (passthrough for guidance generation) */
  routing: Array<{ when: Record<string, string>; use: string }>;
  /** Available profile names (for guidance docs) */
  profileNames: string[];
  /** Active profile name (if any) */
  activeProfile?: string;
  /** All profiles (for guidance docs) */
  profiles: Record<
    string,
    {
      description?: string;
      default?: string;
      small?: string;
    }
  >;
}

/**
 * Resolve the effective model configuration from merged models data.
 *
 * Resolution order:
 *   1. Start with base merged config (default, small, agents, providers)
 *   2. Apply selected profile overlay (if modelProfile is set)
 *   3. Apply target-specific overrides (if target has overrides)
 *
 * @param merged - The merged ModelsConfig from all packs
 * @param modelProfile - The active profile name (from workspace config)
 * @param targetId - The target to resolve for (applies target overrides)
 */
export function resolveModels(
  merged: ModelsConfig,
  modelProfile?: string,
  targetId?: string
): ResolvedModels {
  // Start with base values
  let defaultModel = merged.default;
  let smallModel = merged.small;
  let agents: Record<string, AgentModel> = { ...merged.agents };

  // Step 2: Apply profile overlay (with inheritance resolution)
  if (modelProfile && merged.profiles?.[modelProfile]) {
    const resolvedProfile = resolveProfileInheritance(
      modelProfile,
      merged.profiles
    );
    if (resolvedProfile.default) defaultModel = resolvedProfile.default;
    if (resolvedProfile.small) smallModel = resolvedProfile.small;
    if (resolvedProfile.agents) {
      agents = { ...agents, ...resolvedProfile.agents };
    }
  }

  // Step 3: Apply target-specific overrides
  if (targetId && merged.overrides?.[targetId]) {
    const targetOverride = merged.overrides[targetId]!;
    if (targetOverride.default) defaultModel = targetOverride.default;
    if (targetOverride.small) smallModel = targetOverride.small;
    if (targetOverride.agents) {
      agents = { ...agents, ...targetOverride.agents };
    }
  }

  // Build providers passthrough
  const providers: ResolvedModels['providers'] = {};
  if (merged.providers) {
    for (const [name, config] of Object.entries(merged.providers)) {
      providers[name] = {
        ...(config.options ? { options: config.options } : {}),
        ...(config.models ? { models: config.models } : {}),
      };
    }
  }

  // Build profile metadata for guidance docs
  const profileNames = Object.keys(merged.profiles ?? {});
  const profiles: ResolvedModels['profiles'] = {};
  if (merged.profiles) {
    for (const [name, profile] of Object.entries(merged.profiles)) {
      profiles[name] = {
        description: profile.description,
        default: profile.default,
        small: profile.small,
      };
    }
  }

  return {
    default: defaultModel,
    small: smallModel,
    agents,
    providers,
    routing: merged.routing ?? [],
    profileNames,
    activeProfile: modelProfile,
    profiles,
  };
}

/**
 * Resolve the effective model for a specific agent.
 * Priority: models feature agents > agent frontmatter model > default model.
 *
 * @param resolved - The resolved model config
 * @param agentName - The agent name to look up
 * @param frontmatterModel - Model from agent frontmatter (lower priority)
 */
export function resolveAgentModel(
  resolved: ResolvedModels,
  agentName: string,
  frontmatterModel?: string
): { model?: string; temperature?: number; top_p?: number } {
  // Models feature takes precedence
  const fromModels = resolved.agents[agentName];
  if (fromModels) {
    return {
      model: fromModels.model,
      temperature: fromModels.temperature,
      top_p: fromModels.top_p,
    };
  }

  // Fall back to agent frontmatter
  if (frontmatterModel) {
    return { model: frontmatterModel };
  }

  return {};
}

/**
 * Resolve profile inheritance by following `extends` chains.
 *
 * A profile with `extends: "parent"` inherits all fields from the parent
 * profile, with the child's fields taking precedence.
 *
 * Cycle detection: tracks visited profile names; throws on cycle.
 * Max depth: 10 levels (to prevent runaway resolution).
 *
 * @param profileName - The profile to resolve
 * @param profiles - All available profiles
 * @returns Fully resolved profile with inherited fields applied
 */
export function resolveProfileInheritance(
  profileName: string,
  profiles: Record<string, ModelProfile>
): ModelProfile {
  const visited = new Set<string>();
  return resolveProfileChain(profileName, profiles, visited, 0);
}

const MAX_INHERITANCE_DEPTH = 10;

function resolveProfileChain(
  name: string,
  profiles: Record<string, ModelProfile>,
  visited: Set<string>,
  depth: number
): ModelProfile {
  if (depth > MAX_INHERITANCE_DEPTH) {
    throw new Error(
      `Profile inheritance too deep (max ${MAX_INHERITANCE_DEPTH}): ${name}`
    );
  }

  if (visited.has(name)) {
    throw new Error(
      `Circular profile inheritance detected: ${[...visited, name].join(' → ')}`
    );
  }

  const profile = profiles[name];
  if (!profile) {
    throw new Error(`Profile "${name}" not found`);
  }

  visited.add(name);

  // Base case: no parent
  if (!profile.extends) {
    return { ...profile };
  }

  // Resolve parent first
  const parent = resolveProfileChain(
    profile.extends,
    profiles,
    visited,
    depth + 1
  );

  // Child overrides parent (shallow merge for agents)
  return {
    description: profile.description ?? parent.description,
    default: profile.default ?? parent.default,
    small: profile.small ?? parent.small,
    agents: {
      ...parent.agents,
      ...profile.agents,
    },
  };
}
