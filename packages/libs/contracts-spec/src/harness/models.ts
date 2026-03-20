import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";

export const HarnessTargetModel = new SchemaModel({
  name: "HarnessTarget",
  fields: {
    targetId: { type: ScalarTypeEnum.ID(), isOptional: false },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    isolation: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    baseUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    allowlistedDomains: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const HarnessStepModel = new SchemaModel({
  name: "HarnessStep",
  fields: {
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    actionClass: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    verdict: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    requiresApproval: { type: ScalarTypeEnum.Boolean(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const EvidenceArtifactModel = new SchemaModel({
  name: "EvidenceArtifact",
  fields: {
    artifactId: { type: ScalarTypeEnum.ID(), isOptional: false },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: true },
    uri: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    contentType: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    hash: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const HarnessAssertionResultModel = new SchemaModel({
  name: "HarnessAssertionResult",
  fields: {
    assertionKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    message: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    evidenceArtifactIds: {
      type: ScalarTypeEnum.ID(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const HarnessRunModel = new SchemaModel({
  name: "HarnessRun",
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    scenarioKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    suiteKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    controlPlaneExecutionId: {
      type: ScalarTypeEnum.ID(),
      isOptional: true,
    },
    target: { type: HarnessTargetModel, isOptional: false },
    steps: { type: HarnessStepModel, isOptional: false, isArray: true },
    evidenceCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HarnessEvaluationModel = new SchemaModel({
  name: "HarnessEvaluation",
  fields: {
    evaluationId: { type: ScalarTypeEnum.ID(), isOptional: false },
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    scenarioKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    suiteKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    assertions: {
      type: HarnessAssertionResultModel,
      isOptional: false,
      isArray: true,
    },
    evidenceCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    replayBundleUri: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});
