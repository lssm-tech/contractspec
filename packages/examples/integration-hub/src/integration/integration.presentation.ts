import type { PresentationSpec } from '@lssm/lib.contracts';
import { StabilityEnum } from '@lssm/lib.contracts';
import { IntegrationModel } from './integration.schema';

export const IntegrationListPresentation: PresentationSpec = {
  meta: {
    name: 'integration.list',
    version: 1,
    title: 'Integration List',
    description: 'List of available integrations',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'list'],
    stability: StabilityEnum.Experimental,
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

export const IntegrationDetailPresentation: PresentationSpec = {
  meta: {
    name: 'integration.detail',
    version: 1,
    title: 'Integration Details',
    description: 'Detailed view of an integration',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'detail'],
    stability: StabilityEnum.Experimental,
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

export const IntegrationHealthPresentation: PresentationSpec = {
  meta: {
    name: 'integration.health',
    version: 1,
    title: 'Integration Health',
    description: 'Integration health monitoring dashboard',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'health', 'monitoring'],
    stability: StabilityEnum.Experimental,
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
