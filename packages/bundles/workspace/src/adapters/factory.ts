/**
 * Factory for creating workspace adapters.
 */

import {
	DEFAULT_CONTRACTSRC,
	type ResolvedContractsrcConfig,
} from '@contractspec/lib.contracts-spec/workspace-config';
import type { WorkspaceAdapters } from '../ports/logger';
import { createNodeAiAdapter } from './ai';
import { createNodeFsAdapter } from './fs.node';
import { createNodeGitAdapter } from './git';
import { createConsoleLoggerAdapter, createNoopLoggerAdapter } from './logger';
import { createNodeWatcherAdapter } from './watcher';

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
	config?: ResolvedContractsrcConfig;

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
	const workspaceConfig = config ?? DEFAULT_CONTRACTSRC;

	return {
		fs: createNodeFsAdapter(cwd),
		git: createNodeGitAdapter(cwd),
		watcher: createNodeWatcherAdapter(cwd),
		ai: createNodeAiAdapter(workspaceConfig),
		logger: silent ? createNoopLoggerAdapter() : createConsoleLoggerAdapter(),
	};
}
