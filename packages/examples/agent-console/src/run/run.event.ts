import { defineEvent, defineSchemaModel } from '@lssm/lib.contracts';
import { ScalarTypeEnum, defineEnum } from '@lssm/lib.schema';

/**
 * Payload for run started event.
 */
const RunStartedPayload = defineSchemaModel({
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
 * RunStartedEvent - An agent run was started.
 */
export const RunStartedEvent = defineEvent({
  name: 'agent.run.started',
  version: 1,
  description: 'An agent run was started.',
  payload: RunStartedPayload,
});

/**
 * Payload for run completed event.
 */
const RunCompletedPayload = defineSchemaModel({
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
 * RunCompletedEvent - An agent run completed successfully.
 */
export const RunCompletedEvent = defineEvent({
  name: 'agent.run.completed',
  version: 1,
  description: 'An agent run completed successfully.',
  payload: RunCompletedPayload,
});

/**
 * Payload for run failed event.
 */
const RunFailedPayload = defineSchemaModel({
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
 * RunFailedEvent - An agent run failed.
 */
export const RunFailedEvent = defineEvent({
  name: 'agent.run.failed',
  version: 1,
  description: 'An agent run encountered an error.',
  payload: RunFailedPayload,
});

/**
 * Payload for run cancelled event.
 */
const RunCancelledPayload = defineSchemaModel({
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
 * RunCancelledEvent - An agent run was cancelled.
 */
export const RunCancelledEvent = defineEvent({
  name: 'agent.run.cancelled',
  version: 1,
  description: 'An agent run was cancelled by the user.',
  payload: RunCancelledPayload,
});

/**
 * Payload for tool invoked event.
 */
const ToolInvokedPayload = defineSchemaModel({
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
 * ToolInvokedEvent - A tool was invoked during a run.
 */
export const ToolInvokedEvent = defineEvent({
  name: 'agent.run.toolInvoked',
  version: 1,
  description: 'A tool was invoked during an agent run.',
  payload: ToolInvokedPayload,
});

/**
 * Payload for tool completed event.
 */
const ToolCompletedPayload = defineSchemaModel({
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
 * ToolCompletedEvent - A tool invocation completed.
 */
export const ToolCompletedEvent = defineEvent({
  name: 'agent.run.toolCompleted',
  version: 1,
  description: 'A tool invocation completed during an agent run.',
  payload: ToolCompletedPayload,
});

/**
 * Message type enum.
 */
const MessageTypeEnum = defineEnum('MessageType', ['assistant', 'system']);

/**
 * Payload for message generated event.
 */
const MessageGeneratedPayload = defineSchemaModel({
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
 * MessageGeneratedEvent - Agent generated a message.
 */
export const MessageGeneratedEvent = defineEvent({
  name: 'agent.run.messageGenerated',
  version: 1,
  description: 'An agent generated a message during a run.',
  payload: MessageGeneratedPayload,
});


