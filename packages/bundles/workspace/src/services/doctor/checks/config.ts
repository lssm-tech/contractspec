/**
 * Configuration file health checks.
 */

import type { FsAdapter } from '../../../ports/fs';
import { loadWorkspaceConfig } from '../../config';
import {
	generateContractsrcConfig,
	generateVscodeSettings,
} from '../../setup/config-generators';
import { formatJson, safeParseJson } from '../../setup/file-merger';
import { inferSetupPresetFromConfig } from '../../setup/presets';
import type { CheckContext, CheckResult, FixResult } from '../types';

/**
 * Run configuration-related health checks.
 */
export async function runConfigChecks(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult[]> {
	const results: CheckResult[] = [];

	// Check if .contractsrc.json exists
	results.push(await checkContractsrcExists(fs, ctx));

	// Check if .contractsrc.json is valid
	results.push(await checkContractsrcValid(fs, ctx));

	// Check required fields in config
	results.push(await checkContractsrcFields(fs, ctx));

	// Check versioning configuration
	results.push(await checkVersioningConfig(fs, ctx));

	// Check hooks configuration
	results.push(await checkHooksConfig(fs, ctx));
	results.push(await checkPresetConfiguration(fs, ctx));
	results.push(await checkBuilderVscodeMirror(fs, ctx));

	return results;
}

async function resolveConfigRoot(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<string> {
	if (
		ctx.packageRoot &&
		ctx.packageRoot !== ctx.workspaceRoot &&
		(await fs.exists(fs.join(ctx.packageRoot, '.contractsrc.json')))
	) {
		return ctx.packageRoot;
	}

	return ctx.workspaceRoot;
}

/**
 * Check if .contractsrc.json exists.
 */
async function checkContractsrcExists(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult> {
	const configPath = fs.join(
		await resolveConfigRoot(fs, ctx),
		'.contractsrc.json'
	);

	const exists = await fs.exists(configPath);
	if (exists) {
		return {
			category: 'config',
			name: 'Config File Exists',
			status: 'pass',
			message: '.contractsrc.json found',
		};
	}

	return {
		category: 'config',
		name: 'Config File Exists',
		status: 'fail',
		message: '.contractsrc.json not found',
		fix: {
			description: 'Create .contractsrc.json with defaults',
			apply: async (): Promise<FixResult> => {
				try {
					const defaults = generateContractsrcConfig({
						workspaceRoot: ctx.workspaceRoot,
						interactive: false,
						targets: [],
					});
					await fs.writeFile(configPath, formatJson(defaults));
					return { success: true, message: 'Created .contractsrc.json' };
				} catch (error) {
					const msg = error instanceof Error ? error.message : String(error);
					return { success: false, message: `Failed to create: ${msg}` };
				}
			},
		},
	};
}

/**
 * Check if .contractsrc.json is valid JSON.
 */
async function checkContractsrcValid(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult> {
	const configPath = fs.join(
		await resolveConfigRoot(fs, ctx),
		'.contractsrc.json'
	);

	const exists = await fs.exists(configPath);
	if (!exists) {
		return {
			category: 'config',
			name: 'Config Valid JSON',
			status: 'skip',
			message: 'Config file does not exist',
		};
	}

	try {
		const content = await fs.readFile(configPath);
		JSON.parse(content);

		return {
			category: 'config',
			name: 'Config Valid JSON',
			status: 'pass',
			message: '.contractsrc.json is valid JSON',
		};
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);

		return {
			category: 'config',
			name: 'Config Valid JSON',
			status: 'fail',
			message: '.contractsrc.json is not valid JSON',
			details: msg,
			fix: {
				description: 'Replace with valid default config',
				apply: async (): Promise<FixResult> => {
					try {
						const defaults = generateContractsrcConfig({
							workspaceRoot: ctx.workspaceRoot,
							interactive: false,
							targets: [],
						});
						await fs.writeFile(configPath, formatJson(defaults));
						return { success: true, message: 'Replaced with valid config' };
					} catch (err) {
						const m = err instanceof Error ? err.message : String(err);
						return { success: false, message: `Failed: ${m}` };
					}
				},
			},
		};
	}
}

/**
 * Check required fields in .contractsrc.json.
 */
async function checkContractsrcFields(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult> {
	const configPath = fs.join(
		await resolveConfigRoot(fs, ctx),
		'.contractsrc.json'
	);

	const exists = await fs.exists(configPath);
	if (!exists) {
		return {
			category: 'config',
			name: 'Config Fields',
			status: 'skip',
			message: 'Config file does not exist',
		};
	}

	try {
		const content = await fs.readFile(configPath);
		const config = JSON.parse(content) as Record<string, unknown>;

		const missingFields: string[] = [];

		// Check for recommended fields
		if (!config['outputDir']) {
			missingFields.push('outputDir');
		}
		if (!config['conventions']) {
			missingFields.push('conventions');
		}

		if (missingFields.length === 0) {
			return {
				category: 'config',
				name: 'Config Fields',
				status: 'pass',
				message: 'All recommended fields present',
			};
		}

		return {
			category: 'config',
			name: 'Config Fields',
			status: 'warn',
			message: `Missing recommended fields: ${missingFields.join(', ')}`,
			fix: {
				description: 'Add missing fields with defaults',
				apply: async (): Promise<FixResult> => {
					try {
						const defaults = generateContractsrcConfig({
							workspaceRoot: ctx.workspaceRoot,
							interactive: false,
							targets: [],
						}) as Record<string, unknown>;

						// Merge missing fields
						for (const field of missingFields) {
							if (defaults[field] !== undefined) {
								config[field] = defaults[field];
							}
						}

						await fs.writeFile(configPath, formatJson(config));
						return { success: true, message: 'Added missing fields' };
					} catch (err) {
						const m = err instanceof Error ? err.message : String(err);
						return { success: false, message: `Failed: ${m}` };
					}
				},
			},
		};
	} catch {
		return {
			category: 'config',
			name: 'Config Fields',
			status: 'skip',
			message: 'Could not parse config',
		};
	}
}

/**
 * Check if versioning configuration is present.
 */
async function checkVersioningConfig(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult> {
	const configPath = fs.join(
		await resolveConfigRoot(fs, ctx),
		'.contractsrc.json'
	);

	const exists = await fs.exists(configPath);
	if (!exists) {
		return {
			category: 'config',
			name: 'Versioning Config',
			status: 'skip',
			message: 'Config file does not exist',
		};
	}

	try {
		const content = await fs.readFile(configPath);
		const config = JSON.parse(content) as Record<string, unknown>;

		if (config['versioning']) {
			const versioning = config['versioning'] as Record<string, unknown>;
			const hasChangesets = versioning['integrateWithChangesets'] === true;

			return {
				category: 'config',
				name: 'Versioning Config',
				status: 'pass',
				message: hasChangesets
					? 'Versioning configured with Changesets integration'
					: 'Versioning configured',
			};
		}

		return {
			category: 'config',
			name: 'Versioning Config',
			status: 'warn',
			message: 'Versioning configuration not found',
			details:
				'Consider adding versioning config for automated version bumps and changelog generation',
			fix: {
				description: 'Add versioning configuration with defaults',
				apply: async (): Promise<FixResult> => {
					try {
						config['versioning'] = {
							autoBump: false,
							bumpStrategy: 'impact',
							changelogTiers: ['spec', 'library', 'monorepo'],
							format: 'keep-a-changelog',
							commitChanges: false,
							createTags: false,
							integrateWithChangesets: true,
						};
						await fs.writeFile(configPath, formatJson(config));
						return { success: true, message: 'Added versioning configuration' };
					} catch (err) {
						const m = err instanceof Error ? err.message : String(err);
						return { success: false, message: `Failed: ${m}` };
					}
				},
			},
		};
	} catch {
		return {
			category: 'config',
			name: 'Versioning Config',
			status: 'skip',
			message: 'Could not parse config',
		};
	}
}

/**
 * Check if hooks configuration is present.
 */
async function checkHooksConfig(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult> {
	const configPath = fs.join(
		await resolveConfigRoot(fs, ctx),
		'.contractsrc.json'
	);

	const exists = await fs.exists(configPath);
	if (!exists) {
		return {
			category: 'config',
			name: 'Hooks Config',
			status: 'skip',
			message: 'Config file does not exist',
		};
	}

	try {
		const content = await fs.readFile(configPath);
		const config = JSON.parse(content) as Record<string, unknown>;

		if (config['hooks']) {
			const hooks = config['hooks'] as Record<string, unknown>;
			const hookCount = Object.keys(hooks).length;

			return {
				category: 'config',
				name: 'Hooks Config',
				status: 'pass',
				message: `${hookCount} git hook(s) configured`,
			};
		}

		// Check if husky is installed
		const huskyPath = fs.join(ctx.workspaceRoot, '.husky');
		const hasHusky = await fs.exists(huskyPath);

		if (hasHusky) {
			return {
				category: 'config',
				name: 'Hooks Config',
				status: 'warn',
				message: 'Husky detected but no hooks configured in .contractsrc.json',
				details: 'Add hooks config to run contractspec checks from git hooks',
				fix: {
					description: 'Add pre-commit hooks configuration',
					apply: async (): Promise<FixResult> => {
						try {
							config['hooks'] = {
								'pre-commit': [
									'contractspec validate **/*.operation.ts',
									'contractspec integrity check',
								],
							};
							await fs.writeFile(configPath, formatJson(config));
							return { success: true, message: 'Added hooks configuration' };
						} catch (err) {
							const m = err instanceof Error ? err.message : String(err);
							return { success: false, message: `Failed: ${m}` };
						}
					},
				},
			};
		}

		return {
			category: 'config',
			name: 'Hooks Config',
			status: 'pass',
			message: 'No hooks configured (optional)',
		};
	} catch {
		return {
			category: 'config',
			name: 'Hooks Config',
			status: 'skip',
			message: 'Could not parse config',
		};
	}
}

async function checkPresetConfiguration(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult> {
	const configRoot = await resolveConfigRoot(fs, ctx);
	const config = await loadWorkspaceConfig(fs, configRoot);
	const preset = inferSetupPresetFromConfig(config);

	if (preset === 'core') {
		return {
			category: 'config',
			name: 'Setup Preset',
			status: 'pass',
			message: 'Core setup inferred from workspace config',
		};
	}

	if (preset === 'connect') {
		const missingStorage = [
			config.connect?.storage?.root ? null : 'storage.root',
			config.connect?.storage?.contextPack ? null : 'storage.contextPack',
			config.connect?.storage?.planPacket ? null : 'storage.planPacket',
			config.connect?.storage?.patchVerdict ? null : 'storage.patchVerdict',
		].filter((value): value is string => value !== null);
		const needsStudioEndpoint =
			config.connect?.studio?.enabled &&
			config.connect?.studio?.mode === 'review-bridge' &&
			!config.connect?.studio?.endpoint;

		if (missingStorage.length === 0 && !needsStudioEndpoint) {
			return {
				category: 'config',
				name: 'Setup Preset',
				status: 'pass',
				message: 'Connect setup inferred and artifact storage is configured',
			};
		}

		const issues = [
			...missingStorage,
			...(needsStudioEndpoint ? ['connect.studio.endpoint'] : []),
		];
		return {
			category: 'config',
			name: 'Setup Preset',
			status: 'fail',
			message: `Connect preset is incomplete: ${issues.join(', ')}`,
		};
	}

	const missing: string[] = [];
	const tokenEnvVar = config.builder?.api?.controlPlaneTokenEnvVar;

	if (
		(preset === 'builder-managed' || preset === 'builder-hybrid') &&
		!config.builder?.api?.baseUrl
	) {
		missing.push('builder.api.baseUrl');
	}
	if (
		(preset === 'builder-managed' || preset === 'builder-hybrid') &&
		!tokenEnvVar
	) {
		missing.push('builder.api.controlPlaneTokenEnvVar');
	}
	if (
		(preset === 'builder-managed' || preset === 'builder-hybrid') &&
		tokenEnvVar &&
		!process.env[tokenEnvVar]
	) {
		missing.push(`env:${tokenEnvVar}`);
	}
	if (
		(preset === 'builder-local' || preset === 'builder-hybrid') &&
		!config.builder?.localRuntime?.runtimeId
	) {
		missing.push('builder.localRuntime.runtimeId');
	}
	if (
		(preset === 'builder-local' || preset === 'builder-hybrid') &&
		!config.builder?.localRuntime?.grantedTo
	) {
		missing.push('builder.localRuntime.grantedTo');
	}

	return {
		category: 'config',
		name: 'Setup Preset',
		status: missing.length === 0 ? 'pass' : 'warn',
		message:
			missing.length === 0
				? `Builder preset inferred (${preset}) and required config is present`
				: `Builder preset inferred (${preset}) but setup is missing ${missing.join(', ')}`,
	};
}

async function checkBuilderVscodeMirror(
	fs: FsAdapter,
	ctx: CheckContext
): Promise<CheckResult> {
	const configRoot = await resolveConfigRoot(fs, ctx);
	const config = await loadWorkspaceConfig(fs, configRoot);
	const preset = inferSetupPresetFromConfig(config);

	if (preset !== 'builder-managed' && preset !== 'builder-hybrid') {
		return {
			category: 'config',
			name: 'VS Code API Mirror',
			status: 'skip',
			message: 'Builder managed/hybrid preset is not enabled',
		};
	}

	const settingsPath = fs.join(configRoot, '.vscode', 'settings.json');
	const expectedBaseUrl = config.builder?.api?.baseUrl;
	if (!expectedBaseUrl) {
		return {
			category: 'config',
			name: 'VS Code API Mirror',
			status: 'skip',
			message: 'Builder API base URL is not configured',
		};
	}

	const content = await fs.readFile(settingsPath).catch(() => '');
	const settings = content
		? safeParseJson<Record<string, unknown>>(content)
		: undefined;
	const mirroredBaseUrl = settings?.['contractspec.api.baseUrl'];
	if (mirroredBaseUrl === expectedBaseUrl) {
		return {
			category: 'config',
			name: 'VS Code API Mirror',
			status: 'pass',
			message: 'VS Code API base URL matches Builder configuration',
		};
	}

	return {
		category: 'config',
		name: 'VS Code API Mirror',
		status: 'warn',
		message: 'VS Code settings do not mirror builder.api.baseUrl',
		fix: {
			description:
				'Write the expected ContractSpec API base URL into .vscode/settings.json',
			apply: async (): Promise<FixResult> => {
				try {
					const dirPath = fs.join(configRoot, '.vscode');
					if (!(await fs.exists(dirPath))) {
						await fs.mkdir(dirPath);
					}

					const nextSettings = {
						...(settings ?? {}),
						...generateVscodeSettings({
							workspaceRoot: ctx.workspaceRoot,
							packageRoot: ctx.packageRoot,
							isMonorepo: ctx.isMonorepo,
							packageName: ctx.packageName,
							interactive: false,
							preset,
							targets: [],
							builderApiBaseUrl: expectedBaseUrl,
						}),
					};
					await fs.writeFile(settingsPath, formatJson(nextSettings));
					return { success: true, message: 'Updated VS Code settings mirror' };
				} catch (error) {
					const message =
						error instanceof Error ? error.message : String(error);
					return { success: false, message };
				}
			},
		},
	};
}
