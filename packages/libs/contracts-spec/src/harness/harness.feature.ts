import { defineFeature } from "../features";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "./constants";

export const HarnessFeature = defineFeature({
  meta: {
    key: "platform.harness",
    version: "1.0.0",
    title: "Harness System",
    description:
      "Controlled application inspection, testing, validation, and proof generation.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS],
    stability: HARNESS_STABILITY,
  },
  operations: [
    { key: "harness.target.resolve", version: "1.0.0" },
    { key: "harness.run.start", version: "1.0.0" },
    { key: "harness.run.cancel", version: "1.0.0" },
    { key: "harness.run.get", version: "1.0.0" },
    { key: "harness.evidence.list", version: "1.0.0" },
    { key: "harness.evidence.get", version: "1.0.0" },
    { key: "harness.evaluation.run", version: "1.0.0" },
    { key: "harness.evaluation.get", version: "1.0.0" },
  ],
  events: [
    { key: "harness.run.started", version: "1.0.0" },
    { key: "harness.run.completed", version: "1.0.0" },
    { key: "harness.run.failed", version: "1.0.0" },
    { key: "harness.step.started", version: "1.0.0" },
    { key: "harness.step.completed", version: "1.0.0" },
    { key: "harness.step.blocked", version: "1.0.0" },
    { key: "harness.evidence.captured", version: "1.0.0" },
    { key: "harness.evaluation.completed", version: "1.0.0" },
  ],
  capabilities: {
    provides: [
      { key: "harness.execution", version: "1.0.0" },
      { key: "harness.evidence", version: "1.0.0" },
      { key: "harness.evaluation", version: "1.0.0" },
      { key: "harness.targeting", version: "1.0.0" },
    ],
  },
  dataViews: [
    { key: "harness.run.index", version: "1.0.0" },
    { key: "harness.evidence.index", version: "1.0.0" },
    { key: "harness.evaluation.index", version: "1.0.0" },
  ],
  presentations: [{ key: "harness.run.audit", version: "1.0.0" }],
});
