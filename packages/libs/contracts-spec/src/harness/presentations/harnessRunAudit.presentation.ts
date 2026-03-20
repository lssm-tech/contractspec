import { definePresentation } from "../../presentations";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";

export const HarnessRunAuditPresentation = definePresentation({
  meta: {
    key: "harness.run.audit",
    title: "Harness Run Audit",
    version: "1.0.0",
    description: "Audit view for harness runs, steps, evidence, and assertions.",
    goal: "Explain what happened, why it happened, and what proves it.",
    context: "Used by review surfaces to inspect bounded harness execution.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "audit"],
    stability: HARNESS_STABILITY,
  },
  capability: {
    key: "harness.evidence",
    version: "1.0.0",
  },
  source: {
    type: "component",
    framework: "react",
    componentKey: "harnessRunAudit",
  },
  targets: ["react", "markdown"],
});
