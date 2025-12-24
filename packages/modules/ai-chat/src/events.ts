import { defineEvent } from '@lssm/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { ChatMessageModel, ChatConversationModel } from './schema';

export const MessageSentEvent = defineEvent({
  name: 'ai-chat.message.sent',
  version: 1,
  description: 'Message sent by user',
  payload: ChatMessageModel,
});

export const MessageReceivedEvent = defineEvent({
  name: 'ai-chat.message.received',
  version: 1,
  description: 'Message received from AI',
  payload: ChatMessageModel,
});

export const ConversationCreatedEvent = defineEvent({
  name: 'ai-chat.conversation.created',
  version: 1,
  description: 'New conversation created',
  payload: ChatConversationModel,
});

export const ConversationDeletedEvent = defineEvent({
  name: 'ai-chat.conversation.deleted',
  version: 1,
  description: 'Conversation deleted',
  payload: defineSchemaModel({
    name: 'ConversationDeletedPayload',
    fields: {
      id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    },
  }),
});

export const ChatErrorEvent = defineEvent({
  name: 'ai-chat.error',
  version: 1,
  description: 'Chat error occurred',
  payload: defineSchemaModel({
    name: 'ChatErrorPayload',
    fields: {
      code: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
      message: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    },
  }),
});
