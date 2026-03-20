import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineEvent } from "../../events";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";

export const HarnessRunStartedPayload = new SchemaModel({
  name: "HarnessRunStartedPayload",
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    scenarioKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    suiteKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    mode: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    startedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HarnessRunStartedEvent = defineEvent({
  meta: {
    key: "harness.run.started",
    version: "1.0.0",
    description: "Emitted when a harness run starts.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "run", "started"],
    stability: HARNESS_STABILITY,
  },
  payload: HarnessRunStartedPayload,
});
