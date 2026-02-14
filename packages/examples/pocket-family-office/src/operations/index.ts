import {
  defineEnum,
  defineSchemaModel,
  ScalarTypeEnum,
  type ZodSchemaModel,
} from '@contractspec/lib.schema';
import {
  defineCommand,
  defineQuery,
  type OperationSpec,
} from '@contractspec/lib.contracts';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@contractspec/lib.contracts/ownership';
import { OPENBANKING_TELEMETRY_EVENTS } from '@contractspec/lib.contracts-integrations';

// --- Enums ---
const SourceEnum = defineEnum('Source', ['upload', 'email', 'sync']);
const ChannelEnum = defineEnum('Channel', ['email', 'sms', 'both']);
const PeriodEnum = defineEnum('Period', ['P7d', 'P30d', 'P90d']);
const ObPeriodEnum = defineEnum('ObPeriod', ['Pweek', 'Pmonth', 'Pquarter']);

// --- Models ---

const UploadDocumentInputModel = defineSchemaModel({
  name: 'UploadDocumentInput',
  fields: {
    bucket: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    objectKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    mimeType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    bytes: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
    uploadedAt: { type: ScalarTypeEnum.Date(), isOptional: false },
    source: { type: SourceEnum, isOptional: false },
  },
});

const UploadDocumentOutputModel = defineSchemaModel({
  name: 'UploadDocumentOutput',
  fields: {
    documentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ingestionJobId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
  },
});

export type UploadDocumentInput = ZodSchemaModel<
  typeof UploadDocumentInputModel
>;
export type UploadDocumentOutput = ZodSchemaModel<
  typeof UploadDocumentOutputModel
>;

export const uploadDocumentContract = defineCommand({
  meta: {
    key: 'pfo.documents.upload',
    version: '1.0.0',
    description:
      'Stores an object in tenant storage and schedules ingestion into the knowledge base.',
    goal: 'Allow users to ingest financial documents for processing.',
    context:
      'Part of the finance domain. Documents are uploaded to object storage and then processed by the ingestion pipeline.',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['documents', 'ingestion', TagsEnum.Guide],
    stability: StabilityEnum.Experimental,
  },
  io: {
    input: UploadDocumentInputModel,
    output: UploadDocumentOutputModel,
  },
  policy: {
    auth: 'user',
    rateLimit: {
      rpm: 30, // 30 points per 60s approx, simplified to rpm
      key: 'user',
    },
  },
  // Telemetry events removed as new spec does not support 'events' list in telemetry block
});

