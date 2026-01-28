import { defineDataView } from '../../data-views';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';
import { ContractReferenceQuery } from '../queries/contractReference.query';

export const ContractReferenceDataView = defineDataView({
  meta: {
    key: 'docs.contract.reference.view',
    title: 'Contract Reference',
    version: '1.0.0',
    description: 'Detail view for a single contract reference.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'reference'],
    stability: DOCS_STABILITY,
    entity: 'contract-reference',
    docId: [docId('docs.tech.docs-reference')],
  },
  source: {
    primary: {
      key: ContractReferenceQuery.meta.key,
      version: ContractReferenceQuery.meta.version,
    },
  },
  view: {
    kind: 'detail',
    fields: [
      {
        key: 'key',
        label: 'Key',
        dataPath: 'reference.key',
      },
      {
        key: 'version',
        label: 'Version',
        dataPath: 'reference.version',
      },
      {
        key: 'type',
        label: 'Type',
        dataPath: 'reference.type',
      },
      {
        key: 'title',
        label: 'Title',
        dataPath: 'reference.title',
      },
      {
        key: 'description',
        label: 'Description',
        dataPath: 'reference.description',
      },
      {
        key: 'tags',
        label: 'Tags',
        dataPath: 'reference.tags',
      },
      {
        key: 'owners',
        label: 'Owners',
        dataPath: 'reference.owners',
      },
      {
        key: 'stability',
        label: 'Stability',
        dataPath: 'reference.stability',
      },
    ],
    primaryField: 'title',
    secondaryFields: ['description'],
  },
  policy: {
    flags: [],
    pii: [],
  },
});
