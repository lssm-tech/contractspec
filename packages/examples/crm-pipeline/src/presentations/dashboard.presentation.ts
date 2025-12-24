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
    name: 'crm.dashboard',
    version: 1,
    title: 'CRM Dashboard',
    description:
      'Main CRM dashboard with pipeline overview, deal stats, and activities',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['dashboard', 'overview'],
    stability: StabilityEnum.Experimental,
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
    name: 'crm.pipeline.metrics',
    version: 1,
    title: 'Pipeline Metrics',
    description: 'Pipeline metrics and forecasting view',
    domain: 'crm-pipeline',
    owners: ['@crm-team'],
    tags: ['pipeline', 'metrics', 'forecast'],
    stability: StabilityEnum.Experimental,
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
