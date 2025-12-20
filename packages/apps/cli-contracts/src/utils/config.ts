import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import {
  detectPackageManager,
  findPackageRoot,
  findWorkspaceRoot,
  isMonorepo as checkIsMonorepo,
  type PackageManager,
} from '@lssm/bundle.contractspec-workspace';
import {
  type ContractsrcConfig,
  ContractsrcSchema,
  DEFAULT_CONTRACTSRC,
  type FolderConventions,
  type OpenApiConfig,
  type OpenApiSource,
} from '@lssm/lib.contracts';

// Re-export types for convenience
export type { OpenApiSource, OpenApiConfig, FolderConventions };
export type Config = ContractsrcConfig;

/**
 * Configuration with workspace context.
 */
export interface ConfigWithWorkspace extends Config {
  /**
   * Detected package manager.
   */
  packageManager: PackageManager;

  /**
   * Workspace root (monorepo root or package root).
   */
  workspaceRoot: string;

  /**
   * Current package root.
   */
  packageRoot: string;

  /**
   * Whether this is a monorepo.
   */
  isMonorepo: boolean;
}

/**
 * Load configuration from .contractsrc.json with monorepo support.
 *
 * Searches for config in the following order:
 * 1. Package root (.contractsrc.json in the nearest package.json directory)
 * 2. Workspace root (.contractsrc.json in the workspace/monorepo root)
 *
 * Package config is merged on top of workspace config.
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<Config> {
  const packageRoot = findPackageRoot(cwd);
  const workspaceRoot = findWorkspaceRoot(cwd);

  // Try to load workspace config first (as base)
  let config = { ...DEFAULT_CONTRACTSRC };

  if (workspaceRoot !== packageRoot) {
    const workspaceConfigPath = join(workspaceRoot, '.contractsrc.json');
    if (existsSync(workspaceConfigPath)) {
      try {
        const content = await readFile(workspaceConfigPath, 'utf-8');
        const parsed = JSON.parse(content);
        const validated = ContractsrcSchema.safeParse(parsed);
        if (validated.success) {
          config = { ...config, ...validated.data };
        }
      } catch {
        // Ignore parse errors for workspace config
      }
    }
  }

  // Load package config (overrides workspace config)
  const packageConfigPath = join(packageRoot, '.contractsrc.json');
  if (existsSync(packageConfigPath)) {
    try {
      const content = await readFile(packageConfigPath, 'utf-8');
      const parsed = JSON.parse(content);
      const validated = ContractsrcSchema.safeParse(parsed);
      if (validated.success) {
        config = { ...config, ...validated.data };
      }
    } catch (error) {
      console.warn(
        `Warning: Could not parse .contractsrc.json, using defaults. Error: ${error}`
      );
    }
  }

  return config;
}

/**
 * Load configuration with workspace context.
 */
export async function loadConfigWithWorkspace(
  cwd: string = process.cwd()
): Promise<ConfigWithWorkspace> {
  const config = await loadConfig(cwd);
  const packageRoot = findPackageRoot(cwd);
  const workspaceRoot = findWorkspaceRoot(cwd);
  const packageManager = detectPackageManager(workspaceRoot);
  const isMonorepo = checkIsMonorepo(workspaceRoot);

  return {
    ...config,
    packageManager,
    workspaceRoot,
    packageRoot,
    isMonorepo,
  };
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
