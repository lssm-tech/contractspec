import {
  defineCommand,
  defineQuery,
  defineSchemaModel,
} from '@contractspec/lib.contracts';
import { ScalarTypeEnum, defineEnum } from '@contractspec/lib.schema';

const OWNERS = ['platform.audit-trail'] as const;

// ============ Schemas ============

export const AuditLogModel = defineSchemaModel({
  name: 'AuditLog',
  description: 'Detailed audit log entry',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    eventVersion: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    payload: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    actorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    actorType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    actorEmail: { type: ScalarTypeEnum.EmailAddress(), isOptional: true },
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    targetType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    clientIp: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    recordedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const AuditQueryInputModel = defineSchemaModel({
  name: 'AuditQueryInput',
  description: 'Input for querying audit logs',
  fields: {
    eventName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    actorId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    targetId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    targetType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 100,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

export const AuditQueryOutputModel = defineSchemaModel({
  name: 'AuditQueryOutput',
  description: 'Output from querying audit logs',
  fields: {
    logs: { type: AuditLogModel, isArray: true, isOptional: false },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    hasMore: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

export const ExportFormatEnum = defineEnum('ExportFormat', [
  'json',
  'csv',
  'parquet',
]);

export const AuditExportInputModel = defineSchemaModel({
  name: 'AuditExportInput',
  description: 'Input for exporting audit logs',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    format: { type: ExportFormatEnum, isOptional: true, defaultValue: 'json' },
    eventNames: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: true,
    },
  },
});

export const ExportStatusEnum = defineEnum('ExportStatus', [
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const AuditExportOutputModel = defineSchemaModel({
  name: 'AuditExportOutput',
  description: 'Output from initiating an audit export',
  fields: {
    exportId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ExportStatusEnum, isOptional: false },
    downloadUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
  },
});

export const AuditStatsInputModel = defineSchemaModel({
  name: 'AuditStatsInput',
  description: 'Input for getting audit statistics',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const AuditStatsOutputModel = defineSchemaModel({
  name: 'AuditStatsOutput',
  description: 'Audit log statistics',
  fields: {
    totalLogs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    uniqueActors: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    uniqueTargets: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    eventCounts: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
  },
});

// ============ Contracts ============

/**
 * Query audit logs.
 */
export const QueryAuditLogsContract = defineQuery({
  meta: {
    key: 'audit.logs.query',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['audit', 'logs', 'query'],
    description: 'Query audit logs with filters.',
    goal: 'Enable searching and filtering of audit history.',
    context: 'Admin dashboard, compliance reporting, debugging.',
  },
  io: {
    input: AuditQueryInputModel,
    output: AuditQueryOutputModel,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Get audit log by ID.
 */
export const GetAuditLogContract = defineQuery({
  meta: {
    key: 'audit.logs.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['audit', 'logs', 'get'],
    description: 'Get a specific audit log by ID.',
    goal: 'View detailed audit log entry.',
    context: 'Log detail view.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetAuditLogInput',
      fields: {
        logId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: AuditLogModel,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Get audit logs by trace ID.
 */
export const GetAuditTraceContract = defineQuery({
  meta: {
    key: 'audit.trace.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['audit', 'trace', 'get'],
    description: 'Get all audit logs for a trace.',
    goal: 'View complete request trace for debugging.',
    context: 'Request tracing, debugging.',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetAuditTraceInput',
      fields: {
        traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: defineSchemaModel({
      name: 'GetAuditTraceOutput',
      fields: {
        logs: { type: AuditLogModel, isArray: true, isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Export audit logs.
 */
export const ExportAuditLogsContract = defineCommand({
  meta: {
    key: 'audit.logs.export',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['audit', 'logs', 'export'],
    description: 'Export audit logs for compliance reporting.',
    goal: 'Generate audit reports for compliance.',
    context: 'Compliance reporting, external audits.',
  },
  io: {
    input: AuditExportInputModel,
    output: AuditExportOutputModel,
  },
  policy: {
    auth: 'admin',
  },
});

/**
 * Get audit statistics.
 */
export const GetAuditStatsContract = defineQuery({
  meta: {
    key: 'audit.stats',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['audit', 'stats'],
    description: 'Get audit log statistics.',
    goal: 'Monitor audit activity levels.',
    context: 'Admin dashboard, monitoring.',
  },
  io: {
    input: AuditStatsInputModel,
    output: AuditStatsOutputModel,
  },
  policy: {
    auth: 'admin',
  },
});
