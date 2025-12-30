import { defineEvent } from '@contractspec/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { ChatMessageModel, ChatConversationModel } from './schema';

export const MessageSentEvent = defineEvent({
  meta: {
    key: 'ai-chat.message.sent',
    version: '1.0.0',
    description: 'Message sent by user',
    stability: 'stable',
    owners: ['@ai-chat'],
    tags: ['ai-chat', 'message', 'sent'],
  },
  payload: ChatMessageModel,
});

export const MessageReceivedEvent = defineEvent({
  meta: {
    key: 'ai-chat.message.received',
    version: '1.0.0',
    description: 'Message received from AI',
    stability: 'stable',
    owners: ['@ai-chat'],
    tags: ['ai-chat', 'message', 'received'],
  },
  payload: ChatMessageModel,
});

export const ConversationCreatedEvent = defineEvent({
  meta: {
    key: 'ai-chat.conversation.created',
    version: '1.0.0',
    description: 'New conversation created',
    stability: 'stable',
    owners: ['@ai-chat'],
    tags: ['ai-chat', 'conversation', 'created'],
  },
  payload: ChatConversationModel,
});

export const ConversationDeletedEvent = defineEvent({
  meta: {
    key: 'ai-chat.conversation.deleted',
    version: '1.0.0',
    description: 'Conversation deleted',
    stability: 'stable',
    owners: ['@ai-chat'],
    tags: ['ai-chat', 'conversation', 'deleted'],
  },
  payload: defineSchemaModel({
    name: 'ConversationDeletedPayload',
    fields: {
      id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    },
  }),
});

export const ChatErrorEvent = defineEvent({
  meta: {
    key: 'ai-chat.error',
    version: '1.0.0',
    description: 'Chat error occurred',
    stability: 'stable',
    owners: ['@ai-chat'],
    tags: ['ai-chat', 'error'],
  },
  payload: defineSchemaModel({
    name: 'ChatErrorPayload',
    fields: {
      code: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      message: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    },
  }),
});
