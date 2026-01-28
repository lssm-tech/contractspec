import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineQuery } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_CAPABILITY_REF,
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';

export const DocSummaryModel = new SchemaModel({
  name: 'DocSummary',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    route: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    visibility: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const DocsIndexInput = new SchemaModel({
  name: 'DocsIndexInput',
  fields: {
    query: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tag: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    visibility: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    limit: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    offset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const DocsIndexOutput = new SchemaModel({
  name: 'DocsIndexOutput',
  fields: {
    items: { type: DocSummaryModel, isOptional: true, isArray: true },
    docs: { type: DocSummaryModel, isOptional: false, isArray: true },
    total: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    nextOffset: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
  },
});

export const DocsIndexQuery = defineQuery({
  meta: {
    key: 'docs.search',
    title: 'Docs Index',
    version: '1.0.0',
    description: 'Search and filter DocBlocks by query, tag, or visibility.',
    goal: 'Provide a consistent index of documentation entries for UI and MCP.',
    context:
      'Used by docs surfaces to list and filter DocBlocks without coupling to storage.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'search', 'index'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-search')],
  },
  capability: DOCS_CAPABILITY_REF,
  io: {
    input: DocsIndexInput,
    output: DocsIndexOutput,
  },
  policy: {
    auth: 'anonymous',
    pii: [],
  },
});
