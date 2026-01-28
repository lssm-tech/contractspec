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

function buildIndexFile(
  entries: DocsIndexEntry[],
  version?: string,
  contentRoot?: string
): string {
  const serialized = JSON.stringify(entries, null, 2);
  const generatedAt = new Date().toISOString();

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
    `export const docsIndex = ${serialized} as const;`,
    '',
    'export const docsIndexMeta = {',
    `  generatedAt: ${JSON.stringify(generatedAt)},`,
    `  total: ${entries.length},`,
    `  version: ${JSON.stringify(version ?? null)},`,
    `  contentRoot: ${JSON.stringify(contentRoot ?? null)},`,
    '};',
    '',
  ].join('\n');
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
  if (shouldCopyContent) {
    await ensureDir(contentRoot);
  }

  const markdownFiles = await listMarkdownFiles(options.sourceDir);
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

  const indexFile = buildIndexFile(
    entries,
    options.version,
    contentRootRelative
  );
  await writeText(join(outputDir, 'docs-index.generated.ts'), indexFile);

  return {
    total: entries.length,
    generated: markdownFiles.length,
    docblocks: docblockCount,
    outputDir,
    contentRoot,
    version: options.version,
  };
}
