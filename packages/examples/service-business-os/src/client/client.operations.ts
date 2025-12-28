import { defineCommand } from '@contractspec/lib.contracts';
import { ClientModel, CreateClientInputModel } from './client.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Create a new client.
 */
export const CreateClientContract = defineCommand({
  meta: {
    key: 'service.client.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'client', 'create'],
    description: 'Create a new client.',
    goal: 'Onboard clients.',
    context: 'CRM.',
  },
  io: {
    input: CreateClientInputModel,
    output: ClientModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'create-client-happy-path',
        given: ['User is authenticated'],
        when: ['User creates a new client'],
        then: ['Client is created'],
      },
    ],
    examples: [
      {
        key: 'create-basic',
        input: {
          name: 'Acme Corp',
          email: 'contact@acme.com',
          phone: '555-0123',
        },
        output: { id: 'client-123', name: 'Acme Corp' },
      },
    ],
  },
});
