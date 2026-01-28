import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_CAPABILITY_REF,
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';
import { DocsGeneratedEvent } from '../events/docsGenerated.event';

const DocsArtifactModel = new SchemaModel({
  name: 'DocsArtifact',
  fields: {
    path: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    format: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    bytes: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const DocsGenerateInput = new SchemaModel({
  name: 'DocsGenerateInput',
  fields: {
    workspaceRoot: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    outputDir: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    formats: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
    includeInternal: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    includeExperimental: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    contractFilter: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    docblockFilter: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: true },
  },
});

const DocsGenerateOutput = new SchemaModel({
  name: 'DocsGenerateOutput',
  fields: {
    buildId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    generatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    outputDir: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    artifacts: { type: DocsArtifactModel, isOptional: true, isArray: true },
    warnings: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const DocsGenerateCommand = defineCommand({
  meta: {
    key: 'docs.generate',
    title: 'Generate Documentation',
    version: '1.0.0',
    description: 'Generate documentation artifacts from ContractSpecs.',
    goal: 'Produce up-to-date reference docs and guides from specs and DocBlocks.',
    context:
      'Used by CLI and CI to keep docs in sync with contract definitions.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'generation'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-generator')],
  },
  capability: DOCS_CAPABILITY_REF,
  io: {
    input: DocsGenerateInput,
    output: DocsGenerateOutput,
    errors: {
      OUTPUT_WRITE_FAILED: {
        description: 'Failed to write generated docs output.',
        http: 500,
        when: 'The generator cannot persist artifacts to the output path.',
      },
    },
  },
  policy: {
    auth: 'admin',
    pii: [],
  },
  sideEffects: {
    emits: [
      {
        ref: DocsGeneratedEvent.meta,
        when: 'Docs generation completes successfully.',
      },
    ],
  },
});
