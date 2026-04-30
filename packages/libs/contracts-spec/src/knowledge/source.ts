import type { AppKnowledgeBinding } from './binding';

export type KnowledgeSourceType =
	| 'notion'
	| 'url'
	| 'file_upload'
	| 'email'
	| 'gmail'
	| 'google_drive'
	| 'google_keep'
	| 'database'
	| 'messaging'
	| 'sms'
	| 'telegram'
	| 'whatsapp'
	| 'storage'
	| 'api'
	| 'manual'
	| 'custom';

export type KnowledgeSourceVisibility = 'tenant' | 'shared' | 'global';

export interface KnowledgeSourceMeta {
	id: string;
	tenantId: string;
	/** Optional environment scope for tenant-bound sources. */
	environment?: string;
	/** Integration connection that owns or authorizes this source. */
	integrationConnectionId?: string;
	spaceKey: string;
	spaceVersion: string;
	label: string;
	sourceType: KnowledgeSourceType;
	createdAt: string | Date;
	updatedAt: string | Date;
}

export interface KnowledgeSourceNativeIdentity {
	externalId?: string;
	revision?: string;
	etag?: string;
	historyId?: string;
	cursorId?: string;
	resourceUri?: string;
}

export interface KnowledgeSourceAccessScope {
	/** Defaults to tenant. Shared/global sources require explicit policy evidence. */
	visibility?: KnowledgeSourceVisibility;
	policyRef?: string;
	aclSnapshotRef?: string;
}

export interface KnowledgeSourceSyncState {
	cursorId?: string;
	watermark?: string;
	watermarkVersion?: string;
	checkpointId?: string;
	providerEventId?: string;
	dedupeKey?: string;
	idempotencyKey?: string;
	lease?: {
		holder?: string;
		acquiredAt?: string | Date;
		expiresAt?: string | Date;
		renewalWindowMs?: number;
	};
	webhookChannel?: {
		channelId?: string;
		resourceId?: string;
		resourceUri?: string;
		expiresAt?: string | Date;
	};
}

export interface KnowledgeSourceProvenance {
	sourceSystem?: string;
	sourceUrl?: string;
	collectedAt?: string | Date;
	replayEvidenceRef?: string;
}

export interface KnowledgeSourceTombstone {
	deletedAt: string | Date;
	reason?: string;
	sourceRevision?: string;
}

export interface KnowledgeSourceConfig {
	meta: KnowledgeSourceMeta;
	/** Provider-native identity and revision hints used for replayable sync. */
	native?: KnowledgeSourceNativeIdentity;
	/** Tenant/shared/global access scope and ACL evidence. */
	access?: KnowledgeSourceAccessScope;
	/** Source-specific configuration (URLs, credentials, filters). */
	config: Record<string, unknown>;
	/** Sync schedule (cron or interval). */
	syncSchedule?: {
		enabled: boolean;
		cron?: string;
		intervalMs?: number;
	};
	/** Last sync status. */
	lastSync?: {
		timestamp: Date;
		success: boolean;
		itemsProcessed?: number;
		error?: string;
	};
	/** Cursor, lease, webhook, dedupe, and replay state. */
	syncState?: KnowledgeSourceSyncState;
	/** Provenance captured at source onboarding or sync time. */
	provenance?: KnowledgeSourceProvenance;
	/** Tombstone marker for deleted or inaccessible source records. */
	tombstone?: KnowledgeSourceTombstone;
}

export interface KnowledgeSourceBindingContext {
	tenantId: string;
	environment?: string;
}

export function isKnowledgeSourceAvailableForBinding(
	source: KnowledgeSourceConfig,
	binding: AppKnowledgeBinding,
	context: KnowledgeSourceBindingContext
): boolean {
	if (source.tombstone) return false;
	if (source.meta.spaceKey !== binding.spaceKey) return false;
	if (
		binding.spaceVersion != null &&
		source.meta.spaceVersion !== binding.spaceVersion
	) {
		return false;
	}
	if (
		binding.source?.sourceIds?.length &&
		!binding.source.sourceIds.includes(source.meta.id)
	) {
		return false;
	}
	if (
		binding.source?.integrationConnectionId != null &&
		source.meta.integrationConnectionId !==
			binding.source.integrationConnectionId
	) {
		return false;
	}
	if (
		source.meta.environment != null &&
		source.meta.environment !== context.environment
	) {
		return false;
	}
	if (
		source.access?.visibility === 'shared' ||
		source.access?.visibility === 'global'
	) {
		if (!binding.source?.allowShared) return false;
		return Boolean(source.access.policyRef || source.access.aclSnapshotRef);
	}
	return source.meta.tenantId === context.tenantId;
}
