# Product Intent Example Application

This example demonstrates how to use the **Product Intent** layer and
utility functions to ingest evidence and prepare it for the Cursor for
PM workflow.

This example ships with a synthetic evidence dataset under the
`evidence` directory. The contents were extracted from
`evidence_dataset.zip` and include interview transcripts, support
tickets, public threads and analytics summaries. The sample script
reads markdown files from the `interviews`, `tickets` and `public`
subdirectories, strips any YAML front matter, splits the transcripts
into fixed‑size evidence chunks and formats them for embedding into
language model prompts using the helper functions from
`product-intent-utils`.

## Running the example

1. Install dependencies in the workspace root if you haven't already.
   This example assumes you have `node` and `npm` (or `yarn`) set up.

   ```bash
   npm install
   ```

2. Execute the script using `ts-node` (or compile it with the
   TypeScript compiler first). From the repository root:

   ```bash
   npx ts-node packages/example/product-intent-example/index.ts
   ```

   You should see a count of the loaded evidence chunks followed by a
   JSON document that can be embedded into prompts via
   `formatEvidenceForModel`. This is not a full demonstration of the
   discovery pipeline (you still need to implement the runtime and LLM
   integration), but it shows how to load the dataset, chunk it and
   prepare the JSON input for language models.
