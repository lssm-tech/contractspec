import { defineSchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';
import { RunStatusEnum, RunStepTypeEnum, LogLevelEnum } from './run.enum';

/**
 * Input data for agent execution.
 */
export const RunInputModel = defineSchemaModel({
  name: 'RunInput',
  description: 'Input data for agent execution',
  fields: {
    message: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    context: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

/**
 * Individual step within a run.
 */
export const RunStepModel = defineSchemaModel({
  name: 'RunStep',
  description: 'Individual step within a run',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepNumber: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    type: { type: RunStepTypeEnum, isOptional: false },
    toolId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    toolName: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    input: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    output: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    status: { type: RunStatusEnum, isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tokensUsed: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false, defaultValue: 0 },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

/**
 * Execution log entry.
 */
export const RunLogModel = defineSchemaModel({
  name: 'RunLog',
  description: 'Execution log entry',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    stepId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    level: { type: LogLevelEnum, isOptional: false },
    message: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    data: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    source: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    traceId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    spanId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    timestamp: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

/**
 * Agent reference in a run.
 */
export const RunAgentRefModel = defineSchemaModel({
  name: 'RunAgentRef',
  description: 'Agent reference in a run',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    modelProvider: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    modelName: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

/**
 * Agent execution instance.
 */
export const RunModel = defineSchemaModel({
  name: 'Run',
  description: 'Agent execution instance',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    organizationId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    userId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    sessionId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    input: { type: ScalarTypeEnum.JSONObject(), isOptional: false },
    output: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    status: { type: RunStatusEnum, isOptional: false },
    errorMessage: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    errorCode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    totalTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false, defaultValue: 0 },
    promptTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false, defaultValue: 0 },
    completionTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false, defaultValue: 0 },
    totalIterations: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false, defaultValue: 0 },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    estimatedCostUsd: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    queuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    steps: { type: RunStepModel, isArray: true, isOptional: true },
    logs: { type: RunLogModel, isArray: true, isOptional: true },
    agent: { type: RunAgentRefModel, isOptional: true },
  },
});

/**
 * Summary of a run for list views.
 */
export const RunSummaryModel = defineSchemaModel({
  name: 'RunSummary',
  description: 'Summary of a run for list views',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    agentName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    status: { type: RunStatusEnum, isOptional: false },
    totalTokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    durationMs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    estimatedCostUsd: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    queuedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

/**
 * Timeline data point for metrics.
 */
export const TimelineDataPointModel = defineSchemaModel({
  name: 'TimelineDataPoint',
  description: 'Timeline data point for metrics',
  fields: {
    period: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    runs: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    tokens: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    costUsd: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    avgDurationMs: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});


