import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineEvent } from '@lssm/lib.contracts';

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
  name: 'service.quote.sent',
  version: 1,
  description: 'A quote was sent to the client.',
  payload: QuoteEventPayload,
});

export const QuoteAcceptedEvent = defineEvent({
  name: 'service.quote.accepted',
  version: 1,
  description: 'A quote was accepted.',
  payload: QuoteEventPayload,
});

export const JobScheduledEvent = defineEvent({
  name: 'service.job.scheduled',
  version: 1,
  description: 'A job was scheduled.',
  payload: JobEventPayload,
});

export const JobCompletedEvent = defineEvent({
  name: 'service.job.completed',
  version: 1,
  description: 'A job was completed.',
  payload: JobEventPayload,
});

export const InvoiceIssuedEvent = defineEvent({
  name: 'service.invoice.issued',
  version: 1,
  description: 'An invoice was issued.',
  payload: InvoiceEventPayload,
});

export const PaymentReceivedEvent = defineEvent({
  name: 'service.payment.received',
  version: 1,
  description: 'A payment was recorded.',
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
