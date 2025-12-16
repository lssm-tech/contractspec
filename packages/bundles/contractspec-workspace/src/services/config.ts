/**
 * Workspace configuration service.
 */

import * as z from 'zod';
import type { WorkspaceConfig } from '@lssm/module.contractspec-workspace';
import { DEFAULT_WORKSPACE_CONFIG } from '@lssm/module.contractspec-workspace';
import type { FsAdapter } from '../ports/fs';

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

/**
 * Load workspace configuration from .contractsrc.json.
 */
export async function loadWorkspaceConfig(
  fs: FsAdapter,
  cwd?: string
): Promise<WorkspaceConfig> {
  const configPath = fs.join(cwd ?? '.', '.contractsrc.json');

  const exists = await fs.exists(configPath);
  if (!exists) {
    return DEFAULT_WORKSPACE_CONFIG;
  }

  try {
    const content = await fs.readFile(configPath);
    const parsed = JSON.parse(content);
    return ConfigSchema.parse(parsed) as WorkspaceConfig;
  } catch {
    return DEFAULT_WORKSPACE_CONFIG;
  }
}

/**
 * Merge config with CLI options and environment variables.
 */
export function mergeWorkspaceConfig(
  config: WorkspaceConfig,
  options: {
    provider?: string;
    model?: string;
    agentMode?: string;
    endpoint?: string;
    outputDir?: string;
  }
): WorkspaceConfig {
  return {
    ...config,
    aiProvider:
      (options.provider as WorkspaceConfig['aiProvider']) ??
      (process.env[
        'CONTRACTSPEC_AI_PROVIDER'
      ] as WorkspaceConfig['aiProvider']) ??
      config.aiProvider,
    aiModel:
      options.model ?? process.env['CONTRACTSPEC_AI_MODEL'] ?? config.aiModel,
    agentMode:
      (options.agentMode as WorkspaceConfig['agentMode']) ??
      (process.env[
        'CONTRACTSPEC_AGENT_MODE'
      ] as WorkspaceConfig['agentMode']) ??
      config.agentMode,
    customEndpoint:
      options.endpoint ??
      process.env['CONTRACTSPEC_LLM_ENDPOINT'] ??
      config.customEndpoint ??
      undefined,
    customApiKey:
      process.env['CONTRACTSPEC_LLM_API_KEY'] ??
      config.customApiKey ??
      undefined,
    outputDir: options.outputDir ?? config.outputDir,
  };
}

/**
 * Get API key for the configured provider.
 */
export function getApiKey(
  provider: WorkspaceConfig['aiProvider']
): string | undefined {
  switch (provider) {
    case 'claude':
      return process.env['ANTHROPIC_API_KEY'];
    case 'openai':
      return process.env['OPENAI_API_KEY'];
    case 'custom':
      return process.env['CONTRACTSPEC_LLM_API_KEY'];
    case 'ollama':
      return undefined; // Ollama doesn't need API key for local
    default:
      return undefined;
  }
}

