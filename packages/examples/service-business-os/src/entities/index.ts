import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

const schema = 'lssm_service_os';

export const QuoteStatusEnum = defineEntityEnum({
  name: 'QuoteStatus',
  schema,
  values: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'] as const,
  description: 'Lifecycle for quotes/proposals.',
});

export const JobStatusEnum = defineEntityEnum({
  name: 'JobStatus',
  schema,
  values: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const,
  description: 'Lifecycle for service jobs/interventions.',
});

export const InvoiceStatusEnum = defineEntityEnum({
  name: 'InvoiceStatus',
  schema,
  values: ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'] as const,
  description: 'Lifecycle for invoices.',
});

export const PaymentMethodEnum = defineEntityEnum({
  name: 'PaymentMethod',
  schema,
  values: ['CARD', 'BANK_TRANSFER', 'CASH', 'CHECK'] as const,
  description: 'Payment method used.',
});

export const ClientEntity = defineEntity({
  name: 'Client',
  description: 'Customer organization or individual.',
  schema,
  map: 'client',
  fields: {
    id: field.id({ description: 'Unique client identifier' }),
    name: field.string({ description: 'Client display name' }),
    contactEmail: field.string({
      description: 'Primary contact email',
      isOptional: true,
    }),
    phone: field.string({ description: 'Primary phone', isOptional: true }),
    address: field.json({ description: 'Mailing address', isOptional: true }),
    industry: field.string({
      description: 'Industry/vertical',
      isOptional: true,
    }),
    orgId: field.string({ description: 'Owning organization' }),
    ownerId: field.string({ description: 'Account owner' }),
    metadata: field.json({
      description: 'Additional metadata',
      isOptional: true,
    }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    quotes: field.hasMany('Quote'),
    jobs: field.hasMany('Job'),
  },
  indexes: [index.on(['orgId']), index.on(['ownerId']), index.on(['name'])],
});

export const QuoteEntity = defineEntity({
  name: 'Quote',
  description: 'Proposal/quote for a job.',
  schema,
  map: 'quote',
  fields: {
    id: field.id({ description: 'Unique quote identifier' }),
    clientId: field.foreignKey({ description: 'Client receiving quote' }),
    title: field.string({ description: 'Quote title' }),
    description: field.string({
      description: 'Work summary',
      isOptional: true,
    }),
    amount: field.float({ description: 'Total quoted amount' }),
    currency: field.string({ description: 'Currency code', default: '"USD"' }),
    status: field.enum('QuoteStatus', {
      description: 'Quote status',
      default: 'DRAFT',
    }),
    validUntil: field.dateTime({
      description: 'Expiration date',
      isOptional: true,
    }),
    terms: field.string({
      description: 'Payment/engagement terms',
      isOptional: true,
    }),
    orgId: field.string({ description: 'Owning organization' }),
    ownerId: field.string({ description: 'Account owner' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    client: field.belongsTo('Client', ['clientId'], ['id'], {
      onDelete: 'Cascade',
    }),
    jobs: field.hasMany('Job'),
  },
  enums: [QuoteStatusEnum],
  indexes: [
    index.on(['orgId', 'status']),
    index.on(['clientId']),
    index.on(['validUntil']),
  ],
});

export const JobEntity = defineEntity({
  name: 'Job',
  description: 'Service job/intervention derived from an accepted quote.',
  schema,
  map: 'job',
  fields: {
    id: field.id({ description: 'Unique job identifier' }),
    quoteId: field.foreignKey({ description: 'Source quote' }),
    clientId: field.foreignKey({ description: 'Client receiving service' }),
    title: field.string({ description: 'Job title' }),
    status: field.enum('JobStatus', {
      description: 'Job status',
      default: 'SCHEDULED',
    }),
    scheduledAt: field.dateTime({
      description: 'Scheduled start date/time',
      isOptional: true,
    }),
    completedAt: field.dateTime({
      description: 'Completion timestamp',
      isOptional: true,
    }),
    assignedTo: field.string({
      description: 'Assignee/technician user ID',
      isOptional: true,
    }),
    location: field.json({ description: 'Location details', isOptional: true }),
    notes: field.string({ description: 'Internal notes', isOptional: true }),
    orgId: field.string({ description: 'Owning organization' }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    quote: field.belongsTo('Quote', ['quoteId'], ['id'], {
      onDelete: 'SetNull',
    }),
    client: field.belongsTo('Client', ['clientId'], ['id'], {
      onDelete: 'Cascade',
    }),
    invoices: field.hasMany('Invoice'),
  },
  enums: [JobStatusEnum],
  indexes: [
    index.on(['orgId', 'status']),
    index.on(['clientId']),
    index.on(['assignedTo', 'status']),
    index.on(['scheduledAt']),
  ],
});

export const InvoiceEntity = defineEntity({
  name: 'Invoice',
  description: 'Invoice issued for a completed job.',
  schema,
  map: 'invoice',
  fields: {
    id: field.id({ description: 'Unique invoice identifier' }),
    jobId: field.foreignKey({ description: 'Related job' }),
    invoiceNumber: field.string({
      description: 'Invoice number',
      isUnique: true,
    }),
    amount: field.decimal({ description: 'Invoice amount' }),
    currency: field.string({ description: 'Currency code', default: '"USD"' }),
    status: field.enum('InvoiceStatus', {
      description: 'Invoice status',
      default: 'DRAFT',
    }),
    dueDate: field.dateTime({ description: 'Due date', isOptional: true }),
    issuedAt: field.dateTime({
      description: 'Issued timestamp',
      isOptional: true,
    }),
    paidAt: field.dateTime({ description: 'Paid timestamp', isOptional: true }),
    orgId: field.string({ description: 'Owning organization' }),
    notes: field.string({ description: 'Invoice notes', isOptional: true }),
    metadata: field.json({ description: 'Metadata', isOptional: true }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    job: field.belongsTo('Job', ['jobId'], ['id'], { onDelete: 'Cascade' }),
    payments: field.hasMany('Payment'),
  },
  enums: [InvoiceStatusEnum],
  indexes: [
    index.on(['invoiceNumber']),
    index.on(['orgId', 'status']),
    index.on(['dueDate']),
  ],
});

export const PaymentEntity = defineEntity({
  name: 'Payment',
  description: 'Payment received for an invoice.',
  schema,
  map: 'payment',
  fields: {
    id: field.id({ description: 'Unique payment identifier' }),
    invoiceId: field.foreignKey({ description: 'Invoice being paid' }),
    amount: field.decimal({ description: 'Payment amount' }),
    currency: field.string({ description: 'Currency code', default: '"USD"' }),
    method: field.enum('PaymentMethod', { description: 'Payment method' }),
    reference: field.string({
      description: 'Payment reference/transaction ID',
      isOptional: true,
    }),
    receivedAt: field.dateTime({ description: 'When payment was received' }),
    orgId: field.string({ description: 'Owning organization' }),
    createdAt: field.createdAt(),
    invoice: field.belongsTo('Invoice', ['invoiceId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  enums: [PaymentMethodEnum],
  indexes: [
    index.on(['invoiceId']),
    index.on(['orgId']),
    index.on(['receivedAt']),
  ],
});

export const serviceBusinessEntities = [
  ClientEntity,
  QuoteEntity,
  JobEntity,
  InvoiceEntity,
  PaymentEntity,
];

export const serviceBusinessSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/example.service-business-os',
  // schema,
  entities: serviceBusinessEntities,
  enums: [QuoteStatusEnum, JobStatusEnum, InvoiceStatusEnum, PaymentMethodEnum],
};
