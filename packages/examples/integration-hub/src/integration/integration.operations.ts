import { defineCommand } from '@contractspec/lib.contracts-spec/operations';
import {
  CreateIntegrationInputModel,
  IntegrationModel,
} from './integration.schema';

/**
 * Create a new integration.
 */
export const CreateIntegrationContract = defineCommand({
  meta: {
    key: 'integration.create',
    version: '1.0.0',
    stability: 'stable',
    owners: ['@example.integration-hub'],
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
        key: 'integration.created',
        version: '1.0.0',
        when: 'Integration created',
        payload: IntegrationModel,
      },
    ],
    audit: ['integration.created'],
  },
  acceptance: {
    scenarios: [
      {
        key: 'create-integration-happy-path',
        given: ['User is admin'],
        when: ['User defines new integration type'],
        then: [
          'Integration definition is created',
          'IntegrationCreated event is emitted',
        ],
      },
    ],
    examples: [
      {
        key: 'create-slack',
        input: { name: 'Slack', category: 'communication', authType: 'oauth2' },
        output: { id: 'slack', status: 'active' },
      },
    ],
  },
});
