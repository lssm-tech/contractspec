import type {
	ControlPlaneSkillManifest,
	ControlPlaneSkillVerificationReport,
} from '@contractspec/lib.contracts-spec/control-plane/skills';

import type {
	ChannelTelemetryStage,
	ChannelTelemetryStatus,
} from './telemetry';

export interface ChannelTraceEventRecord {
	id: number;
	stage: ChannelTelemetryStage;
	status: ChannelTelemetryStatus;
	workspaceId?: string;
	providerKey?: string;
	receiptId?: string;
	decisionId?: string;
	actionId?: string;
	sessionId?: string;
	workflowId?: string;
	traceId?: string;
	latencyMs?: number;
	attempt?: number;
	metadata?: Record<string, string | number | boolean>;
	createdAt: Date;
}

export type ControlPlaneSkillInstallationStatus =
	| 'installed'
	| 'disabled'
	| 'rejected';

export interface ControlPlaneSkillInstallationRecord {
	id: string;
	skillKey: string;
	version: string;
	artifactDigest: string;
	manifest: ControlPlaneSkillManifest;
	verificationReport: ControlPlaneSkillVerificationReport;
	status: ControlPlaneSkillInstallationStatus;
	installedAt: Date;
	installedBy?: string;
	disabledAt?: Date;
	disabledBy?: string;
}
