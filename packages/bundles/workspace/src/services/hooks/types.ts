/**
 * Hooks service types.
 *
 * Types for running git hook checks configured in .contractsrc.json.
 */

/**
 * Options for running hooks.
 */
export interface HookRunOptions {
  /** Name of the hook to run (e.g., 'pre-commit'). */
  hookName: string;
  /** Workspace root directory. */
  workspaceRoot: string;
  /** If true, show commands without executing. */
  dryRun?: boolean;
}

/**
 * Result of a single command execution.
 */
export interface HookCommandResult {
  /** The command that was executed. */
  command: string;
  /** Whether the command succeeded. */
  success: boolean;
  /** Exit code. */
  exitCode: number;
  /** stdout output. */
  stdout: string;
  /** stderr output. */
  stderr: string;
}

/**
 * Result of running a hook.
 */
export interface HookRunResult {
  /** Hook name that was run. */
  hookName: string;
  /** Whether all commands succeeded. */
  success: boolean;
  /** Results for each command. */
  commandResults: HookCommandResult[];
  /** Total commands executed. */
  totalCommands: number;
  /** Number of successful commands. */
  successfulCommands: number;
  /** Summary message. */
  summary: string;
}

/**
 * Hooks configuration from .contractsrc.json.
 */
export type HooksConfig = Record<string, string[]>;
