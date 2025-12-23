import type { PresentationSpec } from '@lssm/lib.contracts';
import { ConnectionModel } from './connection.schema';

export const ConnectionListPresentation: PresentationSpec = {
  meta: {
    name: 'integration.connection.list',
    version: 1,
    description: 'List of integration connections',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'connection', 'list'],
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
    name: 'integration.connection.setup',
    version: 1,
    description: 'Setup wizard for creating integration connections',
    domain: 'integration',
    owners: ['@integration-team'],
    tags: ['integration', 'connection', 'setup'],
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
