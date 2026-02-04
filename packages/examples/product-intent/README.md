# Product Intent Example

Website: https://contractspec.io/

Minimal example showing how to load a synthetic evidence dataset and prepare it for the product-intent discovery workflow.

## What it demonstrates

- Loading interview, ticket, and public thread transcripts from `evidence/`.
- Chunking transcripts into evidence chunks with stable ids.
- Formatting evidence as JSON for LLM prompts.

## Running the script

From the repository root:

```bash
bun install
bun tsx packages/examples/product-intent/src/script.ts
```

You should see a count of evidence chunks followed by the JSON payload produced by `formatEvidenceForModel`.
