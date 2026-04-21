import { listGeneratedDocs } from '../generated';
import { DocsReferenceIndexClient } from './DocsReferenceIndexClient';

export async function DocsReferenceIndexPage() {
	const entries = await listGeneratedDocs();
	return <DocsReferenceIndexClient entries={entries} />;
}
