/**
 * Setup service.
 *
 * Orchestrates the full ContractSpec setup flow.
 * Supports both single projects and monorepos.
 */

import {
	findPackageRoot,
	findWorkspaceRoot,
	getPackageName,
	isMonorepo,
} from '../../adapters/workspace';
import type { FsAdapter } from '../../ports/fs';
import { safeParseJson } from './file-merger';
import { setupGitignore } from './gitignore';
import {
	createSetupGitignorePatterns,
	createSetupNextSteps,
	inferSetupPresetFromConfig,
	resolveSetupTargets,
} from './presets';
import {
	setupAgentsMd,
	setupBiomeConfig,
	setupCliConfig,
	setupCursorRules,
	setupMcpClaude,
	setupMcpCursor,
	setupUsageMd,
	setupVscodeSettings,
} from './targets/index';
import type {
	SetupFileResult,
	SetupOptions,
	SetupPreset,
	SetupPromptCallbacks,
	SetupResult,
	SetupScope,
	SetupTarget,
} from './types';
import {
	ALL_SETUP_PRESETS,
	ALL_SETUP_TARGETS,
	SETUP_PRESET_DESCRIPTIONS,
	SETUP_PRESET_LABELS,
	SETUP_TARGET_LABELS,
} from './types';

/**
 * Default prompt callbacks that always accept defaults.
 */
const defaultPrompts: SetupPromptCallbacks = {
	confirm: async (_msg, defaultValue) => defaultValue ?? true,
	select: async (_msg, options) => {
		return (
			options.find((option) => option.selected)?.value ??
			options[0]?.value ??
			('' as never)
		);
	},
	multiSelect: async (_msg, options) =>
		options.filter((o) => o.selected !== false).map((o) => o.value),
	input: async (_msg, defaultValue) => defaultValue ?? '',
};

interface SetupSeedConfig {
	builder?: {
		api?: { baseUrl?: string; controlPlaneTokenEnvVar?: string };
		localRuntime?: {
			runtimeId?: string;
			grantedTo?: string;
			providerIds?: string[];
		};
	};
	connect?: {
		studio?: {
			endpoint?: string;
			queue?: string;
		};
	};
}

/**
 * Run the ContractSpec setup.
 */
