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

The generator writes a typed index plus markdown content.

Content is stored under `--content-root` (defaults to `--source`). If
`--version` is provided, both the index and content are nested under that
version subdirectory.

If `--version` is provided:

```
<outDir>/<version>/docs-index.generated.ts
<contentRoot>/<version>/**/*.md
```

Without `--version`:

```
<outDir>/docs-index.generated.ts
<contentRoot>/**/*.md
```

The index contains `docsIndex` entries and `docsIndexMeta`:

```ts
export const docsIndex = [
  {
    id: "commands/create-order",
    title: "Create Order",
    summary: "...",
    route: "/docs/reference/commands/create-order",
    source: "generated",
    contentPath: "commands/create-order.md",
  },
];

export const docsIndexMeta = {
  generatedAt: "...",
  total: 1,
  version: "v1.0.0",
  contentRoot: "../../../../generated/docs",
};
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
