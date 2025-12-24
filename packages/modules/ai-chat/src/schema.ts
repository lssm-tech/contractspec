import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

export const ChatMessageModel = defineSchemaModel({
  name: 'ChatMessage',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    role: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const ChatConversationModel = defineSchemaModel({
  name: 'ChatConversation',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    messages: { type: ChatMessageModel, isArray: true, isOptional: false },
    provider: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    model: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const SendMessageInputModel = defineSchemaModel({
  name: 'SendMessageInput',
  fields: {
    conversationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stream: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

export const SendMessageOutputModel = defineSchemaModel({
  name: 'SendMessageOutput',
  fields: {
    message: { type: ChatMessageModel, isOptional: false },
    conversation: { type: ChatConversationModel, isOptional: false },
  },
});

export const ListConversationsOutputModel = defineSchemaModel({
  name: 'ListConversationsOutput',
  fields: {
    conversations: {
      type: ChatConversationModel,
      isArray: true,
      isOptional: false,
    },
  },
});
