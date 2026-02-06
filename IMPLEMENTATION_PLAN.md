You are a senior full-stack engineer shipping a hackathon MVP.

Goal: Build a transcript-to-tickets workflow with evidence-backed citations and a deterministic impact report.

Repository context:
- Monorepo (ContractSpec)
- Add a new contracts layer under packages/libs/contracts/src/product-intent using the standard pattern:
  - types.ts (TS types + zod schemas)
  - spec.ts (layer spec)
  - registry.ts (registry loader)
  - runtime.ts (platform-agnostic runtime for ingest/retrieve/compute)
- Add a new utility library under packages/libs/product-intent-utils:
  - prompts.ts (LLM prompt builders for extraction/synthesis/tickets)
  - validators.ts (strict JSON parsing + zod validation + citation exact-quote matching + repair prompt builder)
- Add an example app under packages/example/product-intent-example:
  - contains a fake evidence dataset (use the provided evidence_dataset.zip or embed extracted files)
  - provides a runnable script or minimal Next.js UI demonstrating the full flow:
    transcript -> evidence -> problems -> tickets (+ optional impact)
  - no auth, no onboarding

Hard requirements:
1) Evidence extraction MUST be grounded: each EvidenceFinding includes chunk_id + quote, where quote is an exact substring of the chunk’s text. Implement a validator that rejects outputs if quote mismatch or missing citations.
2) Opportunity/Problem statements MUST link to evidence finding IDs.
3) Ticket generation MUST include evidence links + acceptance criteria.
4) Deterministic Impact Engine (do NOT use an LLM for impact):
   - Input: typed deltas from PatchIntent/spec diff (field rename, enum remove, op signature change, policy change, event change, etc.)
   - Output: ImpactReport with arrays:
       breaks[], must_change[], risky[]
       surfaces: { api, db, ui, workflows, policy, docs, tests }
     Each item must include a short "because" reason.
   - Add simple token-based repo scan or simulated references:
       For each delta, create search tokens and collect up to N file hits (or placeholders if no repo scan is available).
   - The output must look concrete and explainable.

LLM pipeline (implement as functions; actual model calls can be stubbed):
- retrieveChunks(transcript, question) -> EvidenceChunk[]
- extractEvidence(chunks, question) -> EvidenceFinding[]  [LLM output validated]
- groupProblems(findings) -> ProblemStatement[]           [heuristic: tags + similarity]
- generateTickets(problems, findings) -> Ticket[]         [LLM output validated]
- (optional) suggestPatch(ticket) -> PatchIntent          [LLM output validated]
- impactEngine(patchIntent) -> ImpactReport               [deterministic rules]

Implementation steps:
A) Create the contracts layer files + exports from packages/libs/contracts/src/index.ts
B) Create product-intent-utils prompts + validators (strict JSON, retries, repair prompt)
C) Create example app + dataset loader + demo script producing console output and/or minimal UI
D) Add a README describing how to run the example

Quality bar:
- Prefer boring, reliable code over fancy abstractions.
- Include types everywhere.
- Provide at least one end-to-end demo run command in the example.
- Do not create huge new frameworks. Keep it minimal.

Deliverables:
- All new/edited files in correct folders
- Example demo runnable locally with a single command

Start by scanning the existing contracts library patterns (types.ts/spec.ts/registry.ts/runtime.ts) and mirror them.
Then implement the new product-intent layer + utils + example.

When unsure, choose the simplest working approach that meets the hard requirements.
