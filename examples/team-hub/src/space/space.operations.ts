import { defineCommand } from '@contractspec/lib.contracts';
import { CreateSpaceInputModel, SpaceModel } from './space.schema';

const OWNERS = ['@examples.team-hub'] as const;

/**
 * Create a new team space.
 */
export const CreateSpaceContract = defineCommand({
  meta: {
    key: 'team.space.create',
    version: '1.0.0',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['team-hub', 'space', 'create'],
    description: 'Create a new team space.',
    goal: 'Organize teams/projects.',
    context: 'Workspace creation.',
  },
  io: {
    input: CreateSpaceInputModel,
    output: SpaceModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'create-space-happy-path',
        given: ['User is authenticated'],
        when: ['User creates a new space'],
        then: ['Space is created'],
      },
    ],
    examples: [
      {
        key: 'create-engineering',
        input: { name: 'Engineering', description: 'Engineering team space' },
        output: { id: 'space-123', name: 'Engineering' },
      },
    ],
  },
});
