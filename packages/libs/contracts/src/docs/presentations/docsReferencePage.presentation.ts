import { definePresentation } from '../../presentations';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';

export const DocsReferencePagePresentation = definePresentation({
  meta: {
    key: 'docs.reference.page',
    title: 'Docs Reference Page',
    version: '1.0.0',
    description: 'Reference page layout for contract documentation.',
    goal: 'Render contract references with consistent metadata and formatting.',
    context:
      'Used by docs surfaces to present contract reference content and schemas.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'reference'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-reference')],
  },
  capability: {
    key: 'docs.system',
    version: '1.0.0',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: 'docsReferencePage',
  },
  targets: ['react', 'markdown'],
});