const PaymentReminderInputModel = defineSchemaModel({
  name: 'PaymentReminderInput',
  fields: {
    billId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recipientEmail: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    recipientPhone: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    dueDate: { type: ScalarTypeEnum.Date(), isOptional: false },
    amountCents: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.Currency(), isOptional: false },
    channel: { type: ChannelEnum, isOptional: false },
    memo: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const PaymentReminderOutputModel = defineSchemaModel({
  name: 'PaymentReminderOutput',
  fields: {
    reminderId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.Date(), isOptional: false },
  },
});

export type PaymentReminderInput = ZodSchemaModel<
  typeof PaymentReminderInputModel
>;
export type PaymentReminderOutput = ZodSchemaModel<
  typeof PaymentReminderOutputModel
>;

export const schedulePaymentReminderContract = defineCommand({
  meta: {
    key: 'pfo.reminders.schedule-payment',
    version: '1.0.0',
    description:
      'Queues outbound email/SMS reminders for upcoming bills and adds an optional calendar hold.',
    goal: 'Ensure bills are paid on time by notifying users.',
    context:
      'Finance automation. Reminders are sent via configured channels (email, SMS).',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['payments', 'reminders', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  io: {
    input: PaymentReminderInputModel,
    output: PaymentReminderOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

const FinancialSummaryInputModel = defineSchemaModel({
  name: 'FinancialSummaryInput',
  fields: {
    period: { type: PeriodEnum, isOptional: false },
    includeVoiceSummary: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

const SummaryHighlightModel = defineSchemaModel({
  name: 'SummaryHighlight',
  fields: {
    label: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const FinancialSummaryOutputModel = defineSchemaModel({
  name: 'FinancialSummaryOutput',
  fields: {
    summaryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    generatedAt: { type: ScalarTypeEnum.Date(), isOptional: false },
    markdown: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    highlights: {
      type: SummaryHighlightModel,
      isOptional: false,
      isArray: true,
    },
    cashflowDelta: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

export type FinancialSummaryInput = ZodSchemaModel<
  typeof FinancialSummaryInputModel
>;
export type FinancialSummaryOutput = ZodSchemaModel<
  typeof FinancialSummaryOutputModel
>;

export const generateFinancialSummaryContract = defineQuery({
  meta: {
    key: 'pfo.summary.generate',
    version: '1.0.0',
    description:
      'Runs RAG over financial documents and email threads to provide a natural-language summary with key metrics.',
    goal: 'Provide a quick overview of financial status and recent activity.',
    context:
      'Uses RAG over ingested knowledge. Summaries can be dispatched or viewed in app.',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['summary', 'ai', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  io: {
    input: FinancialSummaryInputModel,
    output: FinancialSummaryOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

const SyncEmailThreadsInputModel = defineSchemaModel({
  name: 'SyncEmailThreadsInput',
  fields: {
    labelIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
    maxThreads: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    syncSinceMinutes: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
  },
});

const SyncEmailThreadsOutputModel = defineSchemaModel({
  name: 'SyncEmailThreadsOutput',
  fields: {
    syncedThreads: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    lastMessageAt: { type: ScalarTypeEnum.Date(), isOptional: true },
  },
});

export type SyncEmailThreadsInput = ZodSchemaModel<
  typeof SyncEmailThreadsInputModel
>;
export type SyncEmailThreadsOutput = ZodSchemaModel<
  typeof SyncEmailThreadsOutputModel
>;

export const syncEmailThreadsContract = defineCommand({
  meta: {
    key: 'pfo.email.sync-threads',
    version: '1.0.0',
    description:
      'Triggers ingestion of Gmail threads into the operational knowledge space.',
    goal: 'Keep knowledge base up to date with email communications.',
    context:
      'Syncs from Gmail integration. Only includes threads matching configured labels.',
    owners: [OwnersEnum.PlatformMessaging],
    tags: ['gmail', 'knowledge', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  io: {
    input: SyncEmailThreadsInputModel,
    output: SyncEmailThreadsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

const SummaryDispatchInputModel = defineSchemaModel({
  name: 'SummaryDispatchInput',
  fields: {
    summaryId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    recipientEmail: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
    recipientName: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    includeVoice: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    voiceRecipient: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

const SummaryDispatchOutputModel = defineSchemaModel({
  name: 'SummaryDispatchOutput',
  fields: {
    dispatchId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    emailSent: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    voiceUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export type SummaryDispatchInput = ZodSchemaModel<
  typeof SummaryDispatchInputModel
>;
export type SummaryDispatchOutput = ZodSchemaModel<
  typeof SummaryDispatchOutputModel
>;

export const dispatchFinancialSummaryContract = defineCommand({
  meta: {
    key: 'pfo.summary.dispatch',
    version: '1.0.0',
    description:
      'Delivers the generated summary via email and optionally synthesises a voice note.',
    goal: 'Deliver financial insights to users proactively.',
    context:
      'Dispatches summaries generated by pfo.summary.generate via email or voice.',
    owners: [OwnersEnum.PlatformMessaging],
    tags: ['summary', 'communications', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  io: {
    input: SummaryDispatchInputModel,
    output: SummaryDispatchOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

const OpenBankingOverviewInputModel = defineSchemaModel({
  name: 'OpenBankingOverviewInput',
  fields: {
    tenantId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    accountIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    period: { type: ObPeriodEnum, isOptional: false },
    asOf: { type: ScalarTypeEnum.Date(), isOptional: true },
    includeCategories: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    includeCashflowTrend: { type: ScalarTypeEnum.Boolean(), isOptional: false },
  },
});

const OpenBankingOverviewOutputModel = defineSchemaModel({
  name: 'OpenBankingOverviewOutput',
  fields: {
    knowledgeEntryId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    periodStart: { type: ScalarTypeEnum.Date(), isOptional: false },
    periodEnd: { type: ScalarTypeEnum.Date(), isOptional: false },
    generatedAt: { type: ScalarTypeEnum.Date(), isOptional: false },
    summaryPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export type OpenBankingOverviewInput = ZodSchemaModel<
  typeof OpenBankingOverviewInputModel
>;
export type OpenBankingOverviewOutput = ZodSchemaModel<
  typeof OpenBankingOverviewOutputModel
>;

export const generateOpenBankingOverviewContract = defineCommand({
  meta: {
    key: 'pfo.openbanking.generate-overview',
    version: '1.0.0',
    description:
      'Aggregates balances and transactions into a derived financial overview stored in the knowledge layer.',
    goal: 'Create a periodic financial snapshot.',
    context: 'Aggregates data from open banking integration into a document.',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['open-banking', 'summary', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  io: {
    input: OpenBankingOverviewInputModel,
    output: OpenBankingOverviewOutputModel,
  },
  policy: {
    auth: 'user',
  },
  telemetry: {
    success: {
      event: {
        key: OPENBANKING_TELEMETRY_EVENTS.overviewGenerated,
        version: '1.0.0',
      },
    },
  },
});

export const pocketFamilyOfficeContracts = {
  'pfo.documents.upload': uploadDocumentContract,
  'pfo.reminders.schedule-payment': schedulePaymentReminderContract,
  'pfo.summary.generate': generateFinancialSummaryContract,
  'pfo.summary.dispatch': dispatchFinancialSummaryContract,
  'pfo.email.sync-threads': syncEmailThreadsContract,
  'pfo.openbanking.generate-overview': generateOpenBankingOverviewContract,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<string, OperationSpec<any, any>>;
