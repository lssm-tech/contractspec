import { defineCapability } from "../../capabilities";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";

export const HarnessTargetingCapability = defineCapability({
  meta: {
    key: "harness.targeting",
    version: "1.0.0",
    kind: "integration",
    title: "Harness Targeting",
    description: "Resolve preview, task, shared, and sandbox harness targets.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "targeting"],
    stability: HARNESS_STABILITY,
  },
  provides: [
    {
      surface: "operation",
      key: "harness.target.resolve",
      version: "1.0.0",
      description: "Resolve the execution target for a harness run.",
    },
  ],
});
