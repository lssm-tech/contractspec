# ContractSpec Docs Generator

CLI tool for generating documentation artifacts from ContractSpec specs and DocBlocks.

## Usage

```bash
bunx contractspec-docs generate
```

From the monorepo root:

```bash
bun docs:generate
```

## Options

- `--source <dir>`: Source directory for generated markdown (default: `generated/docs`).
- `--out <dir>`: Output directory for generated artifacts (default: `packages/bundles/library/src/components/docs/generated`).
- `--content-root <dir>`: Root directory for docs content (default: `--source`).
- `--route-prefix <prefix>`: Route prefix for generated reference pages (default: `/docs/reference`).
- `--version <version>`: Output version subdirectory (e.g., `v1.0.0`).
- `--no-docblocks`: Skip DocBlocks from the docs registry.

## Output

The generator writes a typed index manifest plus markdown content.

Note: the `docblocks/` folder under the content root is ignored when scanning
source markdown to avoid re-indexing DocBlocks on subsequent runs.

Content is stored under `--content-root` (defaults to `--source`). If
`--version` is provided, both the index and content are nested under that
version subdirectory.

If `--version` is provided:

```
<outDir>/<version>/docs-index.generated.ts
<outDir>/<version>/docs-index.manifest.json
<outDir>/<version>/docs-index.*.json
<contentRoot>/<version>/**/*.md
```

Without `--version`:

```
<outDir>/docs-index.generated.ts
<outDir>/docs-index.manifest.json
<outDir>/docs-index.*.json
<contentRoot>/**/*.md
```

The index contains `docsIndex` entries and `docsIndexMeta`:

```ts
export type DocsIndexEntry = {
  id: string;
  title: string;
  summary?: string;
  route?: string;
  source: "generated" | "docblock";
  contentPath?: string;
  tags?: string[];
  kind?: string;
  visibility?: string;
  version?: string;
  owners?: string[];
};

export type DocsIndexManifest = {
  generatedAt: string;
  total: number;
  version: string | null;
  contentRoot: string | null;
  chunks: { key: string; file: string; total: number }[];
};

export const DOCS_INDEX_MANIFEST = "docs-index.manifest.json";
```

## Examples

```bash
bunx contractspec-docs generate \
  --source generated/docs \
  --out packages/bundles/library/src/components/docs/generated \
  --route-prefix /docs/reference \
  --version v1.0.0
```

```bash
bunx contractspec-docs generate --no-docblocks
```
