export interface ProviderDeltaLease {
	holder: string;
	acquiredAt?: string | Date;
	expiresAt: string | Date;
	renewalWindowMs: number;
}

export interface ProviderDeltaCursor {
	cursorId?: string;
	cursor?: string;
	watermark?: string;
	watermarkVersion?: string;
}

export interface ProviderDeltaWebhookChannel {
	channelId: string;
	resourceId?: string;
	resourceUri?: string;
	expiresAt: string | Date;
}

export interface ProviderDeltaReplayCheckpoint {
	checkpointId: string;
	sequence?: string | number;
	createdAt?: string | Date;
}

export interface ProviderDeltaTombstone {
	deletedAt: string | Date;
	reason?: string;
	providerRevision?: string;
}

export interface ProviderDeltaSyncState {
	lease?: ProviderDeltaLease;
	cursor?: ProviderDeltaCursor;
	webhookChannel?: ProviderDeltaWebhookChannel;
	providerEventId?: string;
	dedupeKey?: string;
	idempotencyKey?: string;
	replayCheckpoint?: ProviderDeltaReplayCheckpoint;
	tombstone?: ProviderDeltaTombstone;
}

export interface ProviderDeltaEnvelope<TPayload = unknown> {
	providerKey: string;
	sourceId: string;
	payload: TPayload;
	delta: ProviderDeltaSyncState;
}

export function isProviderDeltaTombstoned(
	delta: ProviderDeltaSyncState | undefined
): boolean {
	return Boolean(delta?.tombstone);
}
