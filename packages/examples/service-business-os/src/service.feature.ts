import { defineFeature } from '@contractspec/lib.contracts';

export const ServiceBusinessFeature = defineFeature({
  meta: {
    key: 'service-business-os',
    title: 'Service Business OS',
    description:
      'Quotes → jobs → invoices → payments for field services and agencies.',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'quotes', 'jobs', 'invoices', 'payments'],
    stability: 'experimental',
    version: '1.0.0',
  },
  operations: [
    { key: 'service.client.create', version: '1.0.0' },
    { key: 'service.quote.create', version: '1.0.0' },
    { key: 'service.quote.accept', version: '1.0.0' },
    { key: 'service.job.schedule', version: '1.0.0' },
    { key: 'service.job.complete', version: '1.0.0' },
    { key: 'service.invoice.issue', version: '1.0.0' },
    { key: 'service.payment.record', version: '1.0.0' },
    { key: 'service.job.list', version: '1.0.0' },
  ],
  events: [
    { key: 'service.quote.sent', version: '1.0.0' },
    { key: 'service.quote.accepted', version: '1.0.0' },
    { key: 'service.job.scheduled', version: '1.0.0' },
    { key: 'service.job.completed', version: '1.0.0' },
    { key: 'service.invoice.issued', version: '1.0.0' },
    { key: 'service.payment.received', version: '1.0.0' },
  ],
  presentations: [
    { key: 'service-business-os.dashboard', version: '1.0.0' },
    { key: 'service-business-os.client.list', version: '1.0.0' },
    { key: 'service-business-os.quote.list', version: '1.0.0' },
    { key: 'service-business-os.quote.detail', version: '1.0.0' },
    { key: 'service-business-os.job.board', version: '1.0.0' },
    { key: 'service-business-os.invoice.list', version: '1.0.0' },
    { key: 'service-business-os.payment.list', version: '1.0.0' },
  ],
  presentationsTargets: [
    {
      key: 'service-business-os.dashboard',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'service-business-os.quote.list',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
    {
      key: 'service-business-os.invoice.list',
      version: '1.0.0',
      targets: ['react', 'markdown'],
    },
  ],
  capabilities: {
    requires: [
      { key: 'identity', version: '1.0.0' },
      { key: 'audit-trail', version: '1.0.0' },
      { key: 'notifications', version: '1.0.0' },
      { key: 'files', version: '1.0.0' },
    ],
    provides: [
      { key: 'quotes', version: '1.0.0' },
      { key: 'jobs', version: '1.0.0' },
      { key: 'invoices', version: '1.0.0' },
    ],
  },
});
