/**
 * Workspace configuration service.
 */

import type { FsAdapter } from '../ports/fs';
import {
  ContractsrcSchema,
  DEFAULT_CONTRACTSRC,
  type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts/workspace-config';

/**
 * Load workspace configuration from .contractsrc.json.
 */
export async function loadWorkspaceConfig(
  fs: FsAdapter,
  cwd?: string
): Promise<ResolvedContractsrcConfig> {
  const configPath = fs.join(cwd ?? '.', '.contractsrc.json');

  const exists = await fs.exists(configPath);
  if (!exists) {
    return DEFAULT_CONTRACTSRC;
  }

  try {
    const content = await fs.readFile(configPath);
    const parsed = JSON.parse(content);
    const resolved = ContractsrcSchema.safeParse(parsed);

    return {
      ...DEFAULT_CONTRACTSRC,
      ...resolved.data,
      conventions: {
        ...DEFAULT_CONTRACTSRC.conventions,
        ...(resolved.data?.conventions || {}),
      },
    };
  } catch {
    return DEFAULT_CONTRACTSRC;
  }
}

/**
 * Get API key for the configured provider.
 */
export function getApiKey(
  provider: ResolvedContractsrcConfig['aiProvider']
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
