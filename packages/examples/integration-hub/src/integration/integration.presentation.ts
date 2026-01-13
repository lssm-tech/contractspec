import { definePresentation, StabilityEnum } from '@contractspec/lib.contracts';
import { IntegrationModel } from './integration.schema';

export const IntegrationListPresentation = definePresentation({
  meta: {
    key: 'integration.list',
    version: '1.0.0',
    title: 'Integration List',
    description: 'List of available integrations',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Show users available integrations they can connect to.',
    context: 'The marketplace of integrations within the hub.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'IntegrationList',
    props: IntegrationModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.enabled'],
  },
});

export const IntegrationDetailPresentation = definePresentation({
  meta: {
    key: 'integration.detail',
    version: '1.0.0',
    title: 'Integration Details',
    description: 'Detailed view of an integration',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'detail'],
    stability: StabilityEnum.Experimental,
    goal: 'Show capabilities and documentation for a specific integration.',
    context: 'Integration showcase and support page.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'IntegrationDetail',
    props: IntegrationModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.enabled'],
  },
});

export const IntegrationHealthPresentation = definePresentation({
  meta: {
    key: 'integration.health',
    version: '1.0.0',
    title: 'Integration Health',
    description: 'Integration health monitoring dashboard',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'health', 'monitoring'],
    stability: StabilityEnum.Experimental,
    goal: 'Monitor connectivity and error rates for active integrations.',
    context: 'Operations dashboard for integration hub health.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'IntegrationHealth',
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.monitoring.enabled'],
  },
});
