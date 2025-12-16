import { defineCommand } from '@lssm/lib.contracts';
import { SpaceModel, CreateSpaceInputModel } from './space.schema';

const OWNERS = ['@examples.team-hub'] as const;

/**
 * Create a new team space.
 */
export const CreateSpaceContract = defineCommand({
  meta: {
    name: 'team.space.create',
    version: 1,
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
});


