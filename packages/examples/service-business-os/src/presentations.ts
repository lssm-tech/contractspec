import type { PresentationSpec } from '@lssm/lib.contracts';

export const ServiceDashboardPresentation: PresentationSpec = {
  meta: {
    name: 'service-business-os.dashboard',
    version: 1,
    description: 'Service business dashboard with overview metrics',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'dashboard'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ServiceDashboard',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['service.dashboard.enabled'],
  },
};

export const ClientListPresentation: PresentationSpec = {
  meta: {
    name: 'service-business-os.client.list',
    version: 1,
    description: 'List of service clients',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'clients', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ClientList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['service.clients.enabled'],
  },
};

export const QuoteListPresentation: PresentationSpec = {
  meta: {
    name: 'service-business-os.quote.list',
    version: 1,
    description: 'List of quotes with status',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'quotes', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'QuoteList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['service.quotes.enabled'],
  },
};

export const QuoteDetailPresentation: PresentationSpec = {
  meta: {
    name: 'service-business-os.quote.detail',
    version: 1,
    description: 'Quote detail with line items',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'quote', 'detail'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'QuoteDetail',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['service.quotes.enabled'],
  },
};

export const JobBoardPresentation: PresentationSpec = {
  meta: {
    name: 'service-business-os.job.board',
    version: 1,
    description: 'Job board with kanban view',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'jobs', 'board', 'kanban'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'JobBoard',
  },
  targets: ['react'],
  policy: {
    flags: ['service.jobs.enabled'],
  },
};

export const InvoiceListPresentation: PresentationSpec = {
  meta: {
    name: 'service-business-os.invoice.list',
    version: 1,
    description: 'List of invoices with payment status',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'invoices', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'InvoiceList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['service.invoices.enabled'],
  },
};

export const PaymentListPresentation: PresentationSpec = {
  meta: {
    name: 'service-business-os.payment.list',
    version: 1,
    description: 'List of payments received',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'payments', 'list'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'PaymentList',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['service.payments.enabled'],
  },
};
