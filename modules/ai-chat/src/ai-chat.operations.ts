import { defineCommand, defineQuery } from '@contractspec/lib.contracts';
import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import {
  ChatConversationModel,
  ListConversationsOutputModel,
  SendMessageInputModel,
  SendMessageOutputModel,
} from './schema';

export const SendMessageContract = defineCommand({
  meta: {
    key: 'ai-chat.send',
    version: '1.0.0',
    owners: ['@ai-team'],
    stability: 'experimental',
    description: 'Send a message to the AI chat.',
    tags: ['chat', 'send'],
    goal: 'Send message',
    context: 'Chat UI',
  },
  io: { input: SendMessageInputModel, output: SendMessageOutputModel },
  policy: { auth: 'user' },
});

const StreamMessageOutputModel = defineSchemaModel({
  name: 'StreamMessageOutput',
  fields: {
    stream: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // Placeholder for stream content
  },
});

export const StreamMessageContract = defineCommand({
  meta: {
    key: 'ai-chat.stream',
    version: '1.0.0',
    owners: ['@ai-team'],
    stability: 'experimental',
    description: 'Stream a message response from the AI chat.',
    tags: ['chat', 'stream'],
    goal: 'Stream response',
    context: 'Chat UI',
  },
  io: { input: SendMessageInputModel, output: StreamMessageOutputModel },
  policy: { auth: 'user' },
});

export const ListConversationsContract = defineQuery({
  meta: {
    key: 'ai-chat.conversations.list',
    version: '1.0.0',
    owners: ['@ai-team'],
    stability: 'experimental',
    description: 'List user conversations.',
    tags: ['chat', 'list'],
    goal: 'List conversations',
    context: 'Chat History',
  },
  io: {
    input: defineSchemaModel({ name: 'VoidInput', fields: {} }),
    output: ListConversationsOutputModel,
  },
  policy: { auth: 'user' },
});

export const GetConversationContract = defineQuery({
  meta: {
    key: 'ai-chat.conversations.get',
    version: '1.0.0',
    owners: ['@ai-team'],
    stability: 'experimental',
    description: 'Get a specific conversation.',
    tags: ['chat', 'get'],
    goal: 'Get conversation',
    context: 'Chat UI',
  },
  io: {
    input: defineSchemaModel({
      name: 'GetConversationInput',
      fields: {
        id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: ChatConversationModel,
  },
  policy: { auth: 'user' },
});

export const DeleteConversationContract = defineCommand({
  meta: {
    key: 'ai-chat.conversations.delete',
    version: '1.0.0',
    owners: ['@ai-team'],
    stability: 'experimental',
    description: 'Delete a conversation.',
    tags: ['chat', 'delete'],
    goal: 'Delete conversation',
    context: 'Chat History',
  },
  io: {
    input: defineSchemaModel({
      name: 'DeleteConversationInput',
      fields: {
        id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: defineSchemaModel({ name: 'VoidOutput', fields: {} }),
  },
  policy: { auth: 'user' },
});

export const ListProvidersContract = defineQuery({
  meta: {
    key: 'ai-chat.providers.list',
    version: '1.0.0',
    owners: ['@ai-team'],
    stability: 'experimental',
    description: 'List available AI providers.',
    tags: ['chat', 'providers'],
    goal: 'List providers',
    context: 'Settings',
  },
  io: {
    input: defineSchemaModel({ name: 'VoidInput2', fields: {} }),
    output: defineSchemaModel({
      name: 'ProviderList',
      fields: {
        providers: {
          type: ScalarTypeEnum.String_unsecure(),
          isArray: true,
          isOptional: false,
        },
      },
    }),
  },
  policy: { auth: 'user' },
});

export const ScanContextContract = defineCommand({
  meta: {
    key: 'ai-chat.context.scan',
    version: '1.0.0',
    owners: ['@ai-team'],
    stability: 'experimental',
    description: 'Scan workspace context.',
    tags: ['chat', 'context'],
    goal: 'Scan context',
    context: 'Background',
  },
  io: {
    input: defineSchemaModel({
      name: 'ScanContextInput',
      fields: {
        path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      },
    }),
    output: defineSchemaModel({ name: 'VoidOutput2', fields: {} }),
  },
  policy: { auth: 'user' },
});
