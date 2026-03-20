import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineQuery } from "../../operations";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";
import { HarnessEvaluationModel } from "../models";

const HarnessEvaluationGetInput = new SchemaModel({
  name: "HarnessEvaluationGetInput",
  fields: {
    evaluationId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const HarnessEvaluationGetOutput = new SchemaModel({
  name: "HarnessEvaluationGetOutput",
  fields: {
    evaluation: { type: HarnessEvaluationModel, isOptional: false },
  },
});

export const HarnessEvaluationGetQuery = defineQuery({
  meta: {
    key: "harness.evaluation.get",
    title: "Get Harness Evaluation",
    version: "1.0.0",
    description: "Fetch one evaluation and its assertion results.",
    goal: "Expose benchmark and regression outcomes with evidence pointers.",
    context: "Used by evaluation dashboards and automation.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "evaluation"],
    stability: HARNESS_STABILITY,
  },
  capability: { key: "harness.evaluation", version: "1.0.0" },
  io: {
    input: HarnessEvaluationGetInput,
    output: HarnessEvaluationGetOutput,
  },
  policy: {
    auth: "user",
    pii: [],
  },
});
