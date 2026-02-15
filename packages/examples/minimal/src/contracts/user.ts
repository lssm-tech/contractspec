import { defineCommand } from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

const UserInput = new SchemaModel({
  name: 'UserInput',
  fields: {
    email: { type: ScalarTypeEnum.EmailAddress(), isOptional: false },
  },
});

export const CreateUser = defineCommand({
  meta: {
    key: 'user.create',
    version: '1.0.0',
    goal: 'Create a new user account',
    description: 'Create a new user account with the provided email',
    owners: ['@team'],
    tags: ['user'],
    stability: 'stable',
    context: 'User account management',
  },
  io: {
    input: UserInput,
    output: UserInput,
  },
  policy: {
    auth: 'anonymous',
  },
});
