import { defaultDocRegistry } from '@contractspec/lib.contracts/docs';
import { join, relative, resolve, sep } from 'node:path';
import { ensureDir, listMarkdownFiles, readText, writeText } from './fs';
import { extractSummary, extractTitle } from './markdown';
import type { DocsIndexEntry, GenerateOptions, GenerateResult } from './types';

function normalizeId(pathValue: string): string {
  return pathValue.split(sep).join('/').replace(/\.md$/, '');
}

function buildGeneratedRoute(routePrefix: string, id: string): string {
  const cleanPrefix = routePrefix.endsWith('/')
    ? routePrefix.slice(0, -1)
    : routePrefix;
  return `${cleanPrefix}/${id}`;
}

interface DocsIndexChunk {
  key: string;
  file: string;
  total: number;
}

interface DocsIndexManifest {
  generatedAt: string;
  total: number;
  version: string | null;
  contentRoot: string | null;
  chunks: DocsIndexChunk[];
}

function buildIndexTypesFile(): string {
  return [
    "export type DocsIndexSource = 'generated' | 'docblock';",
    '',
    'export type DocsIndexEntry = {',
    '  id: string;',
    '  title: string;',
    '  summary?: string;',
    '  route?: string;',
    '  source: DocsIndexSource;',
    '  contentPath?: string;',
    '  tags?: string[];',
    '  kind?: string;',
    '  visibility?: string;',
    '  version?: string;',
    '  owners?: string[];',
    '};',
    '',
    'export type DocsIndexChunk = {',
    '  key: string;',
    '  file: string;',
    '  total: number;',
    '};',
    '',
    'export type DocsIndexManifest = {',
    '  generatedAt: string;',
    '  total: number;',
    '  version: string | null;',
    '  contentRoot: string | null;',
    '  chunks: DocsIndexChunk[];',
    '};',
    '',
    'export const DOCS_INDEX_MANIFEST = "docs-index.manifest.json";',
    '',
  ].join('\n');
}

function chunkKeyForId(id: string): string {
  if (!id) return '_common';
  if (id.includes('/')) {
    const [prefix] = id.split('/');
    return prefix || '_common';
  }
  return '_common';
}

function buildChunkFileName(
  key: string,
  usedNames: Map<string, number>
): string {
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '-');
  const baseName = `docs-index.${safeKey || 'common'}.json`;
  const count = usedNames.get(baseName) ?? 0;
  const fileName =
    count === 0 ? baseName : baseName.replace(/\.json$/, `-${count}.json`);
  usedNames.set(baseName, count + 1);
  return fileName;
}

export async function generateDocs(
  options: GenerateOptions
): Promise<GenerateResult> {
  const outputDir = options.version
    ? join(options.outDir, options.version)
    : options.outDir;
  const contentRootBase = options.contentRoot ?? options.sourceDir;
  const contentRoot = options.version
    ? join(contentRootBase, options.version)
    : contentRootBase;
  const resolvedOutputDir = resolve(outputDir);
  const resolvedSourceDir = resolve(options.sourceDir);
  const resolvedContentRoot = resolve(contentRoot);
  const shouldCopyContent = resolvedContentRoot !== resolvedSourceDir;
  const contentRootRelative =
    relative(resolvedOutputDir, resolvedContentRoot) || '.';
  await ensureDir(outputDir);
  if (shouldCopyContent) {
    await ensureDir(contentRoot);
  }

  const markdownFiles = await listMarkdownFiles(options.sourceDir, {
    excludeDirs: ['docblocks'],
  });
  const entries: DocsIndexEntry[] = [];

  for (const filePath of markdownFiles) {
    const relativePath = normalizeId(relative(options.sourceDir, filePath));
    const contentPath = `${relativePath}.md`;
    const targetPath = join(contentRoot, contentPath);

    const content = await readText(filePath);
    const title = extractTitle(content, relativePath);
    const summary = extractSummary(content);
    const route = buildGeneratedRoute(options.routePrefix, relativePath);

    if (shouldCopyContent) {
      await writeText(targetPath, content);
    }

    entries.push({
      id: relativePath,
      title,
      summary,
      route,
      source: 'generated',
      contentPath,
    });
  }

  let docblockCount = 0;
  if (options.includeDocblocks) {
    const routes = defaultDocRegistry.list();

    for (const entry of routes) {
      if (!entry?.block) {
        continue;
      }
      const { block, route } = entry;
      if (!block.id) {
        continue;
      }

      const docPath = `docblocks/${block.id.replace(/\./g, '/')}.md`;
      const targetPath = join(contentRoot, docPath);
      await writeText(targetPath, String(block.body ?? ''));

      entries.push({
        id: block.id,
        title: block.title,
        summary: block.summary,
        route,
        source: 'docblock',
        contentPath: docPath,
        tags: block.tags,
        kind: block.kind,
        visibility: block.visibility,
        version: block.version,
        owners: block.owners,
      });
      docblockCount += 1;
    }
  }

  const generatedAt = new Date().toISOString();
  const chunkMap = new Map<string, DocsIndexEntry[]>();
  for (const entry of entries) {
    const key = chunkKeyForId(entry.id);
    const bucket = chunkMap.get(key) ?? [];
    bucket.push(entry);
    chunkMap.set(key, bucket);
  }

  const usedNames = new Map<string, number>();
  const chunks: DocsIndexChunk[] = [];
  for (const [key, chunkEntries] of chunkMap) {
    chunkEntries.sort((a, b) => a.id.localeCompare(b.id));
    const file = buildChunkFileName(key, usedNames);
    await writeText(
      join(outputDir, file),
      JSON.stringify(chunkEntries, null, 2)
    );
    chunks.push({
      key,
      file,
      total: chunkEntries.length,
    });
  }

  chunks.sort((a, b) => a.key.localeCompare(b.key));

  const manifest: DocsIndexManifest = {
    generatedAt,
    total: entries.length,
    version: options.version ?? null,
    contentRoot: contentRootRelative || null,
    chunks,
  };

  await writeText(
    join(outputDir, 'docs-index.manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  const indexTypes = buildIndexTypesFile();
  await writeText(join(outputDir, 'docs-index.generated.ts'), indexTypes);

  return {
    total: entries.length,
    generated: markdownFiles.length,
    docblocks: docblockCount,
    outputDir,
    contentRoot,
    version: options.version,
  };
}
