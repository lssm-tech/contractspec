# Product Intent Utilities

This package contains utility functions, prompt builders and
validators used by the **Cursor for Product Managers** workflow. It
builds on top of the `product-intent` layer defined in the
`@lssm/contractspec` contracts library.

## Structure

* `prompts.ts` – Helper functions to construct prompts for the
  language model. The prompts are designed to force the model to
  produce JSON‑only responses, enforce citation requirements and
  generate structured outputs (insights, briefs, patch intents,
  overlays, impact reports and task packs).

* `validators.ts` – Functions for validating JSON returned by the
  language model. They leverage the Zod schemas defined in
  `product-intent/types.ts` to ensure that responses adhere to the
  expected shapes and that citations refer to actual evidence
  chunks.

To use these utilities, import the functions you need and pass in
evidence chunks and raw model output. See the example application in
`packages/example/product-intent-example` for a minimal integration.
