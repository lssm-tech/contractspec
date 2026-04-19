/**
 * Setup service types.
 */

/**
 * Target components that can be configured during setup.
 */
export type SetupTarget =
	| 'cli-config'
	| 'biome-config'
	| 'vscode-settings'
	| 'mcp-cursor'
	| 'mcp-claude'
	| 'cursor-rules'
	| 'agents-md';

/**
 * All available setup targets.
 */
export const ALL_SETUP_TARGETS: SetupTarget[] = [
	'cli-config',
	'biome-config',
	'vscode-settings',
	'mcp-cursor',
	'mcp-claude',
	'cursor-rules',
	'agents-md',
];

/**
 * Human-readable labels for setup targets.
 */
export const SETUP_TARGET_LABELS: Record<SetupTarget, string> = {
	'cli-config': 'CLI Configuration (.contractsrc.json)',
	'biome-config': 'Biome Configuration (biome.jsonc + plugins)',
	'vscode-settings': 'VS Code Settings (.vscode/settings.json)',
	'mcp-cursor': 'MCP for Cursor (.cursor/mcp.json)',
	'mcp-claude': 'MCP for Claude Desktop',
	'cursor-rules': 'Cursor AI Rules (.cursor/rules/)',
	'agents-md': 'AI Agent Guide (AGENTS.md)',
};

export type SetupPreset =
	| 'core'
	| 'connect'
	| 'builder-managed'
	| 'builder-local'
	| 'builder-hybrid';

export const ALL_SETUP_PRESETS: SetupPreset[] = [
	'core',
	'connect',
	'builder-managed',
	'builder-local',
	'builder-hybrid',
];

export const SETUP_PRESET_LABELS: Record<SetupPreset, string> = {
	core: 'Core workspace setup',
	connect: 'Connect-enabled setup',
	'builder-managed': 'Builder setup (managed runtime)',
	'builder-local': 'Builder setup (local runtime)',
	'builder-hybrid': 'Builder setup (hybrid runtime)',
};

export const SETUP_PRESET_DESCRIPTIONS: Record<SetupPreset, string> = {
	core: 'Generic ContractSpec workspace files and editor wiring.',
	connect:
		'Core workspace setup plus Connect config, artifact storage, and adapter defaults.',
	'builder-managed':
		'Core workspace setup plus Builder config for managed runtime and API-based next steps.',
	'builder-local':
		'Core workspace setup plus Builder config for local runtime registration and control-plane-backed next steps.',
	'builder-hybrid':
		'Core workspace setup plus Builder config for hybrid runtime with API and local defaults.',
};

export type SetupGitignoreBehavior = 'auto' | 'force' | 'skip';

/**
 * Scope of configuration in a monorepo.
 */
export type SetupScope = 'workspace' | 'package';

/**
 * Options for the setup service.
 */
export interface SetupOptions {
	/** Root directory of the workspace (monorepo root or single project root). */
	workspaceRoot: string;
	/** Current package root (may differ from workspaceRoot in monorepos). */
	packageRoot?: string;
	/** Whether this is a monorepo. */
	isMonorepo?: boolean;
	/** Where to create config: workspace level or package level. */
	scope?: SetupScope;
	/** Current package name (if in a monorepo package). */
	packageName?: string;
	/** If true, skip prompts and use defaults. */
	interactive: boolean;
	/** High-level onboarding preset. */
	preset?: SetupPreset;
	/** Specific targets to configure (defaults to all). */
	targets: SetupTarget[];
	/** Project name (defaults to directory name). */
	projectName?: string;
	/** Default code owners. */
	defaultOwners?: string[];
	/** Builder API base URL for Builder presets. */
	builderApiBaseUrl?: string;
	/** Builder control-plane token environment variable name. */
	builderControlPlaneTokenEnvVar?: string;
	/** Builder local runtime target id for local or hybrid presets. */
	builderLocalRuntimeId?: string;
	/** Builder local runtime lease/grant target for local or hybrid presets. */
	builderLocalGrantedTo?: string;
	/** Builder local-capable providers for local or hybrid presets. */
	builderLocalProviderIds?: string[];
	/** Optional Connect Studio bridge endpoint. */
	connectStudioEndpoint?: string;
	/** Optional Connect Studio bridge queue. */
	connectStudioQueue?: string;
	/** How init should handle recommended ContractSpec .gitignore entries. */
	gitignoreBehavior?: SetupGitignoreBehavior;
}

/**
 * Result of a single file setup operation.
 */
export interface SetupFileResult {
	/** Target that was configured. */
	target: SetupTarget | 'gitignore';
	/** File path that was created or modified. */
	filePath: string;
	/** Action taken. */
	action: 'created' | 'merged' | 'skipped' | 'error';
	/** Message describing what happened. */
	message: string;
}

/**
 * Full result of the setup operation.
 */
export interface SetupResult {
	/** Whether all operations succeeded. */
	success: boolean;
	/** Final resolved setup preset. */
	preset: SetupPreset;
	/** Results for each file. */
	files: SetupFileResult[];
	/** Summary message. */
	summary: string;
	/** Tailored follow-up commands for the selected preset. */
	nextSteps: string[];
}

/**
 * Callback for interactive prompts during setup.
 */
export interface SetupPromptCallbacks {
	/** Confirm an action. */
	confirm: (message: string, defaultValue?: boolean) => Promise<boolean>;
	/** Select a single option. */
	select: <T extends string>(
		message: string,
		options: {
			value: T;
			label: string;
			description?: string;
			selected?: boolean;
		}[]
	) => Promise<T>;
	/** Select multiple options. */
	multiSelect: <T extends string>(
		message: string,
		options: { value: T; label: string; selected?: boolean }[]
	) => Promise<T[]>;
	/** Input a string value. */
	input: (message: string, defaultValue?: string) => Promise<string>;
}
