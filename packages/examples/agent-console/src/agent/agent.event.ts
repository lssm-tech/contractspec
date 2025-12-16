import { defineEvent, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum } from '@lssm/lib.schema';

/**
 * Payload for agent created event.
 */
const AgentCreatedPayload = defineSchemaModel({
  name: 'AgentCreatedPayload',
  description: 'Payload for agent created event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    modelProvider: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    modelName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdById: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * AgentCreatedEvent - A new agent was created.
 */
export const AgentCreatedEvent = defineEvent({
  name: 'agent.agent.created',
  version: 1,
  description: 'A new AI agent was configured.',
  payload: AgentCreatedPayload,
});

/**
 * Payload for agent updated event.
 */
const AgentUpdatedPayload = defineSchemaModel({
  name: 'AgentUpdatedPayload',
  description: 'Payload for agent updated event',
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
 * AgentUpdatedEvent - An agent was updated.
 */
export const AgentUpdatedEvent = defineEvent({
  name: 'agent.agent.updated',
  version: 1,
  description: 'An AI agent configuration was updated.',
  payload: AgentUpdatedPayload,
});

/**
 * Payload for agent tool assigned event.
 */
const AgentToolAssignedPayload = defineSchemaModel({
  name: 'AgentToolAssignedPayload',
  description: 'Payload for agent tool assigned event',
  fields: {
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    assignedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * AgentToolAssignedEvent - A tool was assigned to an agent.
 */
export const AgentToolAssignedEvent = defineEvent({
  name: 'agent.agent.toolAssigned',
  version: 1,
  description: 'A tool was assigned to an agent.',
  payload: AgentToolAssignedPayload,
});

/**
 * Payload for agent tool removed event.
 */
const AgentToolRemovedPayload = defineSchemaModel({
  name: 'AgentToolRemovedPayload',
  description: 'Payload for agent tool removed event',
  fields: {
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    removedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * AgentToolRemovedEvent - A tool was removed from an agent.
 */
export const AgentToolRemovedEvent = defineEvent({
  name: 'agent.agent.toolRemoved',
  version: 1,
  description: 'A tool was removed from an agent.',
  payload: AgentToolRemovedPayload,
});
