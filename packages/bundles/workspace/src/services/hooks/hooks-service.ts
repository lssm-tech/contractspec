/**
 * Hooks service.
 *
 * Runs git hook checks configured in .contractsrc.json.
 * This service is platform-agnostic and can be used by CLI, VSCode, or other apps.
 *
 * @module services/hooks
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import type { FsAdapter } from '../../ports/fs';
import type { LoggerAdapter } from '../../ports/logger';
import { findWorkspaceRoot } from '../../adapters/workspace';
import type {
  HookRunOptions,
  HookRunResult,
  HookCommandResult,
  HooksConfig,
} from './types';

const execAsync = promisify(exec);

// ─────────────────────────────────────────────────────────────────────────────
// Adapters Type
// ─────────────────────────────────────────────────────────────────────────────

interface ServiceAdapters {
  fs: FsAdapter;
  logger: LoggerAdapter;
}

// ─────────────────────────────────────────────────────────────────────────────
// Run Hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a configured git hook.
 *
 * Note: Uses node:child_process for compatibility with VSCode (Node.js) and CLI (Bun).
 * Although Bun shell ($) is preferred for scripts, this shared bundle must support both runtimes.
 */
export async function runHook(
  adapters: ServiceAdapters,
  options: HookRunOptions
): Promise<HookRunResult> {
  const { fs, logger } = adapters;
  const { hookName, dryRun = false } = options;
  const workspaceRoot = findWorkspaceRoot(options.workspaceRoot);

  logger.info(`Running hook: ${hookName}`, { workspaceRoot, dryRun });

  // Load hooks config
  const hooksConfig = await loadHooksConfig(fs, workspaceRoot);

  if (!hooksConfig) {
    return {
      hookName,
      success: false,
      commandResults: [],
      totalCommands: 0,
      successfulCommands: 0,
      summary: 'No hooks configuration found in .contractsrc.json',
    };
  }

  const commands = hooksConfig[hookName];

  if (!commands || commands.length === 0) {
    return {
      hookName,
      success: true,
      commandResults: [],
      totalCommands: 0,
      successfulCommands: 0,
      summary: `No commands configured for hook: ${hookName}`,
    };
  }

  logger.info(`Found ${commands.length} command(s) for ${hookName}`);

  const commandResults: HookCommandResult[] = [];
  let allSuccess = true;

  for (const command of commands) {
    if (dryRun) {
      logger.info(`[DRY RUN] Would execute: ${command}`);
      commandResults.push({
        command,
        success: true,
        exitCode: 0,
        stdout: '',
        stderr: '',
      });
      continue;
    }

    logger.info(`Executing: ${command}`);

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: workspaceRoot,
        timeout: 300_000, // 5 minute timeout
      });

      commandResults.push({
        command,
        success: true,
        exitCode: 0,
        stdout,
        stderr,
      });

      logger.info(`✓ ${command}`);
    } catch (error) {
      allSuccess = false;

      const execError = error as {
        code?: number;
        stdout?: string;
        stderr?: string;
        message?: string;
      };

      commandResults.push({
        command,
        success: false,
        exitCode: execError.code ?? 1,
        stdout: execError.stdout ?? '',
        stderr: execError.stderr ?? execError.message ?? String(error),
      });

      logger.error(`✗ ${command}`, {
        exitCode: execError.code,
        stderr: execError.stderr,
      });

      // Stop on first failure
      break;
    }
  }

  const successfulCommands = commandResults.filter((r) => r.success).length;

  return {
    hookName,
    success: allSuccess,
    commandResults,
    totalCommands: commands.length,
    successfulCommands,
    summary: allSuccess
      ? `✓ All ${commands.length} command(s) passed`
      : `✗ ${successfulCommands}/${commands.length} command(s) passed`,
  };
}

/**
 * Get available hooks from configuration.
 */
export async function getAvailableHooks(
  adapters: ServiceAdapters,
  workspaceRoot: string
): Promise<string[]> {
  const hooksConfig = await loadHooksConfig(adapters.fs, workspaceRoot);
  return hooksConfig ? Object.keys(hooksConfig) : [];
}

/**
 * Load hooks configuration from .contractsrc.json.
 */
async function loadHooksConfig(
  fs: FsAdapter,
  workspaceRoot: string
): Promise<HooksConfig | null> {
  const configPath = fs.join(workspaceRoot, '.contractsrc.json');

  if (!(await fs.exists(configPath))) {
    return null;
  }

  try {
    const content = await fs.readFile(configPath);
    const config = JSON.parse(content) as { hooks?: HooksConfig };
    return config.hooks ?? null;
  } catch {
    return null;
  }
}
