import { SchemaModel, ScalarTypeEnum } from '@contractspec/lib.schema';
import { defineFormSpec } from '../../forms/forms';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';

const DocsSearchFormModel = new SchemaModel({
  name: 'DocsSearchFormModel',
  fields: {
    query: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    visibility: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    kind: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

export const DocsSearchForm = defineFormSpec({
  meta: {
    key: 'docs.search.form',
    title: 'Docs Search',
    version: '1.0.0',
    description: 'Search form for documentation discovery.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'search'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-search')],
  },
  model: DocsSearchFormModel,
  fields: [
    {
      kind: 'text',
      name: 'query',
      labelI18n: 'Search',
      placeholderI18n: 'Search docs',
    },
    {
      kind: 'select',
      name: 'visibility',
      labelI18n: 'Visibility',
      options: {
        kind: 'static',
        options: [
          { labelI18n: 'Public', value: 'public' },
          { labelI18n: 'Internal', value: 'internal' },
          { labelI18n: 'Mixed', value: 'mixed' },
        ],
      },
    },
    {
      kind: 'select',
      name: 'kind',
      labelI18n: 'Kind',
      options: {
        kind: 'static',
        options: [
          { labelI18n: 'Goal', value: 'goal' },
          { labelI18n: 'How', value: 'how' },
          { labelI18n: 'Usage', value: 'usage' },
          { labelI18n: 'Reference', value: 'reference' },
          { labelI18n: 'FAQ', value: 'faq' },
          { labelI18n: 'Changelog', value: 'changelog' },
        ],
      },
    },
  ],
  actions: [
    {
      key: 'search',
      labelI18n: 'Search',
    },
  ],
  policy: {
    flags: [],
    pii: [],
  },
});
