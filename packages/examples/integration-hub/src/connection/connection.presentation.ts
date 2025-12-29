import type { PresentationSpec } from '@contractspec/lib.contracts';
import { StabilityEnum } from '@contractspec/lib.contracts';
import { ConnectionModel } from './connection.schema';

export const ConnectionListPresentation: PresentationSpec = {
  meta: {
    key: 'integration.connection.list',
    version: '1.0.0',
    title: 'Connection List',
    description: 'List of integration connections',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'connection', 'list'],
    stability: StabilityEnum.Experimental,
    goal: 'Provide an overview of all established integration connections.',
    context: 'The primary management view for integration hubs.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ConnectionList',
    props: ConnectionModel,
  },
  targets: ['react', 'markdown'],
  policy: {
    flags: ['integration.enabled'],
  },
};

export const ConnectionSetupPresentation: PresentationSpec = {
  meta: {
    key: 'integration.connection.setup',
    version: '1.0.0',
    title: 'Connection Setup',
    description: 'Setup wizard for creating integration connections',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'connection', 'setup'],
    stability: StabilityEnum.Experimental,
    goal: 'Guide users through the multi-step process of connecting to a new integration.',
    context: 'The onboarding flow for new integrations.',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'ConnectionSetup',
    props: ConnectionModel,
  },
  targets: ['react'],
  policy: {
    flags: ['integration.enabled'],
  },
};
