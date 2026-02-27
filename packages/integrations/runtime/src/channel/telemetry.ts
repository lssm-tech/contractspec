export type ChannelTelemetryStage =
  | 'ingest'
  | 'decision'
  | 'outbox'
  | 'dispatch';

export type ChannelTelemetryStatus =
  | 'accepted'
  | 'duplicate'
  | 'processed'
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
  traceId?: string;
  latencyMs?: number;
  attempt?: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface ChannelTelemetryEmitter {
  record(event: ChannelTelemetryEvent): Promise<void> | void;
}
