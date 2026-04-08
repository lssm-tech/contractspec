export type BuilderWorkspaceStatus =
	| 'draft'
	| 'review'
	| 'preview_ready'
	| 'export_ready'
	| 'ready_for_export'
	| 'exported'
	| 'archived';

export type BuilderSourceType =
	| 'web_chat_message'
	| 'audio_upload'
	| 'transcript_segment'
	| 'file'
	| 'zip_entry'
	| 'studio_snapshot'
	| 'telegram_message'
	| 'telegram_callback'
	| 'whatsapp_message'
	| 'whatsapp_interaction'
	| 'provider_output'
	| 'preview_evidence';

export type BuilderChannelType =
	| 'web_chat'
	| 'web_voice'
	| 'telegram'
	| 'whatsapp'
	| 'mobile_web';

export type BuilderDirectiveType =
	| 'requirement'
	| 'constraint'
	| 'policy'
	| 'correction'
	| 'approval'
	| 'question'
	| 'retraction'
	| 'note'
	| 'runtime_preference'
	| 'provider_preference';

export type ApprovalStrength =
	| 'none'
	| 'weak_channel_ack'
	| 'bound_channel_ack'
	| 'studio_signed'
	| 'admin_signed';

export type BuilderConversationMode = 'text' | 'voice' | 'mixed';
export type BuilderConversationStatus = 'active' | 'paused' | 'archived';
export type BuilderMessageDirection = 'inbound' | 'outbound';
export type BuilderMessageKind =
	| 'text'
	| 'voice'
	| 'button'
	| 'list_selection'
	| 'file'
	| 'review_card'
	| 'system';

export type BuilderTranscriptStatus = 'draft' | 'confirmed' | 'rejected';
export type BuilderDirectiveStatus =
	| 'open'
	| 'accepted'
	| 'rejected'
	| 'superseded';

export type BuilderTargetArea =
	| 'brief'
	| 'workflow'
	| 'surface'
	| 'policy'
	| 'integration'
	| 'runtime'
	| 'provider'
	| 'export';

export type BuilderLaneType =
	| 'clarify'
	| 'consensus_plan'
	| 'delegate_external'
	| 'verify_fix'
	| 'preview'
	| 'export';

export type BuilderPreviewDataMode = 'mock' | 'snapshot' | 'connector_sandbox';

export type BuilderApprovalRequestChannel =
	| 'web_ui'
	| 'telegram'
	| 'whatsapp'
	| 'studio';

export type BuilderApprovalStatus =
	| 'open'
	| 'approved'
	| 'rejected'
	| 'expired';

export type BuilderAppClass =
	| 'internal_workflow'
	| 'dashboard'
	| 'portal'
	| 'approval_app'
	| 'crud_app'
	| 'ops_assistant';

export type BuilderPreviewBuildStatus =
	| 'pending'
	| 'building'
	| 'ready'
	| 'failed';

export type BuilderReadinessStatus =
	| 'draft_only'
	| 'needs_review'
	| 'channel_review_required'
	| 'preview_ready'
	| 'export_ready'
	| 'blocked';

export type BuilderExportTargetType =
	| 'oss_workspace'
	| 'repo_pr'
	| 'studio_project'
	| 'package_bundle';

export type BuilderAssumptionSeverity = 'low' | 'medium' | 'high';
export type BuilderAssumptionStatus = 'open' | 'confirmed' | 'rejected';
export type BuilderConflictStatus = 'open' | 'resolved';
export type BuilderSourceApprovalState =
	| 'draft'
	| 'approved'
	| 'rejected'
	| 'superseded';
export type BuilderTrustLevel = 'low' | 'medium' | 'high';
export type BuilderPolicyClassification =
	| 'public'
	| 'internal'
	| 'confidential'
	| 'restricted';
