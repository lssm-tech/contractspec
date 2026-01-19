import { defineCommand } from '@contractspec/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const UserInput = new SchemaModel({
  name: 'UserInput',
  fields: {
    email: { type: ScalarTypeEnum.Email(), isOptional: false },
  },
});

export const CreateUser = defineCommand({
  meta: {
    name: 'user.create',
    version: '1.0.0',
  },
  io: {
    input: UserInput,
    output: UserInput,
  },
});
