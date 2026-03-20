import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineEvent } from "../../events";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";

export const HarnessRunCompletedPayload = new SchemaModel({
  name: "HarnessRunCompletedPayload",
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    completedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    evidenceCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const HarnessRunCompletedEvent = defineEvent({
  meta: {
    key: "harness.run.completed",
    version: "1.0.0",
    description: "Emitted when a harness run completes.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "run", "completed"],
    stability: HARNESS_STABILITY,
  },
  payload: HarnessRunCompletedPayload,
});
