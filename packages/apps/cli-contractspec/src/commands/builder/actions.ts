import type {
	BuilderWorkspaceBootstrapPreset,
	BuilderWorkspaceBootstrapResult,
	BuilderWorkspaceSnapshot,
} from '@contractspec/lib.builder-spec';
import chalk from 'chalk';
import { executeBuilderApiCommand, executeBuilderApiQuery } from './client';
import {
	formatBuilderComparisonStatus,
	formatBuilderLocalRuntimeStatus,
	formatBuilderMobileStatus,
	formatBuilderStatus,
	summarizeBuilderComparisonStatus,
	summarizeBuilderLocalRuntimeStatus,
	summarizeBuilderMobileStatus,
	summarizeBuilderStatus,
} from './status';

function normalizePreset(
	value: string | undefined
): BuilderWorkspaceBootstrapPreset {
	if (value === 'local_daemon_mvp' || value === 'local-daemon-mvp') {
		return 'local_daemon_mvp';
	}
	if (value === 'hybrid_mvp' || value === 'hybrid-mvp') {
		return 'hybrid_mvp';
	}
	return 'managed_mvp';
}

export async function runBuilderInitCommand(options: {
	workspaceId: string;
	preset?: string;
	json?: boolean;
}) {
	const result =
		await executeBuilderApiCommand<BuilderWorkspaceBootstrapResult>(
			'builder.workspace.bootstrap',
			{
				workspaceId: options.workspaceId,
				payload: {
					preset: normalizePreset(options.preset),
				},
			}
		);
	if (options.json) {
		console.log(JSON.stringify(result, null, 2));
		return result;
	}
	console.log(
		chalk.green(`✅ Bootstrapped Builder workspace ${result.workspaceId}`)
	);
	console.log(
		chalk.gray(
			`preset=${result.preset} providers=${result.providerIds.length} runtimeTargets=${result.runtimeTargetIds.length}`
		)
	);
	return result;
}

export async function runBuilderStatusCommand(options: {
	workspaceId: string;
	json?: boolean;
}) {
	const snapshot =
		await executeBuilderApiQuery<BuilderWorkspaceSnapshot | null>(
			'builder.workspace.snapshot',
			{
				workspaceId: options.workspaceId,
			}
		);
	if (!snapshot) {
		throw new Error(`Builder workspace ${options.workspaceId} was not found.`);
	}
	const status = summarizeBuilderStatus(snapshot);
	if (options.json) {
		console.log(JSON.stringify(status, null, 2));
		return status;
	}
	console.log(formatBuilderStatus(status));
	return status;
}

export async function runBuilderMobileStatusCommand(options: {
	workspaceId: string;
	json?: boolean;
}) {
	const snapshot =
		await executeBuilderApiQuery<BuilderWorkspaceSnapshot | null>(
			'builder.workspace.snapshot',
			{ workspaceId: options.workspaceId }
		);
	if (!snapshot) {
		throw new Error(`Builder workspace ${options.workspaceId} was not found.`);
	}
	const status = summarizeBuilderMobileStatus(snapshot);
	if (options.json) {
		console.log(JSON.stringify(status, null, 2));
		return status;
	}
	console.log(formatBuilderMobileStatus(status));
	return status;
}

export async function runBuilderLocalRegisterCommand(options: {
	workspaceId: string;
	runtimeId?: string;
	grantedTo?: string;
	provider?: string[];
	json?: boolean;
}) {
	const result = await executeBuilderApiCommand(
		'builder.runtimeTarget.registerLocalDaemon',
		{
			workspaceId: options.workspaceId,
			entityId: options.runtimeId ?? 'rt_local_daemon',
			payload: {
				grantedTo: options.grantedTo,
				availableProviders: options.provider,
			},
		}
	);
	if (options.json) {
		console.log(JSON.stringify(result, null, 2));
		return result;
	}
	console.log(
		chalk.green(
			`✅ Registered local daemon runtime ${options.runtimeId ?? 'rt_local_daemon'}`
		)
	);
	return result;
}

export async function runBuilderLocalStatusCommand(options: {
	workspaceId: string;
	json?: boolean;
}) {
	const snapshot =
		await executeBuilderApiQuery<BuilderWorkspaceSnapshot | null>(
			'builder.workspace.snapshot',
			{ workspaceId: options.workspaceId }
		);
	if (!snapshot) {
		throw new Error(`Builder workspace ${options.workspaceId} was not found.`);
	}
	const status = summarizeBuilderLocalRuntimeStatus(snapshot);
	if (options.json) {
		console.log(JSON.stringify(status, null, 2));
		return status;
	}
	console.log(formatBuilderLocalRuntimeStatus(status));
	return status;
}

export async function runBuilderComparisonStatusCommand(options: {
	workspaceId: string;
	json?: boolean;
}) {
	const snapshot =
		await executeBuilderApiQuery<BuilderWorkspaceSnapshot | null>(
			'builder.workspace.snapshot',
			{ workspaceId: options.workspaceId }
		);
	if (!snapshot) {
		throw new Error(`Builder workspace ${options.workspaceId} was not found.`);
	}
	const status = summarizeBuilderComparisonStatus(snapshot);
	if (options.json) {
		console.log(JSON.stringify(status, null, 2));
		return status;
	}
	console.log(formatBuilderComparisonStatus(status));
	return status;
}
