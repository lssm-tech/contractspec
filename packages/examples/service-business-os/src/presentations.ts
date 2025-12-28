import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';

export const ServiceDashboardPresentation: PresentationSpec = {
  meta: {
    key: 'service-business-os.dashboard',
    version: 1,
    title: 'Service Dashboard',
    description: 'Service business dashboard with overview metrics',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'dashboard'],
    stability: StabilityEnum.Experimental,
    goal: 'Overview of service business metrics',
    context: 'Service home page',
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
    key: 'service-business-os.client.list',
    version: 1,
    title: 'Client List',
    description: 'List of service clients',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'clients', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Browse and manage service clients',
    context: 'Client management',
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
    key: 'service-business-os.quote.list',
    version: 1,
    title: 'Quote List',
    description: 'List of quotes with status',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'quotes', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Track and manage quotes',
    context: 'Quote management',
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
    key: 'service-business-os.quote.detail',
    version: 1,
    title: 'Quote Details',
    description: 'Quote detail with line items',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'quote', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'View and edit quote details',
    context: 'Quote inspection',
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
    key: 'service-business-os.job.board',
    version: 1,
    title: 'Job Board',
    description: 'Job board with kanban view',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'jobs', 'board', 'kanban'],
    stability: StabilityEnum.Experimental,
    goal: 'Visual job management',
    context: 'Field service scheduling',
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
    key: 'service-business-os.invoice.list',
    version: 1,
    title: 'Invoice List',
    description: 'List of invoices with payment status',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'invoices', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Track invoices and payments',
    context: 'Billing management',
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
    key: 'service-business-os.payment.list',
    version: 1,
    title: 'Payment List',
    description: 'List of payments received',
    domain: 'services',
    owners: ['@service-os'],
    tags: ['services', 'payments', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Track received payments',
    context: 'Payment reconciliation',
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
