import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineQuery } from "../../operations";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";
import { EvidenceArtifactModel } from "../models";

const HarnessEvidenceGetInput = new SchemaModel({
  name: "HarnessEvidenceGetInput",
  fields: {
    artifactId: { type: ScalarTypeEnum.ID(), isOptional: false },
  },
});

const HarnessEvidenceGetOutput = new SchemaModel({
  name: "HarnessEvidenceGetOutput",
  fields: {
    artifact: { type: EvidenceArtifactModel, isOptional: false },
  },
});

export const HarnessEvidenceGetQuery = defineQuery({
  meta: {
    key: "harness.evidence.get",
    title: "Get Harness Evidence",
    version: "1.0.0",
    description: "Fetch one evidence artifact by id.",
    goal: "Support evidence drill-down and replay inputs.",
    context: "Used by audit UIs and replay tooling.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "evidence"],
    stability: HARNESS_STABILITY,
  },
  capability: { key: "harness.evidence", version: "1.0.0" },
  io: {
    input: HarnessEvidenceGetInput,
    output: HarnessEvidenceGetOutput,
  },
  policy: {
    auth: "user",
    pii: [],
  },
});
