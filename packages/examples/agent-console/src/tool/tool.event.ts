import { defineEvent } from '@contractspec/lib.contracts-spec';
import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';

const OWNERS = ['@agent-console-team'] as const;

/**
 * Payload for tool created event.
 */
const ToolCreatedPayload = defineSchemaModel({
  name: 'ToolCreatedPayload',
  description: 'Payload for tool created event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    implementationType: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    createdById: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolCreatedEvent - A new tool was created.
 */
export const ToolCreatedEvent = defineEvent({
  meta: {
    key: 'agent.tool.created',
    version: '1.0.0',
    description: 'A new AI tool was created.',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'created'],
  },
  payload: ToolCreatedPayload,
});

/**
 * Payload for tool updated event.
 */
const ToolUpdatedPayload = defineSchemaModel({
  name: 'ToolUpdatedPayload',
  description: 'Payload for tool updated event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedFields: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: false,
    },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolUpdatedEvent - A tool was updated.
 */
export const ToolUpdatedEvent = defineEvent({
  meta: {
    key: 'agent.tool.updated',
    version: '1.0.0',
    description: 'An AI tool configuration was updated.',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'updated'],
  },
  payload: ToolUpdatedPayload,
});

/**
 * Payload for tool status changed event.
 */
const ToolStatusChangedPayload = defineSchemaModel({
  name: 'ToolStatusChangedPayload',
  description: 'Payload for tool status changed event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolStatusChangedEvent - A tool's status was changed.
 */
export const ToolStatusChangedEvent = defineEvent({
  meta: {
    key: 'agent.tool.statusChanged',
    version: '1.0.0',
    description:
      'An AI tool status was changed (activated, deprecated, disabled).',
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['tool', 'status'],
  },
  payload: ToolStatusChangedPayload,
});
