import { ScalarTypeEnum, SchemaModel } from "@contractspec/lib.schema";
import { defineQuery } from "../../operations";
import {
  HARNESS_DOMAIN,
  HARNESS_OWNERS,
  HARNESS_STABILITY,
  HARNESS_TAGS,
} from "../constants";
import { HarnessTargetModel } from "../models";

const HarnessTargetResolveInput = new SchemaModel({
  name: "HarnessTargetResolveInput",
  fields: {
    targetId: { type: ScalarTypeEnum.ID(), isOptional: true },
    isolation: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    baseUrl: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    allowlistedDomains: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

const HarnessTargetResolveOutput = new SchemaModel({
  name: "HarnessTargetResolveOutput",
  fields: {
    target: { type: HarnessTargetModel, isOptional: false },
  },
});

export const HarnessTargetResolveQuery = defineQuery({
  meta: {
    key: "harness.target.resolve",
    title: "Resolve Harness Target",
    version: "1.0.0",
    description: "Resolve the isolated target used for a harness run.",
    goal: "Prefer preview and task targets before shared environments.",
    context: "Used before execution to attach to the correct app instance.",
    domain: HARNESS_DOMAIN,
    owners: HARNESS_OWNERS,
    tags: [...HARNESS_TAGS, "target"],
    stability: HARNESS_STABILITY,
  },
  capability: { key: "harness.targeting", version: "1.0.0" },
  io: {
    input: HarnessTargetResolveInput,
    output: HarnessTargetResolveOutput,
  },
  policy: {
    auth: "user",
    pii: [],
  },
});
