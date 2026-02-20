import { join } from 'path';
import { z } from 'zod';
import { readJsonOrNull } from '../utils/filesystem.js';

/**
 * Secret patterns that must never appear in models.json.
 * Used by both pack validate and publish commands.
 */
const SECRET_PATTERNS = [
  /["']api[_-]?key["']\s*:/i,
  /["']apiKey["']\s*:/i,
  /["']secret["']\s*:/i,
  /["']password["']\s*:/i,
  /["'](?:auth_token|access_token|bearer_token)["']\s*:/i,
  /["']private[_-]?key["']\s*:/i,
  /-----BEGIN\s+(RSA|EC|DSA|OPENSSH|PGP)\s+PRIVATE\s+KEY-----/,
  /sk-[a-zA-Z0-9]{20,}/,
  /Bearer\s+[a-zA-Z0-9._-]{20,}/,
];

/**
 * Agent model assignment.
 */
export const AgentModelSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
});

export type AgentModel = z.infer<typeof AgentModelSchema>;

/**
 * Model profile — a named preset for default/small model selection.
 */
export const ModelProfileSchema = z.object({
  description: z.string().optional(),
  default: z.string().optional(),
  small: z.string().optional(),
  agents: z.record(z.string(), AgentModelSchema).optional(),
});

export type ModelProfile = z.infer<typeof ModelProfileSchema>;

/**
 * Structured routing condition — richer than simple key=value.
 * Supports task complexity, urgency, budget, context needs, and tool usage.
 */
export const RoutingConditionSchema = z.object({
  complexity: z
    .enum(['low', 'medium', 'high', 'critical'])
    .optional()
    .describe('Task complexity level'),
  urgency: z
    .enum(['low', 'normal', 'high'])
    .optional()
    .describe('Time sensitivity'),
  budget: z
    .enum(['minimal', 'standard', 'premium'])
    .optional()
    .describe('Cost/token budget tier'),
  contextWindowNeed: z
    .enum(['small', 'medium', 'large', 'max'])
    .optional()
    .describe('Required context window size'),
  toolUseIntensity: z
    .enum(['none', 'light', 'heavy'])
    .optional()
    .describe('Expected tool/function calling intensity'),
});

export type RoutingCondition = z.infer<typeof RoutingConditionSchema>;

/**
 * Routing rule — maps task context to a profile.
 *
 * `when` accepts either:
 * - Simple key=value pairs: `{ task: "review", language: "rust" }`
 * - Structured conditions: `{ complexity: "high", budget: "premium" }`
 * Both forms can be mixed.
 */
export const RoutingRuleSchema = z.object({
  when: z.record(z.string(), z.string()),
  use: z.string(),
  description: z.string().optional(),
  priority: z.number().optional(),
});

export type RoutingRule = z.infer<typeof RoutingRuleSchema>;

/**
 * Provider model options/variants.
 */
export const ProviderModelSchema = z.object({
  options: z.record(z.string(), z.unknown()).optional(),
  variants: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

export const ProviderConfigSchema = z.object({
  options: z.record(z.string(), z.unknown()).optional(),
  models: z.record(z.string(), ProviderModelSchema).optional(),
});

export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;

/**
 * Full models.json schema for a pack.
 */
export const ModelsSchema = z.object({
  default: z.string().optional(),
  small: z.string().optional(),
  agents: z.record(z.string(), AgentModelSchema).optional(),
  profiles: z.record(z.string(), ModelProfileSchema).optional(),
  providers: z.record(z.string(), ProviderConfigSchema).optional(),
  routing: z.array(RoutingRuleSchema).optional(),
  overrides: z
    .record(
      z.string(),
      z.object({
        default: z.string().optional(),
        small: z.string().optional(),
        agents: z.record(z.string(), AgentModelSchema).optional(),
      })
    )
    .optional(),
});

export type ModelsConfig = z.infer<typeof ModelsSchema>;

/**
 * Parsed models configuration from a pack.
 */
export interface ParsedModels {
  packName: string;
  sourcePath: string;
  config: ModelsConfig;
}

/**
 * Parse models configuration from a pack's models.json file.
 */
export function parseModels(
  packDir: string,
  packName: string
): ParsedModels | null {
  const modelsPath = join(packDir, 'models.json');
  const raw = readJsonOrNull<unknown>(modelsPath);
  if (!raw) return null;

  const parsed = ModelsSchema.parse(raw);

  return {
    packName,
    sourcePath: modelsPath,
    config: parsed,
  };
}

/**
 * Merge multiple models configs.
 * Strategy:
 *   - default, small: first-pack-wins
 *   - agents: merge by name, first-pack-wins per agent
 *   - profiles: additive (unique name), first-pack-wins on name conflict
 *   - providers: deep merge by provider key, first-pack-wins on scalar conflicts
 *   - routing: additive with original order preserved
 *   - overrides: first-pack-wins per target key
 */
export function mergeModelsConfigs(configs: ParsedModels[]): {
  config: ModelsConfig;
  warnings: string[];
} {
  const warnings: string[] = [];
  const result: ModelsConfig = {};

  for (const entry of configs) {
    const { config, packName } = entry;

    // default: first-pack-wins
    if (config.default !== undefined && result.default === undefined) {
      result.default = config.default;
    } else if (config.default !== undefined && result.default !== undefined) {
      warnings.push(
        `Models "default" from pack "${packName}" skipped (already defined).`
      );
    }

    // small: first-pack-wins
    if (config.small !== undefined && result.small === undefined) {
      result.small = config.small;
    } else if (config.small !== undefined && result.small !== undefined) {
      warnings.push(
        `Models "small" from pack "${packName}" skipped (already defined).`
      );
    }

    // agents: merge by name, first-pack-wins per agent
    if (config.agents) {
      if (!result.agents) result.agents = {};
      for (const [name, assignment] of Object.entries(config.agents)) {
        if (name in result.agents) {
          warnings.push(
            `Models agent "${name}" from pack "${packName}" skipped (already defined).`
          );
          continue;
        }
        result.agents[name] = assignment;
      }
    }

    // profiles: additive, first-pack-wins on name conflict
    if (config.profiles) {
      if (!result.profiles) result.profiles = {};
      for (const [name, profile] of Object.entries(config.profiles)) {
        if (name in result.profiles) {
          warnings.push(
            `Models profile "${name}" from pack "${packName}" skipped (already defined).`
          );
          continue;
        }
        result.profiles[name] = profile;
      }
    }

    // providers: deep merge by provider key
    if (config.providers) {
      if (!result.providers) result.providers = {};
      for (const [providerName, providerConfig] of Object.entries(
        config.providers
      )) {
        if (!(providerName in result.providers)) {
          result.providers[providerName] = providerConfig;
        } else {
          // Deep merge options
          const existing = result.providers[providerName]!;
          if (providerConfig.options) {
            existing.options = {
              ...providerConfig.options,
              ...existing.options,
            };
          }
          // Deep merge models
          if (providerConfig.models) {
            if (!existing.models) existing.models = {};
            for (const [modelName, modelConfig] of Object.entries(
              providerConfig.models
            )) {
              if (!(modelName in existing.models)) {
                existing.models[modelName] = modelConfig;
              }
              // First-pack-wins on existing model entries
            }
          }
        }
      }
    }

    // routing: additive, preserve order
    if (config.routing) {
      if (!result.routing) result.routing = [];
      result.routing.push(...config.routing);
    }

    // overrides: first-pack-wins per target key
    if (config.overrides) {
      if (!result.overrides) result.overrides = {};
      for (const [targetId, override] of Object.entries(config.overrides)) {
        if (targetId in result.overrides) {
          warnings.push(
            `Models override for target "${targetId}" from pack "${packName}" skipped (already defined).`
          );
          continue;
        }
        result.overrides[targetId] = override;
      }
    }
  }

  return { config: result, warnings };
}

/**
 * Scan a models config for potential secrets/credentials.
 * Returns an array of warning messages for each detected secret.
 */
export function scanModelsForSecrets(config: ModelsConfig): string[] {
  const warnings: string[] = [];
  const json = JSON.stringify(config);

  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(json)) {
      warnings.push(
        `Potential secret detected in models.json matching pattern: ${pattern.source}`
      );
    }
  }

  return warnings;
}
