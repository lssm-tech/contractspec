# `@lssm/example.locale-jurisdiction-gate`

Spec-first example showing how to **fail-closed** on every assistant call unless:

- `locale` is provided and supported
- `jurisdiction` is provided
- `kbSnapshotId` is provided
- `allowedScope` is provided and respected
- answers include **at least one citation** (or the call is refused)

## What this example demonstrates

- **Locale + jurisdiction as explicit inputs** (no guessing)
- **Structured Answer IR** with citations, disclaimers, and risk flags
- **Scope enforcement**: blocks scope-violating content under restricted scopes
- **Traceability**: emits events for requested / blocked / delivered

## Key exports

- `contracts`: `assistant.answer`, `assistant.explainConcept`
- `entities/models`: `LLMCallEnvelope`, `AssistantAnswerIR`, `RegulatoryContext`
- `policy/guard`: pure gate functions used by handlers and tests
- `handlers/demo.handlers`: deterministic demo handlers (no LLM)

## Running tests

```bash
bun test
```


