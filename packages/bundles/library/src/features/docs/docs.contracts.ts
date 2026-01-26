/**
 * ContractSpec Docs operation contracts.
 * Defines schema models and operation specs at module level for static analysis.
 */

import { defineCommand } from '@contractspec/lib.contracts';
import { defineSchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';

const DOC_OWNERS = ['@contractspec'];
const DOC_TAGS = ['docs', 'mcp'];

// Schema Models

export const DocSummaryModel = defineSchemaModel({
  name: 'DocSummary',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    title: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    summary: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    route: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    visibility: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    tags: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const DocSearchInput = defineSchemaModel({
  name: 'DocSearchInput',
  fields: {
    query: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    tag: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    visibility: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
  },
});

export const DocSearchOutput = defineSchemaModel({
  name: 'DocSearchOutput',
  fields: {
    docs: { type: DocSummaryModel, isOptional: false, isArray: true },
  },
});

// Operation Specs

/**
 * docs.search operation spec.
 * Filters DocBlocks by query, tag, or visibility for MCP discovery.
 */
export const docsSearchSpec = defineCommand({
  meta: {
    key: 'docs.search',
    version: '1.0.0',
    stability: 'stable',
    owners: DOC_OWNERS,
    tags: DOC_TAGS,
    description:
      'Filter DocBlocks by query, tag, or visibility for MCP search.',
    goal: 'Expose ContractSpec documentation to AI agents safely.',
    context:
      'Used by the docs MCP to keep AI agents on the canonical DocBlocks.',
  },
  io: {
    input: DocSearchInput,
    output: DocSearchOutput,
  },
  policy: {
    auth: 'anonymous',
  },
});
