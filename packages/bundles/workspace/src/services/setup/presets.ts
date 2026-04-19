import type { ResolvedContractsrcConfig } from '@contractspec/lib.contracts-spec/workspace-config';
import {
	ALL_SETUP_TARGETS,
	type SetupOptions,
	type SetupPreset,
	type SetupTarget,
} from './types';

export const SETUP_GITIGNORE_PATTERNS = {
	connect: '**/.contractspec/connect/',
	verificationCache: '**/.contractspec/verification-cache.json',
} as const;

export function inferSetupPresetFromConfig(
	config: Partial<ResolvedContractsrcConfig> | null | undefined
): SetupPreset {
	if (config?.builder?.enabled) {
		switch (config.builder.runtimeMode) {
			case 'local':
				return 'builder-local';
			case 'hybrid':
				return 'builder-hybrid';
			default:
				return 'builder-managed';
		}
	}

	if (config?.connect?.enabled) {
		return 'connect';
	}

	return 'core';
}

export function resolveSetupPreset(
	options: Pick<SetupOptions, 'preset'>
): SetupPreset {
	return options.preset ?? 'core';
}

export function resolveSetupTargets(
	preset: SetupPreset,
	explicitTargets: SetupTarget[]
): SetupTarget[] {
	if (explicitTargets.length > 0) {
		return explicitTargets;
	}

	switch (preset) {
		case 'core':
		case 'connect':
		case 'builder-managed':
		case 'builder-local':
		case 'builder-hybrid':
		default:
			return ALL_SETUP_TARGETS;
	}
}

export function getBuilderRuntimeModeForPreset(
	preset: SetupPreset
): 'managed' | 'local' | 'hybrid' | undefined {
	switch (preset) {
		case 'builder-local':
			return 'local';
		case 'builder-hybrid':
			return 'hybrid';
		case 'builder-managed':
			return 'managed';
		default:
			return undefined;
	}
}

export function getBuilderBootstrapPresetForSetupPreset(
	preset: SetupPreset
): 'managed_mvp' | 'local_daemon_mvp' | 'hybrid_mvp' | undefined {
	switch (preset) {
		case 'builder-local':
			return 'local_daemon_mvp';
		case 'builder-hybrid':
			return 'hybrid_mvp';
		case 'builder-managed':
			return 'managed_mvp';
		default:
			return undefined;
	}
}

export function isBuilderPreset(preset: SetupPreset): boolean {
	return preset.startsWith('builder-');
}

export function isConnectPreset(preset: SetupPreset): boolean {
	return preset === 'connect';
}

export function createSetupNextSteps(
	options: Pick<
		SetupOptions,
		'builderLocalGrantedTo' | 'builderLocalRuntimeId' | 'preset' | 'projectName'
	>
): string[] {
	const preset = resolveSetupPreset(options);
	const workspaceId = createBuilderWorkspaceId(options.projectName);

	switch (preset) {
		case 'connect':
			return [
				'contractspec validate',
				'contractspec connect review list --json',
			];
		case 'builder-managed':
			return [
				'contractspec doctor',
				`contractspec builder init --workspace-id ${workspaceId} --preset managed-mvp`,
				`contractspec builder status --workspace-id ${workspaceId}`,
			];
		case 'builder-local':
			return [
				'contractspec doctor',
				`contractspec builder init --workspace-id ${workspaceId} --preset local-daemon-mvp`,
				`contractspec builder local register --workspace-id ${workspaceId} --runtime-id ${
					options.builderLocalRuntimeId ?? 'rt_local_daemon'
				} --granted-to ${options.builderLocalGrantedTo ?? 'local:operator'}`,
			];
		case 'builder-hybrid':
			return [
				'contractspec doctor',
				`contractspec builder init --workspace-id ${workspaceId} --preset hybrid-mvp`,
				`contractspec builder local register --workspace-id ${workspaceId} --runtime-id ${
					options.builderLocalRuntimeId ?? 'rt_local_daemon'
				} --granted-to ${options.builderLocalGrantedTo ?? 'local:operator'}`,
			];
		case 'core':
		default:
			return ['contractspec validate', 'contractspec doctor'];
	}
}

export function createBuilderWorkspaceId(projectName?: string): string {
	const slug = (projectName ?? 'demo')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	return `ws-${slug || 'demo'}`;
}

export function createSetupGitignorePatterns(
	options: Pick<SetupOptions, 'preset'>
): string[] {
	const preset = resolveSetupPreset(options);
	const patterns: string[] = [SETUP_GITIGNORE_PATTERNS.verificationCache];

	if (preset === 'connect') {
		patterns.unshift(SETUP_GITIGNORE_PATTERNS.connect);
	}

	return patterns;
}
