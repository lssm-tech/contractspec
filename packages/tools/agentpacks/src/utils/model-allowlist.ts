/**
 * Model ID allowlist validation.
 *
 * Validates model identifiers against known provider patterns.
 * Returns warnings (not errors) for unknown model IDs to allow
 * innovative use of new models.
 */

/**
 * Known model ID patterns by provider.
 * Each pattern is a regex that matches valid model IDs for that provider.
 */
const KNOWN_MODEL_PATTERNS: {
  provider: string;
  pattern: RegExp;
  examples: string[];
}[] = [
  {
    provider: 'Anthropic',
    pattern:
      /^(anthropic\/)?claude-(opus|sonnet|haiku|instant|3|3\.5|4)[-.\w]*/i,
    examples: ['claude-sonnet-4-20250514', 'anthropic/claude-opus-4-6'],
  },
  {
    provider: 'OpenAI',
    pattern:
      /^(openai\/)?(gpt-4|gpt-3\.5|o[1-9]|o[1-9]-\w+|chatgpt-4o|gpt-4o)[-.\w]*/i,
    examples: ['gpt-4o', 'openai/gpt-4-turbo', 'o1-preview'],
  },
  {
    provider: 'Google',
    pattern:
      /^(google\/)?gemini-(pro|ultra|nano|flash|1\.5|2\.0|2\.5|exp)[-.\w]*/i,
    examples: ['gemini-2.5-flash', 'google/gemini-pro'],
  },
  {
    provider: 'Meta',
    pattern: /^(meta\/)?(llama|codellama)[-.\w]*/i,
    examples: ['llama-3.1-70b', 'meta/llama-3-8b'],
  },
  {
    provider: 'Mistral',
    pattern:
      /^(mistral(ai)?\/)?(mistral|mixtral|codestral|pixtral|devstral|magistral|voxtral|ministral)[-.\w]*/i,
    examples: [
      'mistral-large-latest',
      'codestral-latest',
      'devstral-small-latest',
    ],
  },
  {
    provider: 'Cohere',
    pattern: /^(cohere\/)?command[-.\w]*/i,
    examples: ['command-r-plus', 'cohere/command-r'],
  },
  {
    provider: 'DeepSeek',
    pattern: /^(deepseek\/)?deepseek[-.\w]*/i,
    examples: ['deepseek-coder', 'deepseek/deepseek-chat'],
  },
  {
    provider: 'Qwen',
    pattern: /^(qwen\/)?qwen[-.\w]*/i,
    examples: ['qwen-2.5-72b'],
  },
  {
    provider: 'xAI',
    pattern: /^(xai\/)?grok[-.\w]*/i,
    examples: ['grok-2', 'xai/grok-3'],
  },
];

/** Validation result. */
export interface ModelValidationResult {
  modelId: string;
  known: boolean;
  provider?: string;
  warning?: string;
}

/**
 * Validate a single model ID against the allowlist.
 * Returns { known: true, provider } for known IDs,
 * or { known: false, warning } for unknown IDs.
 */
export function validateModelId(modelId: string): ModelValidationResult {
  if (!modelId || typeof modelId !== 'string') {
    return {
      modelId: modelId ?? '',
      known: false,
      warning: 'Empty model ID',
    };
  }

  for (const entry of KNOWN_MODEL_PATTERNS) {
    if (entry.pattern.test(modelId)) {
      return {
        modelId,
        known: true,
        provider: entry.provider,
      };
    }
  }

  return {
    modelId,
    known: false,
    warning: `Unknown model ID "${modelId}" — not in any known provider pattern. This may be a new or custom model.`,
  };
}

/**
 * Scan a models config for unknown model IDs.
 * Returns warnings for any model IDs not matching known patterns.
 * These are advisory only — they don't block publish.
 */
export function scanModelsForUnknownIds(config: {
  default?: string;
  small?: string;
  agents?: Record<string, { model: string }>;
  profiles?: Record<
    string,
    {
      default?: string;
      small?: string;
      agents?: Record<string, { model: string }>;
    }
  >;
}): string[] {
  const warnings: string[] = [];
  const checked = new Set<string>();

  function check(modelId: string | undefined, context: string): void {
    if (!modelId || checked.has(modelId)) return;
    checked.add(modelId);

    const result = validateModelId(modelId);
    if (!result.known) {
      warnings.push(`${context}: ${result.warning}`);
    }
  }

  // Check top-level defaults
  check(config.default, 'default model');
  check(config.small, 'small model');

  // Check agent assignments
  if (config.agents) {
    for (const [name, assignment] of Object.entries(config.agents)) {
      check(assignment.model, `agent "${name}"`);
    }
  }

  // Check profiles
  if (config.profiles) {
    for (const [profileName, profile] of Object.entries(config.profiles)) {
      check(profile.default, `profile "${profileName}" default`);
      check(profile.small, `profile "${profileName}" small`);
      if (profile.agents) {
        for (const [name, assignment] of Object.entries(profile.agents)) {
          check(assignment.model, `profile "${profileName}" agent "${name}"`);
        }
      }
    }
  }

  return warnings;
}
