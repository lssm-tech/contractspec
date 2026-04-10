import { connect } from '@contractspec/bundle.workspace';

type ConnectDecisionEnvelope = NonNullable<
	Awaited<ReturnType<typeof connect.loadStoredDecision>>['envelope']
>;

interface ConnectCommandContext {
	adapters: Parameters<typeof connect.listConnectReviewPackets>[0];
	config: NonNullable<
		NonNullable<Parameters<typeof connect.resolveWorkspace>[0]>['config']
	> & {
		packageRoot: string;
		workspaceRoot: string;
	};
	cwd: string;
}

export interface ConnectReviewSyncResult {
	decisionId: string;
	error?: string;
	laneRunId?: string;
	queue?: string;
	reviewId?: string;
	runtimeDecisionId?: string;
	status: NonNullable<ConnectDecisionEnvelope['reviewBridge']>['status'];
	traceId?: string;
}

interface ConnectReviewBridgeUpdate {
	enabled?: boolean;
	endpoint?: string;
	error?: string;
	laneRunId?: string;
	mode?: 'off' | 'review-bridge';
	queue?: string;
	reviewId?: string;
	runtimeDecisionId?: string;
	status: NonNullable<ConnectDecisionEnvelope['reviewBridge']>['status'];
	traceId?: string;
}

export async function autoSyncConnectReviewDecision(
	ctx: ConnectCommandContext,
	decisionId: string
) {
	return [await syncSingleDecision(ctx, decisionId, undefined, false)];
}

export async function syncConnectReviewDecisions(
	ctx: ConnectCommandContext,
	input: {
		all?: boolean;
		decisionId?: string;
		queue?: string;
		strict: boolean;
	}
): Promise<ConnectReviewSyncResult[]> {
	const decisionIds =
		input.decisionId != null
			? [input.decisionId]
			: input.all || input.strict === false
				? await listReviewDecisionIds(ctx)
				: [];
	if (decisionIds.length === 0) {
		return [];
	}

	const results: ConnectReviewSyncResult[] = [];
	for (const decisionId of decisionIds) {
		results.push(
			await syncSingleDecision(ctx, decisionId, input.queue, input.strict)
		);
	}
	return results;
}

async function syncSingleDecision(
	ctx: ConnectCommandContext,
	decisionId: string,
	queueOverride: string | undefined,
	strict: boolean
): Promise<ConnectReviewSyncResult> {
	const { storage, workspace } = await resolveStorage(ctx);
	const stored = await connect.loadStoredDecision(
		ctx.adapters.fs,
		storage,
		decisionId
	);
	if (!stored.reviewPacket) {
		if (strict) {
			throw new Error(`No local review packet found for ${decisionId}.`);
		}
		return persistReviewBridgeState(
			ctx,
			workspace,
			storage,
			decisionId,
			stored.envelope,
			{
				status: 'skipped',
				error: 'No local review packet found.',
			}
		);
	}

	const settings = resolveBridgeSettings(ctx.config, queueOverride);
	if (!settings.enabled || settings.mode !== 'review-bridge') {
		return persistReviewBridgeState(
			ctx,
			workspace,
			storage,
			decisionId,
			stored.envelope,
			{
				enabled: settings.enabled,
				mode: settings.mode,
				queue: settings.queue,
				status: 'disabled',
			}
		);
	}
	if (!settings.endpoint) {
		const result = await persistReviewBridgeState(
			ctx,
			workspace,
			storage,
			decisionId,
			stored.envelope,
			{
				enabled: true,
				mode: settings.mode,
				queue: settings.queue,
				status: 'failed',
				error: 'connect.studio.endpoint is required for review-bridge sync.',
			}
		);
		if (strict) {
			throw new Error(
				'connect.studio.endpoint is required for review-bridge sync.'
			);
		}
		return result;
	}

	const token = process.env.CONTROL_PLANE_API_TOKEN;
	if (!token) {
		const result = await persistReviewBridgeState(
			ctx,
			workspace,
			storage,
			decisionId,
			stored.envelope,
			{
				enabled: true,
				endpoint: settings.endpoint,
				mode: settings.mode,
				queue: settings.queue,
				status: 'failed',
				error: 'CONTROL_PLANE_API_TOKEN is required for review-bridge sync.',
			}
		);
		if (strict) {
			throw new Error(
				'CONTROL_PLANE_API_TOKEN is required for review-bridge sync.'
			);
		}
		return result;
	}

	try {
		const response = await fetch(resolveReviewBridgeUrl(settings.endpoint), {
			method: 'POST',
			headers: {
				authorization: `Bearer ${token}`,
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				queue: settings.queue,
				reviewPacket: stored.reviewPacket,
				contextPack: stored.contextPack,
				planPacket: stored.planPacket,
				patchVerdict: stored.patchVerdict,
				decisionEnvelope: stored.envelope,
			}),
		});
		const payload = (await response.json().catch(() => ({}))) as {
			error?: string;
			item?: {
				id?: string;
				laneRunId?: string;
				queue?: string;
				runtimeDecisionId?: string;
				traceId?: string;
			};
			message?: string;
			ok?: boolean;
		};
		if (!response.ok || payload.ok === false || !payload.item?.id) {
			throw new Error(
				payload.message ??
					payload.error ??
					`Studio sync failed with ${response.status}.`
			);
		}
		return persistReviewBridgeState(
			ctx,
			workspace,
			storage,
			decisionId,
			stored.envelope,
			{
				enabled: true,
				endpoint: settings.endpoint,
				mode: settings.mode,
				queue: payload.item.queue ?? settings.queue,
				reviewId: payload.item.id,
				laneRunId: payload.item.laneRunId,
				runtimeDecisionId: payload.item.runtimeDecisionId,
				traceId: payload.item.traceId,
				status: 'synced',
			}
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		const result = await persistReviewBridgeState(
			ctx,
			workspace,
			storage,
			decisionId,
			stored.envelope,
			{
				enabled: true,
				endpoint: settings.endpoint,
				mode: settings.mode,
				queue: settings.queue,
				status: 'failed',
				error: message,
			}
		);
		if (strict) {
			throw new Error(message);
		}
		return result;
	}
}