export async function runSetup(
	fs: FsAdapter,
	options: SetupOptions,
	prompts: SetupPromptCallbacks = defaultPrompts
): Promise<SetupResult> {
	const results: SetupFileResult[] = [];
	const targets =
		options.targets.length > 0 ? options.targets : ALL_SETUP_TARGETS;

	// Detect monorepo context if not already provided
	const workspaceRoot = options.workspaceRoot;
	const detectedWorkspaceRoot = findWorkspaceRoot(workspaceRoot);
	const packageRoot = options.packageRoot ?? findPackageRoot(workspaceRoot);
	const monorepo = options.isMonorepo ?? isMonorepo(detectedWorkspaceRoot);
	const packageName =
		options.packageName ?? (monorepo ? getPackageName(packageRoot) : undefined);
	const initialPresetConfig = await readSetupConfig(fs, [
		packageRoot,
		detectedWorkspaceRoot,
	]);
	let preset =
		options.preset ?? inferSetupPresetFromConfig(initialPresetConfig);

	// Determine preset before any other interactive step.
	if (options.interactive && !options.preset) {
		preset = await prompts.select<SetupPreset>(
			'Select initialization preset:',
			ALL_SETUP_PRESETS.map((value) => ({
				value,
				label: SETUP_PRESET_LABELS[value],
				description: SETUP_PRESET_DESCRIPTIONS[value],
				selected: value === preset,
			}))
		);
	}

	// Determine scope
	let scope: SetupScope = options.scope ?? 'workspace';
	const isDifferentRoots = packageRoot !== detectedWorkspaceRoot;

	// If in a monorepo and interactive, prompt for scope
	if (monorepo && options.interactive && isDifferentRoots) {
		scope = await prompts.select<SetupScope>(
			`Monorepo detected. Configure at which level?`,
			[
				{
					value: 'package',
					label: `Package level (${packageName ?? packageRoot})`,
					description: 'Create config files in the current package',
					selected: true,
				},
				{
					value: 'workspace',
					label: `Workspace level (${detectedWorkspaceRoot})`,
					description: 'Create config files at the workspace root',
				},
			]
		);
	}

	const targetRoot =
		monorepo && scope === 'package' ? packageRoot : detectedWorkspaceRoot;
	const scopeConfig = await readSetupConfig(fs, [targetRoot]);
	const seededOptions: SetupOptions = {
		...options,
		workspaceRoot: detectedWorkspaceRoot,
		packageRoot,
		isMonorepo: monorepo,
		scope,
		packageName,
		preset,
		builderApiBaseUrl:
			options.builderApiBaseUrl ?? scopeConfig?.builder?.api?.baseUrl,
		builderControlPlaneTokenEnvVar:
			options.builderControlPlaneTokenEnvVar ??
			scopeConfig?.builder?.api?.controlPlaneTokenEnvVar,
		builderLocalRuntimeId:
			options.builderLocalRuntimeId ??
			scopeConfig?.builder?.localRuntime?.runtimeId,
		builderLocalGrantedTo:
			options.builderLocalGrantedTo ??
			scopeConfig?.builder?.localRuntime?.grantedTo,
		builderLocalProviderIds:
			options.builderLocalProviderIds ??
			scopeConfig?.builder?.localRuntime?.providerIds,
		connectStudioEndpoint:
			options.connectStudioEndpoint ?? scopeConfig?.connect?.studio?.endpoint,
		connectStudioQueue:
			options.connectStudioQueue ?? scopeConfig?.connect?.studio?.queue,
	};

	// If interactive, prompt for target selection
	let selectedTargets = resolveSetupTargets(preset, targets);
	if (options.interactive) {
		selectedTargets = await prompts.multiSelect(
			'Select components to configure:',
			ALL_SETUP_TARGETS.map((t) => ({
				value: t,
				label: SETUP_TARGET_LABELS[t],
				selected: selectedTargets.includes(t),
			}))
		);
	}

	// Get project name if interactive
	let projectName = seededOptions.projectName;
	if (options.interactive && !projectName) {
		const defaultName =
			scope === 'package' && packageName
				? packageName
				: (targetRoot.split('/').pop() ?? 'my-project');
		projectName = await prompts.input('Project name:', defaultName);
	}

	let builderApiBaseUrl = seededOptions.builderApiBaseUrl;
	if (options.interactive && preset.startsWith('builder-')) {
		builderApiBaseUrl = await prompts.input(
			'Builder API base URL:',
			builderApiBaseUrl ?? 'https://api.contractspec.io'
		);
	}

	let builderLocalRuntimeId = seededOptions.builderLocalRuntimeId;
	let builderLocalGrantedTo = seededOptions.builderLocalGrantedTo;
	if (
		options.interactive &&
		(preset === 'builder-local' || preset === 'builder-hybrid')
	) {
		builderLocalRuntimeId = await prompts.input(
			'Default local runtime target id:',
			builderLocalRuntimeId ?? 'rt_local_daemon'
		);
		builderLocalGrantedTo = await prompts.input(
			'Default local runtime grant target:',
			builderLocalGrantedTo ?? 'local:operator'
		);
	}

	const setupOptions: SetupOptions = {
		...seededOptions,
		projectName,
		targets: selectedTargets,
		builderApiBaseUrl,
		builderLocalRuntimeId,
		builderLocalGrantedTo,
	};

	// Run each target setup
	for (const target of selectedTargets) {
		const result = await setupTarget(fs, target, setupOptions, prompts);
		results.push(result);
	}

	const gitignoreResult = await setupGitignore(fs, {
		behavior: setupOptions.gitignoreBehavior,
		interactive: setupOptions.interactive,
		patterns: createSetupGitignorePatterns({ preset }),
		prompts,
		root: detectedWorkspaceRoot,
	});
	if (
		setupOptions.gitignoreBehavior !== 'skip' ||
		gitignoreResult.action !== 'skipped'
	) {
		results.push(gitignoreResult);
	}

	const succeeded = results.filter((r) => r.action !== 'error').length;
	const failed = results.filter((r) => r.action === 'error').length;

	const scopeInfo = monorepo ? ` (${scope} level)` : '';
	return {
		success: failed === 0,
		preset,
		files: results,
		summary: `Setup complete${scopeInfo}: ${succeeded} configured, ${failed} failed.`,
		nextSteps: createSetupNextSteps(setupOptions),
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
		case 'agents-md':
			return setupAgentsMd(fs, options, prompts);
		case 'cli-config':
			return setupCliConfig(fs, options, prompts);
		case 'biome-config':
			return setupBiomeConfig(fs, options, prompts);
		case 'vscode-settings':
			return setupVscodeSettings(fs, options, prompts);
		case 'mcp-cursor':
			return setupMcpCursor(fs, options, prompts);
		case 'mcp-claude':
			return setupMcpClaude(fs, options, prompts);
		case 'cursor-rules':
			return setupCursorRules(fs, options, prompts);
		case 'usage-md':
			return setupUsageMd(fs, options, prompts);
		default:
			return {
				target,
				filePath: '',
				action: 'error',
				message: `Unknown target: ${target}`,
			};
	}
}

async function readSetupConfig(
	fs: FsAdapter,
	roots: string[]
): Promise<SetupSeedConfig | null> {
	for (const root of roots) {
		const configPath = fs.join(root, '.contractsrc.json');
		if (!(await fs.exists(configPath))) {
			continue;
		}

		const parsed = safeParseJson<SetupSeedConfig>(
			await fs.readFile(configPath)
		);
		if (parsed) {
			return parsed;
		}
	}

	return null;
}
