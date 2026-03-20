import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineEvent } from "../../events";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";

export const HarnessEvidenceCapturedPayload = new SchemaModel({
  name: "HarnessEvidenceCapturedPayload",
  fields: {
    runId: { type: ScalarTypeEnum.ID(), isOptional: false },
    artifactId: { type: ScalarTypeEnum.ID(), isOptional: false },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    capturedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const HarnessEvidenceCapturedEvent = defineEvent({
  meta: {
    key: "harness.evidence.captured",
    version: "1.0.0",
    description: "Emitted when a harness artifact is captured.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "evidence"],
    stability: HARNESS_STABILITY,
  },
  payload: HarnessEvidenceCapturedPayload,
});
