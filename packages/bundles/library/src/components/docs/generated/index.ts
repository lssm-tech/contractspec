export type {
	DocsIndexEntry,
	DocsIndexManifest,
	DocsIndexSource,
} from './docs-index.generated';

import type { DocsIndexEntry, DocsIndexManifest } from './docs-index.generated';

export async function getDocsIndexManifest(): Promise<DocsIndexManifest> {
	const { getDocsIndexManifest: loadManifest } = await import('./loader');
	return loadManifest();
}

export async function listGeneratedDocs(): Promise<readonly DocsIndexEntry[]> {
	const { listGeneratedDocs: loadDocs } = await import('./loader');
	return loadDocs();
}

export async function getGeneratedDocById(id: string): Promise<{
	entry: DocsIndexEntry;
	content: string;
} | null> {
	const { getGeneratedDocById: loadDoc } = await import('./loader');
	return loadDoc(id);
}
