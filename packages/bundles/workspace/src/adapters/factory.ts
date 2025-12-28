/**
 * Factory for creating workspace adapters.
 */

import type { WorkspaceConfig } from '@contractspec/module.workspace';
import type { WorkspaceAdapters } from '../ports/logger';
import { createNodeFsAdapter } from './fs';
import { createNodeGitAdapter } from './git';
import { createNodeWatcherAdapter } from './watcher';
import { createNodeAiAdapter } from './ai';
import { createConsoleLoggerAdapter, createNoopLoggerAdapter } from './logger';

/**
 * Options for creating adapters.
 */
export interface CreateAdaptersOptions {
  /**
   * Working directory for file operations.
   */
  cwd?: string;

  /**
   * Workspace configuration for AI.
   */
  config?: WorkspaceConfig;

  /**
   * Use no-op logger (for testing).
   */
  silent?: boolean;
}

/**
 * Create all Node.js adapters with default configuration.
 */
export function createNodeAdapters(
  options: CreateAdaptersOptions = {}
): WorkspaceAdapters {
  const { cwd, config, silent } = options;

  // Use default config if not provided
  const workspaceConfig: WorkspaceConfig = config ?? {
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

  return {
    fs: createNodeFsAdapter(cwd),
    git: createNodeGitAdapter(cwd),
    watcher: createNodeWatcherAdapter(cwd),
    ai: createNodeAiAdapter(workspaceConfig),
    logger: silent ? createNoopLoggerAdapter() : createConsoleLoggerAdapter(),
  };
}
