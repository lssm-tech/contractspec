import type { LaneKey } from '@contractspec/lib.execution-lanes';
import type { RuntimeMode } from '@contractspec/lib.provider-spec';
import type {
	ApprovalStrength,
	BuilderAppClass,
	BuilderChannelType,
	BuilderConversationMode,
	BuilderConversationStatus,
	BuilderLaneType,
	BuilderTrustLevel,
	BuilderWorkspaceStatus,
} from '../enums';

export interface BuilderWorkspace {
	id: string;
	tenantId: string;
	name: string;
	status: BuilderWorkspaceStatus;
	appClass: BuilderAppClass;
	defaultRuntimeMode: RuntimeMode;
	preferredProviderProfileId?: string;
	mobileParityRequired: boolean;
	ownerIds: string[];
	defaultLocale: string;
	defaultChannelPolicy: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
}

export interface BuilderConversation {
	id: string;
	workspaceId: string;
	mode: BuilderConversationMode;
	primaryChannelType: BuilderChannelType;
	activeLane: BuilderLaneType;
	activeExecutionLaneKey?: LaneKey;
	boundChannelIds: string[];
	lastActivityAt: string;
	status: BuilderConversationStatus;
}

export interface BuilderParticipantBinding {
	id: string;
	workspaceId: string;
	participantId: string;
	workspaceRole: 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer';
	channelType: BuilderChannelType;
	externalIdentityRef: string;
	identityAssurance: BuilderTrustLevel;
	channelBindingStrength: BuilderTrustLevel;
	allowedActions: string[];
	approvalStrength: ApprovalStrength;
	messageAuthenticity: BuilderTrustLevel;
	createdAt: string;
	revokedAt?: string;
}

export interface BuilderTrustProfile {
	identityAssurance: BuilderTrustLevel;
	channelBindingStrength: BuilderTrustLevel;
	messageAuthenticity: BuilderTrustLevel;
	transcriptConfidence?: number;
	approvalEligible: boolean;
	participantBindingId?: string;
}
