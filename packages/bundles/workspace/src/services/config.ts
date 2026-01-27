/**
 * Workspace configuration service.
 */

import * as z from 'zod';
import type { WorkspaceConfig } from '@contractspec/module.workspace';
import { DEFAULT_WORKSPACE_CONFIG } from '@contractspec/module.workspace';
import type { FsAdapter } from '../ports/fs';

const ConfigSchema = z.object({
  aiProvider: z
    .enum(['claude', 'openai', 'ollama', 'custom'])
    .default('claude'),
  aiModel: z.string().optional(),
  agentMode: z
    .enum([
      'simple',
      'cursor',
      'claude-code',
      'openai-codex',
      'opencode',
      'opencode-sdk',
    ])
    .default('simple'),
  customEndpoint: z.url().nullable().optional(),
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
    const resolved = ConfigSchema.parse(parsed) as Omit<
      WorkspaceConfig,
      'agentMode'
    > & {
      agentMode?: WorkspaceConfig['agentMode'] | 'opencode';
    };

    return {
      ...resolved,
      agentMode:
        resolved.agentMode === 'opencode' ? 'opencode-sdk' : resolved.agentMode,
    } as WorkspaceConfig;
  } catch {
    return DEFAULT_WORKSPACE_CONFIG;
  }
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
