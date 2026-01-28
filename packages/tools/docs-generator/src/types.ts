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

export interface GenerateOptions {
  sourceDir: string;
  outDir: string;
  contentRoot?: string;
  includeDocblocks: boolean;
  routePrefix: string;
  version?: string;
}

export interface GenerateResult {
  total: number;
  generated: number;
  docblocks: number;
  outputDir: string;
  contentRoot: string;
  version?: string;
}
