import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineCommand } from "../../operations";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";
import { HarnessEvaluationCompletedEvent } from "../events/harnessEvaluationCompleted.event";
import { HarnessEvaluationModel } from "../models";

const HarnessEvaluationRunInput = new SchemaModel({
  name: "HarnessEvaluationRunInput",
  fields: {
    scenarioKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
    suiteKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: true },
    targetId: { type: ScalarTypeEnum.ID(), isOptional: true },
    mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

const HarnessEvaluationRunOutput = new SchemaModel({
  name: "HarnessEvaluationRunOutput",
  fields: {
    evaluation: { type: HarnessEvaluationModel, isOptional: false },
  },
});

export const HarnessEvaluationRunCommand = defineCommand({
  meta: {
    key: "harness.evaluation.run",
    title: "Run Harness Evaluation",
    version: "1.0.0",
    description: "Run a harness scenario or suite as an evaluation.",
    goal: "Produce assertion-backed evidence for QA and regression workflows.",
    context: "Used by evaluation pipelines and benchmark suites.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "evaluation", "run"],
    stability: HARNESS_STABILITY,
  },
  capability: { key: "harness.evaluation", version: "1.0.0" },
  io: {
    input: HarnessEvaluationRunInput,
    output: HarnessEvaluationRunOutput,
  },
  policy: {
    auth: "user",
    pii: [],
  },
  sideEffects: {
    emits: [
      {
        ref: HarnessEvaluationCompletedEvent.meta,
        when: "Evaluation execution finishes and assertion results are persisted.",
      },
    ],
  },
});
