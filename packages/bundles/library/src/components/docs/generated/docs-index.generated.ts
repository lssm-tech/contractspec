export type DocsIndexSource = 'generated' | 'docblock';

export type DocsIndexEntry = {
  id: string;
  title: string;
  summary?: string;
  route?: string;
  source: DocsIndexSource;
  contentPath?: string;
  tags?: string[];
  kind?: string;
  visibility?: string;
  version?: string;
  owners?: string[];
};

export type DocsIndexChunk = {
  key: string;
  file: string;
  total: number;
};

export type DocsIndexManifest = {
  generatedAt: string;
  total: number;
  version: string | null;
  contentRoot: string | null;
  chunks: DocsIndexChunk[];
};

export const DOCS_INDEX_MANIFEST = "docs-index.manifest.json";
