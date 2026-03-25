export type JsonPrimitive = boolean | null | number | string;

export type JsonValue =
	| JsonPrimitive
	| JsonValue[]
	| { [key: string]: JsonValue };

export type WorkflowDevkitHostTarget = 'generic' | 'next';

export type WorkflowDevkitIntegrationMode = 'generated' | 'manual';

export type WorkflowDevkitRunIdentityStrategy =
	| 'meta-key-version'
	| 'trace-id'
	| 'workflow-id';

export type WorkflowDevkitHookTokenStrategy =
	| 'deterministic'
	| 'session-scoped'
	| 'step-scoped';

export type WorkflowDevkitSerializationMode = 'passthrough' | 'strict';

export type WorkflowDevkitResumeSource =
	| 'approval'
	| 'hook'
	| 'stream'
	| 'webhook';

export type WorkflowDevkitStepBehavior =
	| 'approvalWait'
	| 'hookWait'
	| 'sleep'
	| 'streamSession'
	| 'webhookWait';

export interface WorkflowDevkitSerializationConfig {
	enforceHookPayloads?: boolean;
	enforceMetadata?: boolean;
	enforceWorkflowState?: boolean;
	mode?: WorkflowDevkitSerializationMode;
}

export interface WorkflowDevkitIdentityConfig {
	prefix?: string;
	strategy?: WorkflowDevkitRunIdentityStrategy;
}

export interface WorkflowDevkitHookTokenConfig {
	prefix?: string;
	strategy?: WorkflowDevkitHookTokenStrategy;
}

export interface WorkflowDevkitRuntimeConfig {
	hostTarget?: WorkflowDevkitHostTarget;
	hookTokens?: WorkflowDevkitHookTokenConfig;
	integrationMode?: WorkflowDevkitIntegrationMode;
	runIdentity?: WorkflowDevkitIdentityConfig;
	serialization?: WorkflowDevkitSerializationConfig;
}

export interface WorkflowDevkitSleepStepConfig {
	duration: string;
}

export interface WorkflowDevkitHookWaitStepConfig {
	collect?: boolean;
	payloadExample?: JsonValue;
	resumeSource: Extract<WorkflowDevkitResumeSource, 'hook'>;
	token?: string;
}

export interface WorkflowDevkitWebhookWaitStepConfig {
	method?: 'DELETE' | 'GET' | 'PATCH' | 'POST' | 'PUT';
	path?: string;
	payloadExample?: JsonValue;
	resumeSource: Extract<WorkflowDevkitResumeSource, 'webhook'>;
	token?: string;
}

export interface WorkflowDevkitApprovalWaitStepConfig {
	channel?: string;
	payloadExample?: JsonValue;
	resumeSource: Extract<WorkflowDevkitResumeSource, 'approval'>;
	token?: string;
}

export interface WorkflowDevkitStreamSessionStepConfig {
	followUpToken?: string;
	initialState?: JsonValue;
	keepAlive?: boolean;
	resumeSource: Extract<WorkflowDevkitResumeSource, 'stream'>;
	sessionKey?: string;
}

export interface WorkflowDevkitStepRuntimeConfig {
	approvalWait?: WorkflowDevkitApprovalWaitStepConfig;
	behavior: WorkflowDevkitStepBehavior;
	hookWait?: WorkflowDevkitHookWaitStepConfig;
	idempotencyKey?: string;
	sleep?: WorkflowDevkitSleepStepConfig;
	stateExample?: JsonValue;
	streamSession?: WorkflowDevkitStreamSessionStepConfig;
	webhookWait?: WorkflowDevkitWebhookWaitStepConfig;
}

export interface WorkflowStepRuntimeConfig {
	workflowDevkit?: WorkflowDevkitStepRuntimeConfig;
}
