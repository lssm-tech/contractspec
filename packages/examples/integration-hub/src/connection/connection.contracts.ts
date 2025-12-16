import { defineCommand } from '@lssm/lib.contracts/spec';
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
    name: 'integration.connection.create',
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
        name: 'integration.connection.created',
        version: 1,
        when: 'Connection created',
        payload: ConnectionModel,
      },
    ],
    audit: ['integration.connection.created'],
  },
});
