import {
  ScalarTypeEnum,
  SchemaModel,
  ZodSchemaType,
} from '@contractspec/lib.schema';
import { defineQuery } from '../operation';
import { StabilityEnum } from '../../ownership';
import * as z from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Domain constants
// ─────────────────────────────────────────────────────────────────────────────

const REPORT_DOMAIN = 'report';
const REPORT_OWNERS = ['platform.core'];
const REPORT_TAGS = ['report', 'drift', 'verification'];
const REPORT_STABILITY = StabilityEnum.Experimental;

// ─────────────────────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Status of a single contract's verification within the impact report.
 */
export const ContractVerificationStatusModel = new SchemaModel({
  name: 'ContractVerificationStatus',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    lastVerifiedSha: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    lastVerifiedDate: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    surfaces: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
      isArray: true,
    },
    driftMismatches: {
      type: ScalarTypeEnum.Int_unsecure(),
      isOptional: false,
    },
  },
});

export const GetContractVerificationStatusInput = new SchemaModel({
  name: 'GetContractVerificationStatusInput',
  fields: {
    projectPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    baseline: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const GetContractVerificationStatusOutput = new ZodSchemaType(
  z.object({
    contracts: z
      .object({
        name: z.string(),
        lastVerifiedSha: z.string().optional(),
        lastVerifiedDate: z.string().optional(),
        surfaces: z.string().array(),
        driftMismatches: z.int(),
      })
      .array(),
  }),
  {
    name: 'GetContractVerificationStatusOutput',
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Contract
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Query to retrieve per-contract verification status for the impact report.
 */
export const GetContractVerificationStatusQuery = defineQuery({
  meta: {
    key: 'report.getContractVerificationStatus',
    title: 'Get Contract Verification Status',
    version: '1.0.0',
    description:
      'Retrieves per-contract verification status for the impact report.',
    goal: 'Enable stakeholders to see contract health at a glance.',
    context:
      "Part of the impact report domain. Reads from drift check outputs and verified.json to provide a consolidated view of each contract's drift debt and surface coverage.",
    domain: REPORT_DOMAIN,
    owners: REPORT_OWNERS,
    tags: REPORT_TAGS,
    stability: REPORT_STABILITY,
  },
  io: {
    input: GetContractVerificationStatusInput,
    output: GetContractVerificationStatusOutput,
    errors: {
      PROJECT_NOT_FOUND: {
        description: 'Project path does not exist.',
        http: 404,
        when: 'The provided projectPath does not resolve to a valid directory.',
      },
    },
  },
  policy: {
    auth: 'anonymous',
    pii: [],
  },
});
