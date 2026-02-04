# @contractspec/lib.product-intent-utils

Website: https://contractspec.io/

Utilities for the product-intent workflow: prompt builders, evidence formatting, and strict JSON validators aligned with ContractSpec's product-intent contracts.

## What it provides

- Evidence normalization helpers for LLM prompts.
- Prompt builders for insights, opportunity briefs, patch intents, impacts, and task packs.
- Validators that enforce structure, citation correctness, and bounds on model output.

## Installation

```bash
bun add @contractspec/lib.product-intent-utils
```

## Usage

```ts
import {
  formatEvidenceForModel,
  promptExtractInsights,
  validateInsightExtraction,
} from "@contractspec/lib.product-intent-utils";
import type { EvidenceChunk } from "@contractspec/lib.contracts/product-intent/types";

const chunks: EvidenceChunk[] = [
  { chunkId: "INT-001#c_00", text: "...", meta: { persona: "admin" } },
];

const evidenceJSON = formatEvidenceForModel(chunks);
const prompt = promptExtractInsights({
  question: "How do we improve activation?",
  evidenceJSON,
});

// modelOutput is the raw JSON string returned by the LLM
const insights = validateInsightExtraction(modelOutput, chunks);
```
