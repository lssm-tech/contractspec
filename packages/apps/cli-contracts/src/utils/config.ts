import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';

const ConfigSchema = z.object({
  aiProvider: z
    .enum(['claude', 'openai', 'ollama', 'custom'])
    .default('claude'),
  aiModel: z.string().optional(),
  agentMode: z
    .enum(['simple', 'cursor', 'claude-code', 'openai-codex'])
    .default('simple'),
  customEndpoint: z.string().url().nullable().optional(),
  customApiKey: z.string().nullable().optional(),
  outputDir: z.string().default('./src'),
  conventions: z.object({
    operations: z.string().default('interactions/commands|queries'),
    events: z.string().default('events'),
    presentations: z.string().default('presentations'),
    forms: z.string().default('forms'),
  }),
  defaultOwners: z.array(z.string()).default([]),
  defaultTags: z.array(z.string()).default([]),
});

export type Config = z.infer<typeof ConfigSchema>;

const DEFAULT_CONFIG: Config = {
  aiProvider: 'claude',
  agentMode: 'simple',
  outputDir: './src',
  conventions: {
    operations: 'interactions/commands|queries',
    events: 'events',
    presentations: 'presentations',
    forms: 'forms',
  },
  defaultOwners: [],
  defaultTags: [],
};

/**
 * Load configuration from .contractsrc.json or use defaults
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<Config> {
  const configPath = join(cwd, '.contractsrc.json');

  if (!existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const content = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(content);
    return ConfigSchema.parse(parsed);
  } catch (error) {
    console.warn(
      `Warning: Could not parse .contractsrc.json, using defaults. Error: ${error}`
    );
    return DEFAULT_CONFIG;
  }
}

/**
 * Merge config with CLI options and environment variables
 */
export function mergeConfig(
  config: Config,
  options: {
    provider?: string;
    model?: string;
    agentMode?: string;
    endpoint?: string;
    outputDir?: string;
  }
): Config {
  return {
    ...config,
    aiProvider:
      (options.provider as Config['aiProvider']) ||
      (process.env.CONTRACTSPEC_AI_PROVIDER as Config['aiProvider']) ||
      config.aiProvider,
    aiModel:
      options.model || process.env.CONTRACTSPEC_AI_MODEL || config.aiModel,
    agentMode:
      (options.agentMode as Config['agentMode']) ||
      (process.env.CONTRACTSPEC_AGENT_MODE as Config['agentMode']) ||
      config.agentMode,
    customEndpoint:
      options.endpoint ||
      process.env.CONTRACTSPEC_LLM_ENDPOINT ||
      config.customEndpoint ||
      undefined,
    customApiKey:
      process.env.CONTRACTSPEC_LLM_API_KEY || config.customApiKey || undefined,
    outputDir: options.outputDir || config.outputDir,
  };
}

/**
 * Get API key for the configured provider
 */
export function getApiKey(provider: Config['aiProvider']): string | undefined {
  switch (provider) {
    case 'claude':
      return process.env.ANTHROPIC_API_KEY;
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'custom':
      return process.env.CONTRACTSPEC_LLM_API_KEY;
    case 'ollama':
      return undefined; // Ollama doesn't need API key for local
    default:
      return undefined;
  }
}
