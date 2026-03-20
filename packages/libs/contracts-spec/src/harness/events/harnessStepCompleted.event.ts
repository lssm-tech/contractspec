import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineEvent } from "../../events";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";

export const HarnessStepCompletedPayload = new SchemaModel({
  name: "HarnessStepCompletedPayload",
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const HarnessStepCompletedEvent = defineEvent({
  meta: {
    key: "harness.step.completed",
    version: "1.0.0",
    description: "Emitted when a harness step completes.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "step", "completed"],
    stability: HARNESS_STABILITY,
  },
  payload: HarnessStepCompletedPayload,
});
