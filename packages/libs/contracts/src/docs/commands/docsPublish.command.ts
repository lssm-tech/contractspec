import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineCommand } from '../../operations';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';
import { DocsPublishedEvent } from '../events/docsPublished.event';

const DocsPublishInput = new SchemaModel({
  name: 'DocsPublishInput',
  fields: {
    buildId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    deployTarget: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    artifactPath: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    dryRun: { type: ScalarTypeEnum.Boolean(), isOptional: true },
    notes: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const DocsPublishOutput = new SchemaModel({
  name: 'DocsPublishOutput',
  fields: {
    publishId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    publishedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    url: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    warnings: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const DocsPublishCommand = defineCommand({
  meta: {
    key: 'docs.publish',
    title: 'Publish Documentation',
    version: '1.0.0',
    description: 'Publish generated documentation artifacts.',
    goal: 'Deploy docs to the public docs surface with consistent versioning.',
    context:
      'Used by release pipelines to push generated docs to hosting targets.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'publish'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-publish')],
  },
  capability: {
    key: 'docs.system',
    version: '1.0.0',
  },
  io: {
    input: DocsPublishInput,
    output: DocsPublishOutput,
    errors: {
      DEPLOY_FAILED: {
        description: 'Failed to deploy documentation artifacts.',
        http: 500,
        when: 'The docs publish step fails to deploy to the target host.',
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
        ref: DocsPublishedEvent.meta,
        when: 'Docs publish completes successfully.',
      },
    ],
  },
});
