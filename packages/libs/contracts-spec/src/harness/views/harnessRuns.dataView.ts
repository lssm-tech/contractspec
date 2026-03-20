import { defineDataView } from "../../data-views";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";
import { HarnessRunGetQuery } from "../queries/harnessRunGet.query";

export const HarnessRunsDataView = defineDataView({
  meta: {
    key: "harness.run.index",
    title: "Harness Runs",
    version: "1.0.0",
    description: "List harness runs, targets, and statuses.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "run", "index"],
    stability: HARNESS_STABILITY,
    entity: "harness_run",
  },
  source: {
    primary: {
      key: HarnessRunGetQuery.meta.key,
      version: HarnessRunGetQuery.meta.version,
    },
  },
  view: {
    kind: "list",
    fields: [
      { key: "runId", label: "Run", dataPath: "runId" },
      { key: "status", label: "Status", dataPath: "status" },
      { key: "mode", label: "Mode", dataPath: "mode" },
      { key: "scenarioKey", label: "Scenario", dataPath: "scenarioKey" },
      { key: "createdAt", label: "Created", dataPath: "createdAt" },
    ],
    primaryField: "runId",
    secondaryFields: ["status", "scenarioKey"],
    filters: [
      { key: "runId", label: "Run ID", field: "runId", type: "search" },
      { key: "status", label: "Status", field: "status", type: "search" },
    ],
  },
  policy: {
    flags: [],
    pii: [],
  },
});
