import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';

export const SourceDocumentModel = defineSchemaModel({
  name: 'SourceDocument',
  description:
    'Immutable raw source document metadata referencing a stored file.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    authority: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fetchedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    hash: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    fileId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const SourceRefModel = defineSchemaModel({
  name: 'SourceRef',
  description: 'Reference to a source document used to justify a rule version.',
  fields: {
    sourceDocumentId: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: false,
    },
    excerpt: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const RuleModel = defineSchemaModel({
  name: 'Rule',
  description:
    'Curated rule (stable identity) with topic + jurisdiction scope.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    topicKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const RuleVersionModel = defineSchemaModel({
  name: 'RuleVersion',
  description:
    'A versioned rule content with source references and approval status.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    ruleId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    topicKey: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.Int_unsecure(), isOptional: false },
    content: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    sourceRefs: { type: SourceRefModel, isArray: true, isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false }, // draft|approved|rejected
    approvedBy: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    approvedAt: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const KBSnapshotModel = defineSchemaModel({
  name: 'KBSnapshot',
  description:
    'Published KB snapshot (as-of) referencing approved rule versions.',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    jurisdiction: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    asOfDate: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    includedRuleVersionIds: {
      type: ScalarTypeEnum.String_unsecure(),
      isArray: true,
      isOptional: false,
    },
    publishedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});
