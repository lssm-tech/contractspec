import { defineDataView } from "../../data-views";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";
import { HarnessEvidenceListQuery } from "../queries/harnessEvidenceList.query";

export const HarnessEvidenceDataView = defineDataView({
  meta: {
    key: "harness.evidence.index",
    title: "Harness Evidence",
    version: "1.0.0",
    description: "List captured evidence artifacts for harness runs.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "evidence", "index"],
    stability: HARNESS_STABILITY,
    entity: "harness_evidence",
  },
  source: {
    primary: {
      key: HarnessEvidenceListQuery.meta.key,
      version: HarnessEvidenceListQuery.meta.version,
    },
  },
  view: {
    kind: "list",
    fields: [
      { key: "artifactId", label: "Artifact", dataPath: "artifactId" },
      { key: "kind", label: "Kind", dataPath: "kind" },
      { key: "runId", label: "Run", dataPath: "runId" },
      { key: "stepId", label: "Step", dataPath: "stepId" },
      { key: "createdAt", label: "Created", dataPath: "createdAt" },
    ],
    primaryField: "artifactId",
    secondaryFields: ["kind", "runId"],
    filters: [
      { key: "runId", label: "Run", field: "runId", type: "search" },
      { key: "kind", label: "Kind", field: "kind", type: "search" },
    ],
  },
  policy: {
    flags: [],
    pii: [],
  },
});
