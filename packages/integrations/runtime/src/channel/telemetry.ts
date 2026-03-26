export type ChannelTelemetryStage =
	| 'ingest'
	| 'decision'
	| 'approval'
	| 'outbox'
	| 'dispatch';

export type ChannelTelemetryStatus =
	| 'accepted'
	| 'duplicate'
	| 'rejected'
	| 'pending'
	| 'processed'
	| 'approved'
	| 'expired'
	| 'failed'
	| 'sent'
	| 'retry'
	| 'dead_letter';

export interface ChannelTelemetryEvent {
	stage: ChannelTelemetryStage;
	status: ChannelTelemetryStatus;
	workspaceId?: string;
	providerKey?: string;
	receiptId?: string;
	actionId?: string;
	sessionId?: string;
	workflowId?: string;
	traceId?: string;
	latencyMs?: number;
	attempt?: number;
	metadata?: Record<string, string | number | boolean>;
}

export interface ChannelTelemetryEmitter {
	record(event: ChannelTelemetryEvent): Promise<void> | void;
}
