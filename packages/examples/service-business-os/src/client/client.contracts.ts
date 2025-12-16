import { defineCommand } from '@lssm/lib.contracts';
import { ClientModel, CreateClientInputModel } from './client.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Create a new client.
 */
export const CreateClientContract = defineCommand({
  meta: {
    name: 'service.client.create',
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
});


