import { defineCommand, defineQuery } from '@lssm/lib.contracts';
import { ScalarTypeEnum, defineSchemaModel } from '@lssm/lib.schema';

import {
  KBSnapshotModel,
  RuleVersionModel,
  SourceDocumentModel,
  SourceRefModel,
} from '../entities/models';

const IngestSourceInput = defineSchemaModel({
  name: 'KbIngestSourceInput',
  description: 'Ingest immutable source metadata referencing a stored file.',
  fields: {
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    authority: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fetchedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    hash: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const UpsertRuleVersionInput = defineSchemaModel({
  name: 'KbUpsertRuleVersionInput',
  description: 'Create a new draft rule version (immutable history).',
  fields: {
    ruleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceRefs: { type: SourceRefModel, isArray: true, isOptional: false },
  },
});

const ApproveRuleVersionInput = defineSchemaModel({
  name: 'KbApproveRuleVersionInput',
  description: 'Approve a rule version (human verification).',
  fields: {
    ruleVersionId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    approver: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const PublishSnapshotInput = defineSchemaModel({
  name: 'KbPublishSnapshotInput',
  description: 'Publish a snapshot for a jurisdiction as-of a date.',
  fields: {
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    asOfDate: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

const SearchKbInput = defineSchemaModel({
  name: 'KbSearchInput',
  description: 'Search within a published snapshot.',
  fields: {
    snapshotId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    query: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const SearchKbResultItem = defineSchemaModel({
  name: 'KbSearchResultItem',
  description: 'Search result referencing a specific rule version.',
  fields: {
    ruleVersionId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    excerpt: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const SearchKbOutput = defineSchemaModel({
  name: 'KbSearchOutput',
  description: 'Search results constrained to snapshot + jurisdiction.',
  fields: {
    items: { type: SearchKbResultItem, isArray: true, isOptional: false },
  },
});

export const KbIngestSourceContract = defineCommand({
  meta: {
    key: 'kb.ingestSource',
    title: 'Ingest Source',
    version: 1,
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge', 'sources', 'ingestion'],
    description: 'Ingest immutable source document metadata.',
    goal: 'Store traceable source documents for curated KB.',
    context: 'Called when an admin uploads/records authoritative sources.',
  },
  io: {
    input: IngestSourceInput,
    output: SourceDocumentModel,
  },
  policy: { auth: 'user' },
});

export const KbUpsertRuleVersionContract = defineCommand({
  meta: {
    key: 'kb.upsertRuleVersion',
    title: 'Upsert Rule Version',
    version: 1,
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge', 'rules', 'versioning'],
    description: 'Create a new draft rule version with source references.',
    goal: 'Propose curated knowledge updates with traceability.',
    context: 'Automation or curators propose draft rule versions.',
  },
  io: {
    input: UpsertRuleVersionInput,
    output: RuleVersionModel,
    errors: {
      SOURCE_REFS_REQUIRED: {
        description: 'Rule version must cite at least one sourceRef',
        http: 400,
        gqlCode: 'SOURCE_REFS_REQUIRED',
        when: 'sourceRefs is empty',
      },
      RULE_NOT_FOUND: {
        description: 'Rule does not exist',
        http: 404,
        gqlCode: 'RULE_NOT_FOUND',
        when: 'ruleId is unknown',
      },
    },
  },
  policy: { auth: 'user' },
});

export const KbApproveRuleVersionContract = defineCommand({
  meta: {
    key: 'kb.approveRuleVersion',
    title: 'Approve Rule Version',
    version: 1,
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge', 'rules', 'approval'],
    description: 'Approve a draft rule version.',
    goal: 'Human verification step before publishing snapshots.',
    context: 'Curators/experts approve proposed KB changes.',
  },
  io: {
    input: ApproveRuleVersionInput,
    output: RuleVersionModel,
  },
  policy: { auth: 'user' },
});

export const KbPublishSnapshotContract = defineCommand({
  meta: {
    key: 'kb.publishSnapshot',
    title: 'Publish Snapshot',
    version: 1,
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge', 'snapshots', 'publishing'],
    description: 'Publish a KB snapshot for a jurisdiction.',
    goal: 'Create a stable snapshot that assistant answers can cite.',
    context:
      'Publishing happens after approvals; snapshot is referenced by answers.',
  },
  io: {
    input: PublishSnapshotInput,
    output: KBSnapshotModel,
    errors: {
      NO_APPROVED_RULES: {
        description: 'No approved rule versions available to publish',
        http: 409,
        gqlCode: 'NO_APPROVED_RULES',
        when: 'jurisdiction has zero approved rule versions',
      },
    },
  },
  policy: { auth: 'user' },
});

export const KbSearchContract = defineQuery({
  meta: {
    key: 'kb.search',
    title: 'Search KB',
    version: 1,
    stability: 'experimental',
    owners: ['@examples'],
    tags: ['knowledge', 'search', 'snapshots'],
    description: 'Search within a published KB snapshot.',
    goal: 'Provide scoped retrieval for assistant answers.',
    context: 'Assistant queries curated rules from a specific snapshot.',
  },
  io: {
    input: SearchKbInput,
    output: SearchKbOutput,
  },
  policy: { auth: 'user' },
});
