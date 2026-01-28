import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { docsIndex, docsIndexMeta } from './docs-index.generated';
import type { DocsIndexEntry } from './docs-index.generated';

interface DocsIndexMeta {
  contentRoot?: string | null;
}

const baseDir = dirname(fileURLToPath(import.meta.url));
const contentRoot = (() => {
  const meta = docsIndexMeta as DocsIndexMeta;
  const root = meta.contentRoot ?? '.';
  return join(baseDir, root);
})();

export function listGeneratedDocs(): readonly DocsIndexEntry[] {
  return docsIndex;
}

export async function getGeneratedDocById(id: string): Promise<{
  entry: DocsIndexEntry;
  content: string;
} | null> {
  const entry = docsIndex.find((doc) => doc.id === id);
  if (!entry || !entry.contentPath) return null;

  const contentPath = join(contentRoot, entry.contentPath);
  try {
    const content = await readFile(contentPath, 'utf8');
    return { entry, content };
  } catch {
    return null;
  }
}
