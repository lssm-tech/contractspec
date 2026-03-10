export type DocsIndexSource = 'generated' | 'docblock';

export interface DocsIndexEntry {
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
}

export interface DocsIndexChunk {
  key: string;
  file: string;
  total: number;
}

export interface DocsIndexManifest {
  generatedAt: string;
  total: number;
  version: string | null;
  contentRoot: string | null;
  chunks: DocsIndexChunk[];
}

export const DOCS_INDEX_MANIFEST = 'docs-index.manifest.json';
