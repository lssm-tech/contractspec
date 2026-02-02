import { definePresentation } from '../../presentations';
import '../ensure-docblocks';
import { docId } from '../registry';
import {
  DOCS_DOMAIN,
  DOCS_LAYOUT_PRESENTATION_KEY,
  DOCS_OWNERS,
  DOCS_STABILITY,
  DOCS_TAGS,
} from '../constants';

export const DocsLayoutPresentation = definePresentation({
  meta: {
    key: DOCS_LAYOUT_PRESENTATION_KEY,
    title: 'Docs Layout',
    version: '1.0.0',
    description: 'Shared layout shell for documentation pages.',
    goal: 'Provide consistent navigation, layout, and docs UI scaffolding.',
    context: 'Used by web docs surfaces to render DocBlock-based content.',
    domain: DOCS_DOMAIN,
    owners: DOCS_OWNERS,
    tags: [...DOCS_TAGS, 'layout'],
    stability: DOCS_STABILITY,
    docId: [docId('docs.tech.docs-system')],
  },
  capability: {
    key: 'docs.system',
    version: '1.0.0',
  },
  source: {
    type: 'component',
    framework: 'react',
    componentKey: DOCS_LAYOUT_PRESENTATION_KEY,
  },
  targets: ['react'],
});
