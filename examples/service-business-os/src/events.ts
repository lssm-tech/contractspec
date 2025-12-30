import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '@contractspec/lib.contracts';

const QuoteEventPayload = defineSchemaModel({
  name: 'QuoteEventPayload',
  description: 'Event payload for quote lifecycle',
  fields: {
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const JobEventPayload = defineSchemaModel({
  name: 'JobEventPayload',
  description: 'Event payload for job lifecycle',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const InvoiceEventPayload = defineSchemaModel({
  name: 'InvoiceEventPayload',
  description: 'Event payload for invoices',
  fields: {
    invoiceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    occurredAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const PaymentEventPayload = defineSchemaModel({
  name: 'PaymentEventPayload',
  description: 'Event payload for payments',
  fields: {
    paymentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invoiceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    method: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const QuoteSentEvent = defineEvent({
  meta: {
    key: 'service.quote.sent',
    version: '1.0.0',
    description: 'A quote was sent to the client.',
    stability: 'stable',
    owners: ['@service-os'],
    tags: ['service', 'quote', 'sent'],
  },
  payload: QuoteEventPayload,
});

export const QuoteAcceptedEvent = defineEvent({
  meta: {
    key: 'service.quote.accepted',
    version: '1.0.0',
    description: 'A quote was accepted.',
    stability: 'stable',
    owners: ['@service-os'],
    tags: ['service', 'quote', 'accepted'],
  },
  payload: QuoteEventPayload,
});

export const JobScheduledEvent = defineEvent({
  meta: {
    key: 'service.job.scheduled',
    version: '1.0.0',
    description: 'A job was scheduled.',
    stability: 'stable',
    owners: ['@service-os'],
    tags: ['service', 'job', 'scheduled'],
  },
  payload: JobEventPayload,
});

export const JobCompletedEvent = defineEvent({
  meta: {
    key: 'service.job.completed',
    version: '1.0.0',
    description: 'A job was completed.',
    stability: 'stable',
    owners: ['@service-os'],
    tags: ['service', 'job', 'completed'],
  },
  payload: JobEventPayload,
});

export const InvoiceIssuedEvent = defineEvent({
  meta: {
    key: 'service.invoice.issued',
    version: '1.0.0',
    description: 'An invoice was issued.',
    stability: 'stable',
    owners: ['@service-os'],
    tags: ['service', 'invoice', 'issued'],
  },
  payload: InvoiceEventPayload,
});

export const PaymentReceivedEvent = defineEvent({
  meta: {
    key: 'service.payment.received',
    version: '1.0.0',
    description: 'A payment was recorded.',
    stability: 'stable',
    owners: ['@service-os'],
    tags: ['service', 'payment', 'received'],
  },
  payload: PaymentEventPayload,
});

export const ServiceBusinessEvents = {
  QuoteSentEvent,
  QuoteAcceptedEvent,
  JobScheduledEvent,
  JobCompletedEvent,
  InvoiceIssuedEvent,
  PaymentReceivedEvent,
};
