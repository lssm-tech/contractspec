import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineEvent } from "../../events";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";

export const HarnessStepStartedPayload = new SchemaModel({
  name: "HarnessStepStartedPayload",
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepId: { type: ScalarTypeEnum.ID(), isOptional: false },
    stepKey: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HarnessStepStartedEvent = defineEvent({
  meta: {
    key: "harness.step.started",
    version: "1.0.0",
    description: "Emitted when a harness step starts.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "step", "started"],
    stability: HARNESS_STABILITY,
  },
  payload: HarnessStepStartedPayload,
});
