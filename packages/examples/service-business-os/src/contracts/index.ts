import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';
import { defineCommand, defineQuery } from '@lssm/lib.contracts';

const OWNERS = ['examples.service-business-os'] as const;

// Models
export const ClientModel = defineSchemaModel({
  name: 'Client',
  description: 'Client profile',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    contactEmail: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    phone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const QuoteModel = defineSchemaModel({
  name: 'Quote',
  description: 'Quote/proposal',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    validUntil: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const JobModel = defineSchemaModel({
  name: 'Job',
  description: 'Scheduled job',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    assignedTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const InvoiceModel = defineSchemaModel({
  name: 'Invoice',
  description: 'Invoice issued for a job',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invoiceNumber: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    dueDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    issuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    paidAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

export const PaymentModel = defineSchemaModel({
  name: 'Payment',
  description: 'Payment applied to invoice',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invoiceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    method: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reference: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

// Inputs
const CreateClientInput = defineSchemaModel({
  name: 'CreateClientInput',
  description: 'Input for creating a client',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    contactEmail: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    phone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSON(), isOptional: true },
  },
});

const CreateQuoteInput = defineSchemaModel({
  name: 'CreateQuoteInput',
  description: 'Input for creating a quote',
  fields: {
    clientId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    validUntil: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ownerId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const AcceptQuoteInput = defineSchemaModel({
  name: 'AcceptQuoteInput',
  description: 'Input for accepting a quote',
  fields: {
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    acceptedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const ScheduleJobInput = defineSchemaModel({
  name: 'ScheduleJobInput',
  description: 'Input for scheduling a job',
  fields: {
    quoteId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scheduledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    assignedTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    location: { type: ScalarTypeEnum.JSON(), isOptional: true },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const CompleteJobInput = defineSchemaModel({
  name: 'CompleteJobInput',
  description: 'Input for completing a job',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const IssueInvoiceInput = defineSchemaModel({
  name: 'IssueInvoiceInput',
  description: 'Input for issuing an invoice',
  fields: {
    jobId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    invoiceNumber: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    dueDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const RecordPaymentInput = defineSchemaModel({
  name: 'RecordPaymentInput',
  description: 'Input for recording a payment',
  fields: {
    invoiceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    method: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    reference: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    receivedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const ListJobsInput = defineSchemaModel({
  name: 'ListJobsInput',
  description: 'Filter for listing jobs',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    assignedTo: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

// Contracts
export const CreateClientContract = defineCommand({
  meta: {
    name: 'service.client.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'client', 'create'],
    description: 'Create a new client.',
    goal: 'Add a customer to the roster.',
    context: 'Used during onboarding or intake.',
  },
  io: {
    input: CreateClientInput,
    output: ClientModel,
  },
  policy: { auth: 'user' },
});

export const CreateQuoteContract = defineCommand({
  meta: {
    name: 'service.quote.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'quote', 'create'],
    description: 'Create a quote for a client.',
    goal: 'Propose work and pricing.',
    context: 'Sales/estimation.',
  },
  io: {
    input: CreateQuoteInput,
    output: QuoteModel,
  },
  policy: { auth: 'user' },
});

export const AcceptQuoteContract = defineCommand({
  meta: {
    name: 'service.quote.accept',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'quote', 'accept'],
    description: 'Accept a quote.',
    goal: 'Move quote into delivery pipeline.',
    context: 'Client approval.',
  },
  io: {
    input: AcceptQuoteInput,
    output: QuoteModel,
    errors: {
      QUOTE_NOT_FOUND: {
        when: 'Quote not found',
        description: 'Quote not found',
        http: 404,
      },
      INVALID_STATUS: {
        when: 'The quote my await acceptance',
        description: 'Quote must be SENT to accept',
        http: 409,
      },
    },
  },
  policy: { auth: 'user' },
});

export const ScheduleJobContract = defineCommand({
  meta: {
    name: 'service.job.schedule',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'job', 'schedule'],
    description: 'Schedule a job after quote acceptance.',
    goal: 'Plan service execution.',
    context: 'Ops scheduling.',
  },
  io: {
    input: ScheduleJobInput,
    output: JobModel,
  },
  policy: { auth: 'user' },
});

export const CompleteJobContract = defineCommand({
  meta: {
    name: 'service.job.complete',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'job', 'complete'],
    description: 'Mark a job as completed.',
    goal: 'Signal readiness for invoicing.',
    context: 'Technician completion.',
  },
  io: {
    input: CompleteJobInput,
    output: JobModel,
    errors: {
      JOB_NOT_FOUND: {
        when: 'Job not found',
        description: 'Job not found',
        http: 404,
      },
      INVALID_STATUS: {
        when: 'Job must be in progress',
        description: 'Job must be in progress',
        http: 409,
      },
    },
  },
  policy: { auth: 'user' },
});

export const IssueInvoiceContract = defineCommand({
  meta: {
    name: 'service.invoice.issue',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'invoice', 'issue'],
    description: 'Issue an invoice for a job.',
    goal: 'Bill the client.',
    context: 'Post-completion billing.',
  },
  io: {
    input: IssueInvoiceInput,
    output: InvoiceModel,
  },
  policy: { auth: 'user' },
});

export const RecordPaymentContract = defineCommand({
  meta: {
    name: 'service.payment.record',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'payment', 'record'],
    description: 'Record a payment for an invoice.',
    goal: 'Track AR and cash flow.',
    context: 'Finance ops.',
  },
  io: {
    input: RecordPaymentInput,
    output: PaymentModel,
  },
  policy: { auth: 'user' },
});

export const ListJobsContract = defineQuery({
  meta: {
    name: 'service.job.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-os', 'job', 'list'],
    description: 'List jobs with filters.',
    goal: 'Operational schedule view.',
    context: 'Ops dashboard.',
  },
  io: {
    input: ListJobsInput,
    output: defineSchemaModel({
      name: 'ListJobsOutput',
      description: 'Jobs with total count',
      fields: {
        jobs: { type: JobModel, isArray: true, isOptional: false },
        total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
      },
    }),
  },
  policy: { auth: 'user' },
});
