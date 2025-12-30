import { defineCapability, StabilityEnum } from '@contractspec/lib.contracts';

const OWNERS = ['platform.contractspec-studio'] as const;

export const MessagingCapability = defineCapability({
  meta: {
    key: 'template.messaging.core',
    version: '1.0.0',
    kind: 'api',
    title: 'Template Messaging Core',
    description:
      'Real-time messaging primitives for template applications, including conversations, participants, and delivery events.',
    domain: 'templates',
    owners: [...OWNERS],
    tags: ['templates', 'messaging', 'realtime'],
    stability: StabilityEnum.Experimental,
  },
  provides: [
    {
      surface: 'operation',
      key: 'template.messaging.conversation.create',
      version: '1.0.0',
      description:
        'Create a direct or group conversation scoped to a Studio project.',
    },
    {
      surface: 'operation',
      key: 'template.messaging.conversation.list',
      version: '1.0.0',
      description:
        'List conversations with pagination, unread counts, and filters.',
    },
    {
      surface: 'operation',
      key: 'template.messaging.message.send',
      version: '1.0.0',
      description:
        'Send a message with attachments and optimistic delivery state.',
    },
    {
      surface: 'operation',
      key: 'template.messaging.message.read',
      version: '1.0.0',
      description: 'Mark messages as read and update participant cursors.',
    },
    {
      surface: 'event',
      key: 'template.messaging.message.received',
      version: '1.0.0',
      description: 'Emitted when a participant receives a new message.',
    },
    {
      surface: 'event',
      key: 'template.messaging.typing',
      version: '1.0.0',
      description: 'Emitted when a participant is typing in a conversation.',
    },
  ],
  requires: [{ key: 'studio.project', version: '1.0.0' }],
});
