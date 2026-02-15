import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';

export const DocsGeneratedPayload = new SchemaModel({
  name: 'DocsGeneratedPayload',
  fields: {
    buildId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    generatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    outputDir: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    artifactCount: { type: ScalarTypeEnum.Int_unsecure(), isOptional: true },
    warnings: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
      isArray: true,
    },
  },
});

export const DocsGeneratedEvent = defineEvent({
  meta: {
    key: 'docs.generated',
    version: '1.0.0',
    description: 'Emitted when documentation artifacts are generated.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'generation'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-generator')],
  },
  payload: DocsGeneratedPayload,
});
