import {
  defineCommand,
  defineQuery,
  defineSchemaModel,
} from '@contractspec/lib.contracts';
import { ScalarTypeEnum, defineEnum } from '@contractspec/lib.schema';

const OWNERS = ['platform.notifications'] as const;

// ============ Enums (for contract schemas) ============
// Note: These are EnumType for use in SchemaModel fields.
// Entity enums for Prisma are defined separately in ./entities

const NotificationStatusSchemaEnum = defineEnum('NotificationStatus', [
  'PENDING',
  'SENT',
  'DELIVERED',
  'READ',
  'FAILED',
  'CANCELLED',
]);

const NotificationChannelSchemaEnum = defineEnum('NotificationChannel', [
  'EMAIL',
  'IN_APP',
  'PUSH',
  'WEBHOOK',
]);

export const NotificationFilterEnum = defineEnum('NotificationFilter', [
  'unread',
  'read',
  'all',
]);

// ============ Schemas ============

export const NotificationModel = defineSchemaModel({
  name: 'Notification',
  description: 'A notification sent to a user',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    body: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: NotificationStatusSchemaEnum, isOptional: false },
    channels: {
      type: NotificationChannelSchemaEnum,
      isArray: true,
      isOptional: false,
    },
    actionUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    readAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const NotificationPreferenceModel = defineSchemaModel({
  name: 'NotificationPreference',
  description: 'User notification preferences',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    globalEnabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    channelPreferences: {
      type: ScalarTypeEnum.JSONObject(),
      isOptional: false,
    },
    typePreferences: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    quietHoursStart: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    quietHoursEnd: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timezone: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    digestEnabled: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    digestFrequency: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

export const SendNotificationInputModel = defineSchemaModel({
  name: 'SendNotificationInput',
  description: 'Input for sending a notification',
  fields: {
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    templateId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    body: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    channels: {
      type: NotificationChannelSchemaEnum,
      isArray: true,
      isOptional: true,
    },
    actionUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    variables: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const ListNotificationsInputModel = defineSchemaModel({
  name: 'ListNotificationsInput',
  description: 'Input for listing notifications',
  fields: {
    status: { type: NotificationFilterEnum, isOptional: true },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 20,
    },
    offset: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: true,
      defaultValue: 0,
    },
  },
});

export const ListNotificationsOutputModel = defineSchemaModel({
  name: 'ListNotificationsOutput',
  description: 'Output for listing notifications',
  fields: {
    notifications: {
      type: NotificationModel,
      isArray: true,
      isOptional: false,
    },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    unreadCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
  },
});

export const UpdatePreferencesInputModel = defineSchemaModel({
  name: 'UpdateNotificationPreferencesInput',
  description: 'Input for updating notification preferences',
  fields: {
    globalEnabled: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    channelPreferences: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    typePreferences: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    quietHoursStart: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    quietHoursEnd: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timezone: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    digestEnabled: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    digestFrequency: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

// ============ Contracts ============

/**
 * Send a notification.
 */
export const SendNotificationContract = defineCommand({
  meta: {
    key: 'notifications.send',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['notifications', 'send'],
    description: 'Send a notification to a user.',
    goal: 'Deliver notifications across multiple channels.',
    context: 'Called by services when events require user notification.',
  },
  io: {
    input: SendNotificationInputModel,
    output: NotificationModel,
    errors: {
      USER_NOT_FOUND: {
        description: 'Target user does not exist',
        http: 404,
        gqlCode: 'USER_NOT_FOUND',
        when: 'User ID is invalid',
      },
      TEMPLATE_NOT_FOUND: {
        description: 'Notification template does not exist',
        http: 404,
        gqlCode: 'TEMPLATE_NOT_FOUND',
        when: 'Template ID is invalid',
      },
    },
  },
  policy: {
    auth: 'user',
  },
  sideEffects: {
    emits: [
      {
        key: 'notification.sent',
        version: 1,
        when: 'Notification is sent',
        payload: NotificationModel,
      },
    ],
  },
});

/**
 * List notifications for current user.
 */
export const ListNotificationsContract = defineQuery({
  meta: {
    key: 'notifications.list',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['notifications', 'list'],
    description: 'List notifications for the current user.',
    goal: 'Show user their notifications.',
    context: 'Notification center UI.',
  },
  io: {
    input: ListNotificationsInputModel,
    output: ListNotificationsOutputModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Mark notification as read.
 */
export const MarkNotificationReadContract = defineCommand({
  meta: {
    key: 'notifications.markRead',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['notifications', 'read'],
    description: 'Mark a notification as read.',
    goal: 'Track which notifications user has seen.',
    context: 'User clicks on a notification.',
  },
  io: {
    input: defineSchemaModel({
      name: 'MarkNotificationReadInput',
      fields: {
        notificationId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
      },
    }),
    output: NotificationModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Mark all notifications as read.
 */
export const MarkAllNotificationsReadContract = defineCommand({
  meta: {
    key: 'notifications.markAllRead',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['notifications', 'read'],
    description: 'Mark all notifications as read.',
    goal: 'Clear notification badge.',
    context: 'User clicks "mark all as read".',
  },
  io: {
    input: null,
    output: defineSchemaModel({
      name: 'MarkAllNotificationsReadOutput',
      fields: {
        markedCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Get notification preferences.
 */
export const GetNotificationPreferencesContract = defineQuery({
  meta: {
    key: 'notifications.preferences.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['notifications', 'preferences', 'get'],
    description: 'Get notification preferences for current user.',
    goal: 'Show user their notification settings.',
    context: 'Notification settings page.',
  },
  io: {
    input: null,
    output: NotificationPreferenceModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Update notification preferences.
 */
export const UpdateNotificationPreferencesContract = defineCommand({
  meta: {
    key: 'notifications.preferences.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['notifications', 'preferences', 'update'],
    description: 'Update notification preferences.',
    goal: 'Allow user to control notification delivery.',
    context: 'Notification settings page.',
  },
  io: {
    input: UpdatePreferencesInputModel,
    output: NotificationPreferenceModel,
  },
  policy: {
    auth: 'user',
  },
});

/**
 * Delete a notification.
 */
export const DeleteNotificationContract = defineCommand({
  meta: {
    key: 'notifications.delete',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['notifications', 'delete'],
    description: 'Delete a notification.',
    goal: 'Allow user to remove unwanted notifications.',
    context: 'User dismisses a notification.',
  },
  io: {
    input: defineSchemaModel({
      name: 'DeleteNotificationInput',
      fields: {
        notificationId: {
          type: ScalarTypeEnum.String_unsecure(),
          isOptional: false,
        },
      },
    }),
    output: defineSchemaModel({
      name: 'DeleteNotificationOutput',
      fields: {
        success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
      },
    }),
  },
  policy: {
    auth: 'user',
  },
});
