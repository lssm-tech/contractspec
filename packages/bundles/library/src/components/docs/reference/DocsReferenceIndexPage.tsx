import { docsIndex } from '../generated/docs-index.generated';
import { DocsReferenceIndexClient } from './DocsReferenceIndexClient';

export function DocsReferenceIndexPage() {
  return <DocsReferenceIndexClient entries={docsIndex} />;
}
