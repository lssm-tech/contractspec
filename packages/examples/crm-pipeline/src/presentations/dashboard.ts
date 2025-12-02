/**
 * CRM Dashboard Presentation Descriptor
 */
import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';

/**
 * Main CRM dashboard presentation.
 */
export const CrmDashboardPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'crm.dashboard',
    version: 1,
    description:
      'Main CRM dashboard with pipeline overview, deal stats, and activities',
    domain: 'crm-pipeline',
    owners: ['crm-team'],
    tags: ['dashboard', 'overview'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'CrmDashboard',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['crm.enabled'],
  },
};

/**
 * Pipeline metrics presentation.
 */
export const PipelineMetricsPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'crm.pipeline.metrics',
    version: 1,
    description: 'Pipeline metrics and forecasting view',
    domain: 'crm-pipeline',
    owners: ['crm-team'],
    tags: ['pipeline', 'metrics', 'forecast'],
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'PipelineMetricsView',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['crm.metrics.enabled'],
  },
};
