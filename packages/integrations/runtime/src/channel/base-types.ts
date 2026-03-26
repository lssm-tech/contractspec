export type ChannelProviderKey =
	| 'messaging.slack'
	| 'messaging.github'
	| 'messaging.telegram'
	| 'messaging.whatsapp.meta'
	| 'messaging.whatsapp.twilio'
	| (string & {});

export interface ChannelThreadRef {
	externalThreadId: string;
	externalChannelId?: string;
	externalUserId?: string;
}

export interface InboundMessage {
	text: string;
	externalMessageId?: string;
}

export interface ChannelInboundEvent {
	workspaceId: string;
	providerKey: ChannelProviderKey;
	externalEventId: string;
	eventType: string;
	occurredAt: Date;
	signatureValid: boolean;
	traceId?: string;
	thread: ChannelThreadRef;
	message?: InboundMessage;
	metadata?: Record<string, string>;
	rawPayload?: string;
}

export type ChannelRiskTier = 'low' | 'medium' | 'high' | 'blocked';

export type ChannelPolicyVerdict = 'autonomous' | 'assist' | 'blocked';

export type ChannelActorType = 'human' | 'service' | 'agent' | 'tool';

export type ChannelApprovalStatus =
	| 'not_required'
	| 'pending'
	| 'approved'
	| 'rejected'
	| 'expired';

export interface ChannelExecutionActor {
	type: ChannelActorType;
	id: string;
	tenantId?: string;
	sessionId?: string;
	capabilitySource?: string;
	capabilityGrants: string[];
}

export interface ChannelApprovalContext {
	actorType?: ChannelActorType;
	sessionId?: string;
	capabilitySource?: string;
	capabilityGrants?: string[];
}
