# `@lssm/example.kb-update-pipeline`

Spec-first example for a **knowledge base update pipeline** where:

- automation **proposes** changes (watch/diff/summarize/propose patches)\n+- humans **verify** (HITL) with role-based rules\n+- snapshots are published only when rule versions are approved\n+- notifications + audit trails provide traceability\n+
## Contracts

- `kbPipeline.runWatch()`\n+- `kbPipeline.createReviewTask(changeCandidateId)`\n+- `kbPipeline.submitDecision(reviewTaskId, decision)`\n+- `kbPipeline.publishIfReady(jurisdiction)`\n+
## Tests

- high-risk change cannot be approved by curator role\n+- publish fails if any included rule versions are unapproved\n+- notifications fire on review requested\n+
## Running tests

```bash
bun test
```





