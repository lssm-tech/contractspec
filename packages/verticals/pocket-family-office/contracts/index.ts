import { z } from 'zod';
import type { ContractSpec } from '@lssm/lib.contracts/spec';
import {
  OwnersEnum,
  StabilityEnum,
  TagsEnum,
} from '@lssm/lib.contracts/ownership';

const UploadDocumentInput = z.object({
  bucket: z.string().min(1),
  objectKey: z.string().min(1),
  mimeType: z.string().min(1),
  bytes: z.number().int().nonnegative(),
  tags: z.array(z.string()).default([]),
  uploadedAt: z.coerce.date(),
  source: z.enum(['upload', 'email', 'sync']).default('upload'),
});

const UploadDocumentOutput = z.object({
  documentId: z.string(),
  ingestionJobId: z.string(),
});

export type UploadDocumentInput = z.infer<typeof UploadDocumentInput>;
export type UploadDocumentOutput = z.infer<typeof UploadDocumentOutput>;

export const uploadDocumentContract: ContractSpec<
  UploadDocumentInput,
  UploadDocumentOutput
> = {
  meta: {
    name: 'pfo.documents.upload',
    version: 1,
    kind: 'command',
    title: 'Upload Financial Document',
    description:
      'Stores an object in tenant storage and schedules ingestion into the knowledge base.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['documents', 'ingestion', TagsEnum.Guide],
    stability: StabilityEnum.Experimental,
  },
  io: {
    input: UploadDocumentInput,
    output: UploadDocumentOutput,
  },
  policy: {
    auth: {
      scopes: ['documents:ingest'],
    },
    rateLimit: {
      points: 30,
      windowSeconds: 60,
    },
  },
  telemetry: {
    events: [
      {
        name: 'pfo.documents.uploaded',
        description: 'Document queued for ingestion',
      },
    ],
  },
};

const PaymentReminderInput = z.object({
  billId: z.string(),
  recipientEmail: z.string().email(),
  recipientPhone: z.string().optional(),
  dueDate: z.coerce.date(),
  amountCents: z.number().int().nonnegative(),
  currency: z.string().length(3),
  channel: z.enum(['email', 'sms', 'both']).default('email'),
  memo: z.string().max(280).optional(),
});

const PaymentReminderOutput = z.object({
  reminderId: z.string(),
  scheduledAt: z.coerce.date(),
});

export type PaymentReminderInput = z.infer<typeof PaymentReminderInput>;
export type PaymentReminderOutput = z.infer<typeof PaymentReminderOutput>;

export const schedulePaymentReminderContract: ContractSpec<
  PaymentReminderInput,
  PaymentReminderOutput
> = {
  meta: {
    name: 'pfo.reminders.schedule-payment',
    version: 1,
    kind: 'command',
    title: 'Schedule Payment Reminder',
    description:
      'Queues outbound email/SMS reminders for upcoming bills and adds an optional calendar hold.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['payments', 'reminders', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  io: {
    input: PaymentReminderInput,
    output: PaymentReminderOutput,
  },
  policy: {
    auth: {
      scopes: ['reminders:write'],
    },
  },
  telemetry: {
    events: [
      {
        name: 'pfo.reminders.scheduled',
        description: 'Reminder scheduled for delivery',
      },
    ],
  },
};

const FinancialSummaryInput = z.object({
  period: z.enum(['7d', '30d', '90d']).default('30d'),
  includeVoiceSummary: z.boolean().default(false),
});

const FinancialSummaryOutput = z.object({
  summaryId: z.string(),
  generatedAt: z.coerce.date(),
  markdown: z.string(),
  highlights: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  cashflowDelta: z.number(),
});

export type FinancialSummaryInput = z.infer<typeof FinancialSummaryInput>;
export type FinancialSummaryOutput = z.infer<typeof FinancialSummaryOutput>;

export const generateFinancialSummaryContract: ContractSpec<
  FinancialSummaryInput,
  FinancialSummaryOutput
