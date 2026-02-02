import { listGeneratedDocs } from '../generated/loader';
import { DocsReferenceIndexClient } from './DocsReferenceIndexClient';

export async function DocsReferenceIndexPage() {
  const entries = await listGeneratedDocs();
  return <DocsReferenceIndexClient entries={entries} />;
}
