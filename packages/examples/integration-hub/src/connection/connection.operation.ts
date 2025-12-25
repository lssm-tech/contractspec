import { defineCommand } from '@lssm/lib.contracts/operations';
import {
  ConnectionModel,
  CreateConnectionInputModel,
} from './connection.schema';

const OWNERS = ['@example.integration-hub'] as const;

/**
 * Create a connection to an external system.
 */
export const CreateConnectionContract = defineCommand({
  meta: {
    key: 'integration.connection.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'connection', 'create'],
    description: 'Create a connection to an external system.',
    goal: 'Authenticate with external systems.',
    context: 'Connection setup.',
  },
  io: { input: CreateConnectionInputModel, output: ConnectionModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        key: 'integration.connection.created',
        version: 1,
        when: 'Connection created',
        payload: ConnectionModel,
      },
    ],
    audit: ['integration.connection.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-connection-happy-path',
        given: ['User is authenticated'],
        when: ['User creates connection with valid credentials'],
        then: ['Connection is created', 'ConnectionCreated event is emitted'],
      },
    ],
    examples: [
      {
        key: 'connect-crm',
        input: { name: 'Salesforce Prod', integrationId: 'salesforce', credentials: { clientId: 'xxx' } },
        output: { id: 'conn-123', status: 'connected', connectedAt: '2025-01-01T12:00:00Z' },
      },
    ],
  },
});
