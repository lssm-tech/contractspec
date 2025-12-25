/**
 * CRM Dashboard Presentation Descriptor
 */
import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';

/**
 * Main CRM dashboard presentation.
 */
export const CrmDashboardPresentation: PresentationSpec = {
  meta: {
    key: 'crm.dashboard',
    version: 1,
    title: 'CRM Dashboard',
    description:
      'Main CRM dashboard with pipeline overview, deal stats, and activities',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['dashboard', 'overview'],
    stability: StabilityEnum.Experimental,
    goal: 'Provide a high-level overview of CRM performance and active deals.',
    context: 'The landing page for CRM users.',
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
export const PipelineMetricsPresentation: PresentationSpec = {
  meta: {
    key: 'crm.pipeline.metrics',
    version: 1,
    title: 'Pipeline Metrics',
    description: 'Pipeline metrics and forecasting view',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['pipeline', 'metrics', 'forecast'],
    stability: StabilityEnum.Experimental,
    goal: 'Track pipeline health and sales forecasts.',
    context: 'Data-intensive widget for sales managers.',
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
