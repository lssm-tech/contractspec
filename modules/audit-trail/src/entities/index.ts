import { defineEntity, field, index } from '@contractspec/lib.schema';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';

/**
 * AuditLog entity - main audit log entry.
 */
export const AuditLogEntity = defineEntity({
  name: 'AuditLog',
  description: 'Audit log entry for tracking system events.',
  schema: 'lssm_audit',
  map: 'audit_log',
  fields: {
    id: field.id({ description: 'Unique audit log ID' }),

    // Event info
    eventName: field.string({ description: 'Event name/type' }),
    eventVersion: field.int({ description: 'Event version' }),
    payload: field.json({ description: 'Event payload (may be redacted)' }),

    // Actor info
    actorId: field.string({
      isOptional: true,
      description: 'User/service that triggered the event',
    }),
    actorType: field.string({
      isOptional: true,
      description: 'Actor type (user, system, service)',
    }),
    actorEmail: field.string({
      isOptional: true,
      description: 'Actor email (for searchability)',
    }),

    // Target info
    targetId: field.string({
      isOptional: true,
      description: 'Resource affected by the event',
    }),
    targetType: field.string({
      isOptional: true,
      description: 'Resource type',
    }),

    // Context
    orgId: field.string({
      isOptional: true,
      description: 'Organization context',
    }),
    tenantId: field.string({ isOptional: true, description: 'Tenant context' }),

    // Tracing
    traceId: field.string({
      isOptional: true,
      description: 'Distributed trace ID',
    }),
    spanId: field.string({ isOptional: true, description: 'Span ID' }),
    requestId: field.string({ isOptional: true, description: 'Request ID' }),
    sessionId: field.string({ isOptional: true, description: 'Session ID' }),

    // Client info
    clientIp: field.string({
      isOptional: true,
      description: 'Client IP address',
    }),
    userAgent: field.string({
      isOptional: true,
      description: 'User agent string',
    }),

    // Metadata
    tags: field.json({
      isOptional: true,
      description: 'Custom tags for filtering',
    }),
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),

    // Timestamps
    occurredAt: field.dateTime({ description: 'When the event occurred' }),
    recordedAt: field.createdAt({ description: 'When the log was recorded' }),
  },
  indexes: [
    index.on(['actorId', 'occurredAt']),
    index.on(['targetId', 'occurredAt']),
    index.on(['orgId', 'occurredAt']),
    index.on(['eventName', 'occurredAt']),
    index.on(['traceId']),
    index.on(['occurredAt']),
  ],
});

/**
 * AuditLogArchive entity - archived logs for long-term retention.
 */
export const AuditLogArchiveEntity = defineEntity({
  name: 'AuditLogArchive',
  description: 'Archived audit logs for long-term retention.',
  schema: 'lssm_audit',
  map: 'audit_log_archive',
  fields: {
    id: field.id(),

    // Batch info
    batchId: field.string({ description: 'Archive batch ID' }),
    logCount: field.int({ description: 'Number of logs in batch' }),

    // Time range
    fromDate: field.dateTime({ description: 'Earliest log in batch' }),
    toDate: field.dateTime({ description: 'Latest log in batch' }),

    // Storage
    storagePath: field.string({ description: 'Path to archived data' }),
    storageType: field.string({ description: 'Storage type (s3, gcs, file)' }),
    compressedSize: field.int({ description: 'Compressed size in bytes' }),

    // Integrity
    checksum: field.string({ description: 'SHA-256 checksum' }),

    // Retention
    retainUntil: field.dateTime({ description: 'When archive can be deleted' }),

    // Timestamps
    createdAt: field.createdAt(),
  },
  indexes: [index.on(['fromDate', 'toDate']), index.on(['retainUntil'])],
});

/**
 * All audit trail entities for schema composition.
 */
export const auditTrailEntities = [AuditLogEntity, AuditLogArchiveEntity];

/**
 * Module schema contribution for audit trail.
 */
export const auditTrailSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@contractspec/module.audit-trail',
  entities: auditTrailEntities,
};
