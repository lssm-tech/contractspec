import { defineEvent, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum, defineEnum } from '@lssm/lib.schema';

// ============================================
// Tool Events
// ============================================

export const ToolCreatedPayload = defineSchemaModel({
  name: 'ToolCreatedPayload',
  description: 'Payload for tool created event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    implementationType: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    createdById: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolCreatedEvent - A new tool was created
 */
export const ToolCreatedEvent = defineEvent({
  name: 'agent.tool.created',
  version: 1,
  description: 'A new AI tool was created.',
  payload: ToolCreatedPayload,
});

export const ToolUpdatedPayload = defineSchemaModel({
  name: 'ToolUpdatedPayload',
  description: 'Payload for tool updated event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedFields: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolUpdatedEvent - A tool was updated
 */
export const ToolUpdatedEvent = defineEvent({
  name: 'agent.tool.updated',
  version: 1,
  description: 'An AI tool configuration was updated.',
  payload: ToolUpdatedPayload,
});

export const ToolStatusChangedPayload = defineSchemaModel({
  name: 'ToolStatusChangedPayload',
  description: 'Payload for tool status changed event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    previousStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    newStatus: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    changedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolStatusChangedEvent - A tool's status was changed
 */
export const ToolStatusChangedEvent = defineEvent({
  name: 'agent.tool.statusChanged',
  version: 1,
  description: 'An AI tool status was changed (activated, deprecated, disabled).',
  payload: ToolStatusChangedPayload,
});

// ============================================
// Agent Events
// ============================================

export const AgentCreatedPayload = defineSchemaModel({
  name: 'AgentCreatedPayload',
  description: 'Payload for agent created event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    slug: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    modelProvider: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    modelName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    createdById: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * AgentCreatedEvent - A new agent was created
 */
export const AgentCreatedEvent = defineEvent({
  name: 'agent.agent.created',
  version: 1,
  description: 'A new AI agent was configured.',
  payload: AgentCreatedPayload,
});

export const AgentUpdatedPayload = defineSchemaModel({
  name: 'AgentUpdatedPayload',
  description: 'Payload for agent updated event',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    updatedFields: { type: ScalarTypeEnum.String_unsecure(), isArray: true, isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * AgentUpdatedEvent - An agent was updated
 */
export const AgentUpdatedEvent = defineEvent({
  name: 'agent.agent.updated',
  version: 1,
  description: 'An AI agent configuration was updated.',
  payload: AgentUpdatedPayload,
});

export const AgentToolAssignedPayload = defineSchemaModel({
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
 * AgentToolAssignedEvent - A tool was assigned to an agent
 */
export const AgentToolAssignedEvent = defineEvent({
  name: 'agent.agent.toolAssigned',
  version: 1,
  description: 'A tool was assigned to an agent.',
  payload: AgentToolAssignedPayload,
});

export const AgentToolRemovedPayload = defineSchemaModel({
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
 * AgentToolRemovedEvent - A tool was removed from an agent
 */
export const AgentToolRemovedEvent = defineEvent({
  name: 'agent.agent.toolRemoved',
  version: 1,
  description: 'A tool was removed from an agent.',
  payload: AgentToolRemovedPayload,
});

// ============================================
// Run Events
// ============================================

export const RunStartedPayload = defineSchemaModel({
  name: 'RunStartedPayload',
  description: 'Payload for run started event',
  fields: {
    runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    input: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * RunStartedEvent - An agent run was started
 */
export const RunStartedEvent = defineEvent({
  name: 'agent.run.started',
  version: 1,
  description: 'An agent run was started.',
  payload: RunStartedPayload,
});

export const RunCompletedPayload = defineSchemaModel({
  name: 'RunCompletedPayload',
  description: 'Payload for run completed event',
  fields: {
    runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    output: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    totalTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    promptTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completionTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    estimatedCostUsd: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * RunCompletedEvent - An agent run completed successfully
 */
export const RunCompletedEvent = defineEvent({
  name: 'agent.run.completed',
  version: 1,
  description: 'An agent run completed successfully.',
  payload: RunCompletedPayload,
});

export const RunFailedPayload = defineSchemaModel({
  name: 'RunFailedPayload',
  description: 'Payload for run failed event',
  fields: {
    runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    errorCode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    totalTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    failedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * RunFailedEvent - An agent run failed
 */
export const RunFailedEvent = defineEvent({
  name: 'agent.run.failed',
  version: 1,
  description: 'An agent run encountered an error.',
  payload: RunFailedPayload,
});

export const RunCancelledPayload = defineSchemaModel({
  name: 'RunCancelledPayload',
  description: 'Payload for run cancelled event',
  fields: {
    runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    cancelledBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    reason: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    totalTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    totalIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    cancelledAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * RunCancelledEvent - An agent run was cancelled
 */
export const RunCancelledEvent = defineEvent({
  name: 'agent.run.cancelled',
  version: 1,
  description: 'An agent run was cancelled by the user.',
  payload: RunCancelledPayload,
});

// ============================================
// Step Events
// ============================================

export const ToolInvokedPayload = defineSchemaModel({
  name: 'ToolInvokedPayload',
  description: 'Payload for tool invoked event',
  fields: {
    runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    input: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    invokedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolInvokedEvent - A tool was invoked during a run
 */
export const ToolInvokedEvent = defineEvent({
  name: 'agent.run.toolInvoked',
  version: 1,
  description: 'A tool was invoked during an agent run.',
  payload: ToolInvokedPayload,
});

export const ToolCompletedPayload = defineSchemaModel({
  name: 'ToolCompletedPayload',
  description: 'Payload for tool completed event',
  fields: {
    runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    toolName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    success: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    output: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * ToolCompletedEvent - A tool invocation completed
 */
export const ToolCompletedEvent = defineEvent({
  name: 'agent.run.toolCompleted',
  version: 1,
  description: 'A tool invocation completed during an agent run.',
  payload: ToolCompletedPayload,
});

export const MessageTypeEnum = defineEnum('MessageType', ['assistant', 'system']);

export const MessageGeneratedPayload = defineSchemaModel({
  name: 'MessageGeneratedPayload',
  description: 'Payload for message generated event',
  fields: {
    runId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    messageType: { type: MessageTypeEnum, isOptional: false },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    tokensUsed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    generatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * MessageGeneratedEvent - Agent generated a message
 */
export const MessageGeneratedEvent = defineEvent({
  name: 'agent.run.messageGenerated',
  version: 1,
  description: 'An agent generated a message during a run.',
  payload: MessageGeneratedPayload,
});
