import type { DocsIndexEntry } from '../generated/docs-index.generated';
import { DocsReferenceContent } from './DocsReferenceContent';

interface DocsReferencePageProps {
  entry: DocsIndexEntry;
  content: string;
}

export function DocsReferencePage({ entry, content }: DocsReferencePageProps) {
  return <DocsReferenceContent entry={entry} content={content} />;
}
