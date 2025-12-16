import type { FeatureModuleSpec } from '@lssm/lib.contracts';

export const ServiceBusinessFeature: FeatureModuleSpec = {
  meta: {
    key: 'service-business-os',
    title: 'Service Business OS',
    description:
      'Quotes → jobs → invoices → payments for field services and agencies.',
    domain: 'services',
    owners: ['service-os'],
    tags: ['services', 'quotes', 'jobs', 'invoices', 'payments'],
    stability: 'experimental',
  },
  operations: [
    { name: 'service.client.create', version: 1 },
    { name: 'service.quote.create', version: 1 },
    { name: 'service.quote.accept', version: 1 },
    { name: 'service.job.schedule', version: 1 },
    { name: 'service.job.complete', version: 1 },
    { name: 'service.invoice.issue', version: 1 },
    { name: 'service.payment.record', version: 1 },
    { name: 'service.job.list', version: 1 },
  ],
  events: [
    { name: 'service.quote.sent', version: 1 },
    { name: 'service.quote.accepted', version: 1 },
    { name: 'service.job.scheduled', version: 1 },
    { name: 'service.job.completed', version: 1 },
    { name: 'service.invoice.issued', version: 1 },
    { name: 'service.payment.received', version: 1 },
  ],
  presentations: [
    { name: 'service-business-os.dashboard', version: 1 },
    { name: 'service-business-os.client.list', version: 1 },
    { name: 'service-business-os.quote.list', version: 1 },
    { name: 'service-business-os.quote.detail', version: 1 },
    { name: 'service-business-os.job.board', version: 1 },
    { name: 'service-business-os.invoice.list', version: 1 },
    { name: 'service-business-os.payment.list', version: 1 },
  ],
  presentationsTargets: [
    {
      name: 'service-business-os.dashboard',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'service-business-os.quote.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
    {
      name: 'service-business-os.invoice.list',
      version: 1,
      targets: ['react', 'markdown'],
    },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: 1 },
      { key: 'audit-trail', version: 1 },
      { key: 'notifications', version: 1 },
      { key: 'files', version: 1 },
    ],
    provides: [
      { key: 'quotes', version: 1 },
      { key: 'jobs', version: 1 },
      { key: 'invoices', version: 1 },
    ],
  },
};