async function listReviewDecisionIds(ctx: ConnectCommandContext) {
	const packets = await connect.listConnectReviewPackets(ctx.adapters, {
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
	});
	return packets.map((item) => item.packet.sourceDecisionId);
}

async function resolveStorage(ctx: ConnectCommandContext) {
	const workspace = connect.resolveWorkspace({
		cwd: ctx.cwd,
		config: ctx.config,
		workspaceRoot: ctx.config.workspaceRoot,
		packageRoot: ctx.config.packageRoot,
	});
	return {
		workspace,
		storage: connect.resolveStoragePaths(workspace),
	};
}

async function persistReviewBridgeState(
	ctx: ConnectCommandContext,
	workspace: ReturnType<typeof connect.resolveWorkspace>,
	storage: ReturnType<typeof connect.resolveStoragePaths>,
	decisionId: string,
	envelope: ConnectDecisionEnvelope | undefined,
	state: ConnectReviewBridgeUpdate
): Promise<ConnectReviewSyncResult> {
	const now = new Date().toISOString();
	const nextEnvelope: ConnectDecisionEnvelope = {
		connectDecisionId: envelope?.connectDecisionId ?? decisionId,
		taskId: envelope?.taskId ?? decisionId,
		verdict: envelope?.verdict ?? 'require_review',
		createdAt: envelope?.createdAt ?? now,
		artifacts: envelope?.artifacts ?? {
			contextPack: '',
			planPacket: '',
			patchVerdict: '',
		},
		runtimeLink: envelope?.runtimeLink,
		reviewBridge: {
			enabled: state.enabled ?? state.status !== 'disabled',
			endpoint: state.endpoint,
			error: state.error,
			laneRunId: state.laneRunId,
			lastAttemptAt: now,
			mode: state.mode,
			queue: state.queue,
			reviewId: state.reviewId,
			runtimeDecisionId: state.runtimeDecisionId,
			status: state.status,
			syncedAt:
				state.status === 'synced' ? now : envelope?.reviewBridge?.syncedAt,
			traceId: state.traceId,
		},
	};
	await connect.writeDecisionEnvelope(
		ctx.adapters.fs,
		storage,
		decisionId,
		nextEnvelope
	);
	await connect.appendAuditRecord(ctx.adapters.fs, storage, {
		timestamp: now,
		eventType: 'connect.review.sync',
		decisionId,
		reviewId: state.reviewId,
		queue: state.queue,
		status: state.status,
		traceId: state.traceId ?? nextEnvelope.runtimeLink?.traceId,
		laneRunId: state.laneRunId,
		runtimeDecisionId:
			state.runtimeDecisionId ?? nextEnvelope.runtimeLink?.decisionId,
		endpoint: state.endpoint,
		error: state.error,
		repoId: workspace.repoId,
	});
	return {
		decisionId,
		error: state.error,
		laneRunId: state.laneRunId,
		queue: state.queue,
		reviewId: state.reviewId,
		runtimeDecisionId: state.runtimeDecisionId,
		status: state.status,
		traceId: state.traceId,
	};
}

function resolveBridgeSettings(
	config: ConnectCommandContext['config'],
	queueOverride: string | undefined
) {
	return {
		enabled: config.connect?.studio?.enabled === true,
		endpoint: config.connect?.studio?.endpoint,
		mode: config.connect?.studio?.mode ?? 'off',
		queue: queueOverride ?? config.connect?.studio?.queue ?? 'connect-default',
	};
}

function resolveReviewBridgeUrl(endpoint: string) {
	const normalized = endpoint.replace(/\/+$/, '');
	if (normalized.endsWith('/internal/control-plane/connect/reviews')) {
		return normalized;
	}
	if (normalized.endsWith('/internal/control-plane')) {
		return `${normalized}/connect/reviews`;
	}
	return `${normalized}/internal/control-plane/connect/reviews`;
}
