import type { ModelsConfig, AgentModel } from '../features/models.js';

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

  // Step 2: Apply profile overlay
  if (modelProfile && merged.profiles?.[modelProfile]) {
    const profile = merged.profiles[modelProfile]!;
    if (profile.default) defaultModel = profile.default;
    if (profile.small) smallModel = profile.small;
    if (profile.agents) {
      agents = { ...agents, ...profile.agents };
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
