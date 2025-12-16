import { defineCommand } from '@lssm/lib.contracts/spec';
import { IntegrationModel, CreateIntegrationInputModel } from './integration.schema';

const OWNERS = ['@example.integration-hub'] as const;

/**
 * Create a new integration.
 */
export const CreateIntegrationContract = defineCommand({
  meta: {
    name: 'integration.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['integration', 'create'],
    description: 'Create a new integration.',
    goal: 'Allow users to set up integrations with external systems.',
    context: 'Integration setup.',
  },
  io: { input: CreateIntegrationInputModel, output: IntegrationModel },
  policy: { auth: 'user' },
  sideEffects: {
    emits: [
      {
        name: 'integration.created',
        version: 1,
        when: 'Integration created',
        payload: IntegrationModel,
      },
    ],
    audit: ['integration.created'],
  },
});


