/**
 * Setup service.
 *
 * Orchestrates the full ContractSpec setup flow.
 */

import type { FsAdapter } from '../../ports/fs';
import type {
  SetupOptions,
  SetupResult,
  SetupFileResult,
  SetupTarget,
  SetupPromptCallbacks,
} from './types';
import { ALL_SETUP_TARGETS, SETUP_TARGET_LABELS } from './types';
import {
  setupCliConfig,
  setupVscodeSettings,
  setupMcpCursor,
  setupMcpClaude,
  setupCursorRules,
  setupAgentsMd,
} from './targets/index';

/**
 * Default prompt callbacks that always accept defaults.
 */
const defaultPrompts: SetupPromptCallbacks = {
  confirm: async () => true,
  multiSelect: async (_msg, options) =>
    options.filter((o) => o.selected !== false).map((o) => o.value),
  input: async (_msg, defaultValue) => defaultValue ?? '',
};

/**
 * Run the ContractSpec setup.
 */
export async function runSetup(
  fs: FsAdapter,
  options: SetupOptions,
  prompts: SetupPromptCallbacks = defaultPrompts
): Promise<SetupResult> {
  const results: SetupFileResult[] = [];
  const targets = options.targets.length > 0 ? options.targets : ALL_SETUP_TARGETS;

  // If interactive, prompt for target selection
  let selectedTargets = targets;
  if (options.interactive) {
    selectedTargets = await prompts.multiSelect(
      'Select components to configure:',
      ALL_SETUP_TARGETS.map((t) => ({
        value: t,
        label: SETUP_TARGET_LABELS[t],
        selected: targets.includes(t),
      }))
    );
  }

  // Get project name if interactive
  let projectName = options.projectName;
  if (options.interactive && !projectName) {
    const dirName = options.workspaceRoot.split('/').pop() ?? 'my-project';
    projectName = await prompts.input('Project name:', dirName);
  }

  const setupOptions: SetupOptions = {
    ...options,
    projectName,
    targets: selectedTargets,
  };

  // Run each target setup
  for (const target of selectedTargets) {
    const result = await setupTarget(fs, target, setupOptions, prompts);
    results.push(result);
  }

  const succeeded = results.filter((r) => r.action !== 'error').length;
  const failed = results.filter((r) => r.action === 'error').length;

  return {
    success: failed === 0,
    files: results,
    summary: `Setup complete: ${succeeded} configured, ${failed} failed.`,
  };
}

/**
 * Setup a single target.
 */
async function setupTarget(
  fs: FsAdapter,
  target: SetupTarget,
  options: SetupOptions,
  prompts: SetupPromptCallbacks
): Promise<SetupFileResult> {
  switch (target) {
    case 'cli-config':
      return setupCliConfig(fs, options, prompts);
    case 'vscode-settings':
      return setupVscodeSettings(fs, options, prompts);
    case 'mcp-cursor':
      return setupMcpCursor(fs, options, prompts);
    case 'mcp-claude':
      return setupMcpClaude(fs, options, prompts);
    case 'cursor-rules':
      return setupCursorRules(fs, options, prompts);
    case 'agents-md':
      return setupAgentsMd(fs, options, prompts);
    default:
      return {
        target,
        filePath: '',
        action: 'error',
        message: `Unknown target: ${target}`,
      };
  }
}
