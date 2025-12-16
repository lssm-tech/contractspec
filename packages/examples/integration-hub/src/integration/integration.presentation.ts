import type { PresentationDescriptorV2 } from '@lssm/lib.contracts';
import { IntegrationModel } from './integration.schema';

export const IntegrationListPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.list',
    version: 1,
    description: 'List of available integrations',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'list'],
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
};

export const IntegrationDetailPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.detail',
    version: 1,
    description: 'Detailed view of an integration',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'detail'],
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
};

export const IntegrationHealthPresentation: PresentationDescriptorV2 = {
  meta: {
    name: 'integration.health',
    version: 1,
    description: 'Integration health monitoring dashboard',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'health', 'monitoring'],
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
};

