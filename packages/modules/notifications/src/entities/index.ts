import { defineEntity, defineEntityEnum, field, index } from '@lssm/lib.schema';
import type { ModuleSchemaContribution } from '@lssm/lib.schema';

/**
 * Notification status enum.
 */
export const NotificationStatusEnum = defineEntityEnum({
  name: 'NotificationStatus',
  values: [
    'PENDING',
    'SENT',
    'DELIVERED',
    'READ',
    'FAILED',
    'CANCELLED',
  ] as const,
  schema: 'lssm_notifications',
  description: 'Status of a notification.',
});

/**
 * Notification channel enum.
 */
export const NotificationChannelEnum = defineEntityEnum({
  name: 'NotificationChannel',
  values: ['EMAIL', 'IN_APP', 'PUSH', 'WEBHOOK', 'SMS'] as const,
  schema: 'lssm_notifications',
  description: 'Delivery channel for notifications.',
});

/**
 * Notification entity - individual notification instance.
 */
export const NotificationEntity = defineEntity({
  name: 'Notification',
  description: 'An individual notification to be delivered to a user.',
  schema: 'lssm_notifications',
  map: 'notification',
  fields: {
    id: field.id({ description: 'Unique notification ID' }),

    // Recipient
    userId: field.foreignKey({ description: 'Target user ID' }),
    orgId: field.string({
      isOptional: true,
      description: 'Organization context',
    }),

    // Content
    templateId: field.string({
      isOptional: true,
      description: 'Template used',
    }),
    title: field.string({ description: 'Notification title' }),
    body: field.string({ description: 'Notification body' }),
    actionUrl: field.string({ isOptional: true, description: 'Action URL' }),
    imageUrl: field.string({ isOptional: true, description: 'Image URL' }),

    // Categorization
    type: field.string({
      description: 'Notification type (e.g., mention, update)',
    }),
    category: field.string({
      isOptional: true,
      description: 'Notification category',
    }),
    priority: field.enum('NotificationPriority', { default: 'NORMAL' }),

    // Delivery
    channels: field.string({
      isArray: true,
      description: 'Target delivery channels',
    }),
    status: field.enum('NotificationStatus', { default: 'PENDING' }),

    // Tracking
    sentAt: field.dateTime({ isOptional: true }),
    deliveredAt: field.dateTime({ isOptional: true }),
    readAt: field.dateTime({ isOptional: true }),

    // Metadata
    metadata: field.json({
      isOptional: true,
      description: 'Additional metadata',
    }),
    variables: field.json({
      isOptional: true,
      description: 'Template variables used',
    }),

    // Source
    triggeredBy: field.string({
      isOptional: true,
      description: 'Event/action that triggered',
    }),
    sourceId: field.string({
      isOptional: true,
      description: 'Source entity ID',
    }),
    sourceType: field.string({
      isOptional: true,
      description: 'Source entity type',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
    expiresAt: field.dateTime({
      isOptional: true,
      description: 'Notification expiry',
    }),

    // Relations
    deliveryLogs: field.hasMany('DeliveryLog'),
  },
  indexes: [
    index.on(['userId', 'status', 'createdAt']),
    index.on(['userId', 'readAt']),
    index.on(['orgId', 'createdAt']),
    index.on(['type', 'createdAt']),
  ],
  enums: [NotificationStatusEnum, NotificationChannelEnum],
});

/**
 * Notification priority enum.
 */
export const NotificationPriorityEnum = defineEntityEnum({
  name: 'NotificationPriority',
  values: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] as const,
  schema: 'lssm_notifications',
  description: 'Priority level of a notification.',
});

/**
 * NotificationTemplate entity - reusable notification templates.
 */
export const NotificationTemplateEntity = defineEntity({
  name: 'NotificationTemplate',
  description: 'Reusable notification template.',
  schema: 'lssm_notifications',
  map: 'notification_template',
  fields: {
    id: field.id(),
    templateId: field.string({
      isUnique: true,
      description: 'Template identifier',
    }),
    name: field.string({ description: 'Template display name' }),
    description: field.string({ isOptional: true }),

    // Content by channel
    emailSubject: field.string({ isOptional: true }),
    emailBody: field.string({ isOptional: true }),
    inAppTitle: field.string({ isOptional: true }),
    inAppBody: field.string({ isOptional: true }),
    pushTitle: field.string({ isOptional: true }),
    pushBody: field.string({ isOptional: true }),

    // Settings
    defaultChannels: field.string({ isArray: true }),
    category: field.string({ isOptional: true }),
    priority: field.enum('NotificationPriority', { default: 'NORMAL' }),

    // Variables schema
    variablesSchema: field.json({
      isOptional: true,
      description: 'JSON schema for variables',
    }),

    // State
    enabled: field.boolean({ default: true }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  enums: [NotificationPriorityEnum],
});

/**
 * NotificationPreference entity - user notification preferences.
 */
export const NotificationPreferenceEntity = defineEntity({
  name: 'NotificationPreference',
  description: 'User notification preferences by type and channel.',
  schema: 'lssm_notifications',
  map: 'notification_preference',
  fields: {
    id: field.id(),
    userId: field.foreignKey(),

    // Global settings
    globalEnabled: field.boolean({ default: true }),
    quietHoursStart: field.string({
      isOptional: true,
      description: 'Quiet hours start (HH:MM)',
    }),
    quietHoursEnd: field.string({
      isOptional: true,
      description: 'Quiet hours end (HH:MM)',
    }),
    timezone: field.string({ default: '"UTC"' }),

    // Channel preferences (JSON object: { email: true, push: false, ... })
    channelPreferences: field.json({
      description: 'Channel-level preferences',
    }),

    // Type preferences (JSON object: { mention: true, update: false, ... })
    typePreferences: field.json({ description: 'Type-level preferences' }),

    // Digest settings
    digestEnabled: field.boolean({ default: false }),
    digestFrequency: field.string({
      isOptional: true,
      description: 'daily, weekly, etc.',
    }),
    digestTime: field.string({
      isOptional: true,
      description: 'Digest send time (HH:MM)',
    }),

    // Timestamps
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  indexes: [index.unique(['userId'])],
});

/**
 * DeliveryLog entity - track delivery attempts per channel.
 */
export const DeliveryLogEntity = defineEntity({
  name: 'DeliveryLog',
  description: 'Log of notification delivery attempts.',
  schema: 'lssm_notifications',
  map: 'delivery_log',
  fields: {
    id: field.id(),
    notificationId: field.foreignKey(),

    // Delivery info
    channel: field.enum('NotificationChannel'),
    status: field.enum('NotificationStatus'),

    // Timing
    attemptedAt: field.dateTime(),
    deliveredAt: field.dateTime({ isOptional: true }),

    // Response
    responseCode: field.string({ isOptional: true }),
    responseMessage: field.string({ isOptional: true }),

    // External IDs
    externalId: field.string({
      isOptional: true,
      description: 'Provider message ID',
    }),

    // Metadata
    metadata: field.json({ isOptional: true }),

    // Relations
    notification: field.belongsTo('Notification', ['notificationId'], ['id'], {
      onDelete: 'Cascade',
    }),
  },
  indexes: [index.on(['notificationId', 'channel'])],
});

/**
 * All notification entities for schema composition.
 */
export const notificationEntities = [
  NotificationEntity,
  NotificationTemplateEntity,
  NotificationPreferenceEntity,
  DeliveryLogEntity,
];

/**
 * Module schema contribution for notifications.
 */
export const notificationsSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@lssm/module.notifications',
  entities: notificationEntities,
  enums: [
    NotificationStatusEnum,
    NotificationChannelEnum,
    NotificationPriorityEnum,
  ],
};
