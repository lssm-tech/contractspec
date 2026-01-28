import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_INDEX_MANIFEST } from './docs-index.generated';
import type { DocsIndexEntry, DocsIndexManifest } from './docs-index.generated';

const baseDir = dirname(fileURLToPath(import.meta.url));
let manifestPromise: Promise<DocsIndexManifest> | null = null;
let docsPromise: Promise<DocsIndexEntry[]> | null = null;
const chunkCache = new Map<string, Promise<DocsIndexEntry[]>>();

function chunkKeyForId(id: string): string {
  if (!id) return '_common';
  if (id.includes('/')) {
    const [prefix] = id.split('/');
    return prefix || '_common';
  }
  return '_common';
}

async function loadManifest(): Promise<DocsIndexManifest> {
  if (!manifestPromise) {
    manifestPromise = readFile(join(baseDir, DOCS_INDEX_MANIFEST), 'utf8').then(
      (content) => JSON.parse(content) as DocsIndexManifest
    );
  }
  return manifestPromise;
}

function resolveContentRoot(manifest: DocsIndexManifest): string {
  const root = manifest.contentRoot ?? '.';
  return join(baseDir, root);
}

async function loadChunk(fileName: string): Promise<DocsIndexEntry[]> {
  const cached = chunkCache.get(fileName);
  if (cached) return cached;

  const load = readFile(join(baseDir, fileName), 'utf8').then(
    (content) => JSON.parse(content) as DocsIndexEntry[]
  );
  chunkCache.set(fileName, load);
  return load;
}

export async function listGeneratedDocs(): Promise<readonly DocsIndexEntry[]> {
  if (!docsPromise) {
    docsPromise = (async () => {
      const manifest = await loadManifest();
      const chunks = await Promise.all(
        manifest.chunks.map((chunk) => loadChunk(chunk.file))
      );
      return chunks.flat();
    })();
  }

  return docsPromise;
}

export async function getDocsIndexManifest(): Promise<DocsIndexManifest> {
  return loadManifest();
}

export async function getGeneratedDocById(id: string): Promise<{
  entry: DocsIndexEntry;
  content: string;
} | null> {
  const manifest = await loadManifest();
  const key = chunkKeyForId(id);
  const chunk = manifest.chunks.find((item) => item.key === key);
  if (!chunk) return null;

  const entries = await loadChunk(chunk.file);
  const entry = entries.find((doc) => doc.id === id);
  if (!entry || !entry.contentPath) return null;

  const contentPath = join(resolveContentRoot(manifest), entry.contentPath);
  try {
    const content = await readFile(contentPath, 'utf8');
    return { entry, content };
  } catch {
    return null;
  }
}
