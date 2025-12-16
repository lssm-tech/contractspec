/**
 * Setup service types.
 */

/**
 * Target components that can be configured during setup.
 */
export type SetupTarget =
  | 'cli-config'
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
  'vscode-settings': 'VS Code Settings (.vscode/settings.json)',
  'mcp-cursor': 'MCP for Cursor (.cursor/mcp.json)',
  'mcp-claude': 'MCP for Claude Desktop',
  'cursor-rules': 'Cursor AI Rules (.cursor/rules/)',
  'agents-md': 'Project AI Guide (AGENTS.md)',
};

/**
 * Options for the setup service.
 */
export interface SetupOptions {
  /** Root directory of the workspace. */
  workspaceRoot: string;
  /** If true, skip prompts and use defaults. */
  interactive: boolean;
  /** Specific targets to configure (defaults to all). */
  targets: SetupTarget[];
  /** Project name (defaults to directory name). */
  projectName?: string;
  /** Default code owners. */
  defaultOwners?: string[];
}

/**
 * Result of a single file setup operation.
 */
export interface SetupFileResult {
  /** Target that was configured. */
  target: SetupTarget;
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
  /** Results for each file. */
  files: SetupFileResult[];
  /** Summary message. */
  summary: string;
}

/**
 * Callback for interactive prompts during setup.
 */
export interface SetupPromptCallbacks {
  /** Confirm an action. */
  confirm: (message: string) => Promise<boolean>;
  /** Select multiple options. */
  multiSelect: <T extends string>(
    message: string,
    options: Array<{ value: T; label: string; selected?: boolean }>
  ) => Promise<T[]>;
  /** Input a string value. */
  input: (message: string, defaultValue?: string) => Promise<string>;
}