> = {
  meta: {
    name: 'pfo.summary.generate',
    version: 1,
    kind: 'query',
    title: 'Generate Financial Summary',
    description:
      'Runs RAG over financial documents and email threads to provide a natural-language summary with key metrics.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformFinance],
    tags: ['summary', 'ai', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  io: {
    input: FinancialSummaryInput,
    output: FinancialSummaryOutput,
  },
  telemetry: {
    events: [
      {
        name: 'pfo.summary.generated',
        description: 'Financial summary generated for a tenant',
      },
    ],
  },
};

const SyncEmailThreadsInput = z.object({
  labelIds: z.array(z.string()).default(['INBOX']),
  maxThreads: z.number().int().positive().max(500).default(50),
  syncSinceMinutes: z.number().int().positive().default(60 * 24),
});

const SyncEmailThreadsOutput = z.object({
  syncedThreads: z.number().int().nonnegative(),
  lastMessageAt: z.coerce.date().optional(),
});

export type SyncEmailThreadsInput = z.infer<typeof SyncEmailThreadsInput>;
export type SyncEmailThreadsOutput = z.infer<typeof SyncEmailThreadsOutput>;

export const syncEmailThreadsContract: ContractSpec<
  SyncEmailThreadsInput,
  SyncEmailThreadsOutput
> = {
  meta: {
    name: 'pfo.email.sync-threads',
    version: 1,
    kind: 'command',
    title: 'Sync Gmail Threads',
    description:
      'Triggers ingestion of Gmail threads into the operational knowledge space.',
    domain: 'communications',
    owners: [OwnersEnum.PlatformMessaging],
    tags: ['gmail', 'knowledge', TagsEnum.Automation],
    stability: StabilityEnum.Beta,
  },
  io: {
    input: SyncEmailThreadsInput,
    output: SyncEmailThreadsOutput,
  },
  telemetry: {
    events: [
      {
        name: 'pfo.email.synced',
        description: 'Gmail threads synced into knowledge base',
      },
    ],
  },
};

const SummaryDispatchInput = z.object({
  summaryId: z.string(),
  recipientEmail: z.string().email(),
  recipientName: z.string().optional(),
  includeVoice: z.boolean().default(false),
  voiceRecipient: z.string().optional(),
});

const SummaryDispatchOutput = z.object({
  dispatchId: z.string(),
  emailSent: z.boolean(),
  voiceUrl: z.string().optional(),
});

export type SummaryDispatchInput = z.infer<typeof SummaryDispatchInput>;
export type SummaryDispatchOutput = z.infer<typeof SummaryDispatchOutput>;

export const dispatchFinancialSummaryContract: ContractSpec<
  SummaryDispatchInput,
  SummaryDispatchOutput
> = {
  meta: {
    name: 'pfo.summary.dispatch',
    version: 1,
    kind: 'command',
    title: 'Dispatch Financial Summary',
    description:
      'Delivers the generated summary via email and optionally synthesises a voice note.',
    domain: 'finance',
    owners: [OwnersEnum.PlatformMessaging],
    tags: ['summary', 'communications', TagsEnum.Automation],
    stability: StabilityEnum.Experimental,
  },
  io: {
    input: SummaryDispatchInput,
    output: SummaryDispatchOutput,
  },
  policy: {
    auth: {
      scopes: ['summary:dispatch'],
    },
  },
  telemetry: {
    events: [
      {
        name: 'pfo.summary.dispatched',
        description: 'Financial summary delivered to designated recipients',
      },
    ],
  },
};

export const pocketFamilyOfficeContracts: Record<
  string,
  ContractSpec<any, any>
> = {
  'pfo.documents.upload': uploadDocumentContract,
  'pfo.reminders.schedule-payment': schedulePaymentReminderContract,
  'pfo.summary.generate': generateFinancialSummaryContract,
  'pfo.summary.dispatch': dispatchFinancialSummaryContract,
  'pfo.email.sync-threads': syncEmailThreadsContract,
};

