import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';
import { defineEvent } from '../../events';
import {
	DOCS_DOMAIN,
	DOCS_OWNERS,
	DOCS_STABILITY,
	DOCS_TAGS,
} from '../constants';
import { docId } from '../registry';

export const DocsPublishedPayload = new SchemaModel({
	name: 'DocsPublishedPayload',
	fields: {
		publishId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
		version: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		environment: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		url: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		publishedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
		status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
		warnings: {
			type: ScalarTypeEnum.String_unsecure(),
			isOptional: true,
			isArray: true,
		},
	},
});

export const DocsPublishedEvent = defineEvent({
	meta: {
		key: 'docs.published',
		version: '1.0.0',
		description: 'Emitted when documentation is published.',
		domain: DOCS_DOMAIN,
		owners: DOCS_OWNERS,
		tags: [...DOCS_TAGS, 'publish'],
		stability: DOCS_STABILITY,
		docId: [docId('docs.tech.docs-publish')],
	},
	payload: DocsPublishedPayload,
});
