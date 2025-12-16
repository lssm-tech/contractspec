/**
 * Setup service.
 *
 * Orchestrates the full ContractSpec setup flow.
 * Supports both single projects and monorepos.
 */

import type { FsAdapter } from '../../ports/fs';
import type {
  SetupOptions,
  SetupResult,
  SetupFileResult,
  SetupTarget,
  SetupPromptCallbacks,
  SetupScope,
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
import {
  findPackageRoot,
  findWorkspaceRoot,
  isMonorepo,
  getPackageName,
} from '../../adapters/workspace';

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

  // Detect monorepo context if not already provided
  const workspaceRoot = options.workspaceRoot;
  const detectedWorkspaceRoot = findWorkspaceRoot(workspaceRoot);
  const packageRoot = options.packageRoot ?? findPackageRoot(workspaceRoot);
  const monorepo = options.isMonorepo ?? isMonorepo(detectedWorkspaceRoot);
  const packageName = options.packageName ?? (monorepo ? getPackageName(packageRoot) : undefined);

  // Determine scope
  let scope: SetupScope = options.scope ?? 'workspace';
  const isDifferentRoots = packageRoot !== detectedWorkspaceRoot;

  // If in a monorepo and interactive, prompt for scope
  if (monorepo && options.interactive && isDifferentRoots) {
    const scopeChoice = await prompts.multiSelect<SetupScope>(
      `Monorepo detected. Configure at which level?`,
      [
        { value: 'package', label: `Package level (${packageName ?? packageRoot})`, selected: true },
        { value: 'workspace', label: `Workspace level (${detectedWorkspaceRoot})` },
      ]
    );
    scope = scopeChoice[0] ?? 'package';
  }

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
    const defaultName = scope === 'package' && packageName
      ? packageName
      : workspaceRoot.split('/').pop() ?? 'my-project';
    projectName = await prompts.input('Project name:', defaultName);
  }

  const setupOptions: SetupOptions = {
    ...options,
    workspaceRoot: detectedWorkspaceRoot,
    packageRoot,
    isMonorepo: monorepo,
    scope,
    packageName,
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

  const scopeInfo = monorepo ? ` (${scope} level)` : '';
  return {
    success: failed === 0,
    files: results,
    summary: `Setup complete${scopeInfo}: ${succeeded} configured, ${failed} failed.`,
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
