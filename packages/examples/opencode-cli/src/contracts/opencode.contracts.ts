import { defineCommand } from '@contractspec/lib.contracts/operations';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const OWNERS = ['@contractspec/examples'] as const;

const OpenCodeEchoInput = defineSchemaModel({
  name: 'OpenCodeEchoInput',
  fields: {
    prompt: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

const OpenCodeEchoOutput = defineSchemaModel({
  name: 'OpenCodeEchoOutput',
  fields: {
    message: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const OpenCodeEchoCommand = defineCommand({
  meta: {
    key: 'opencode.example.echo',
    version: '1.0.0',
    stability: 'experimental',
    owners: [...OWNERS],
    tags: ['opencode', 'example', 'echo'],
    description: 'Echo a prompt for the OpenCode CLI example.',
    goal: 'Demonstrate OpenCode agent mode in the CLI build/validate flow.',
    context: 'Used by the opencode-cli example package.',
  },
  io: {
    input: OpenCodeEchoInput,
    output: OpenCodeEchoOutput,
  },
  acceptance: {
    scenarios: [
      {
        key: 'echo-prompt',
        given: ['A user provides a prompt'],
        when: ['The echo command is invoked'],
        then: ['The message is returned as-is'],
      },
    ],
    examples: [
      {
        key: 'echo-example',
        input: { prompt: 'Hello, OpenCode' },
        output: { message: 'Hello, OpenCode' },
      },
    ],
  },
  policy: { auth: 'user' },
});
