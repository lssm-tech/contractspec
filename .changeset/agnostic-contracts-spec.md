---
"@contractspec/lib.contracts-spec": major
"@contractspec/lib.presentation-runtime-core": minor
"@contractspec/lib.contracts-runtime-client-react": minor
"@contractspec/lib.contracts-runtime-server-mcp": patch
---

Make `@contractspec/lib.contracts-spec` contract-model only and move concrete
runtime and integration code to dedicated packages.

Major changes:

- Remove `@contractspec/lib.contracts-spec/presentations/transform-engine`.
- Remove all `@contractspec/lib.contracts-spec/integrations*` export paths.
- Remove `@contractspec/lib.contracts-spec/jobs/scaleway-sqs-queue`.
- Remove provider-type re-exports for email, embedding, LLM, storage, and
  vector-store surfaces from the `@contractspec/lib.contracts-spec` root
  barrel.
- Keep `PresentationSpec` unchanged while moving transform-engine runtime logic
  out of the contract package.

New runtime surfaces:

- Add `@contractspec/lib.presentation-runtime-core/transform-engine` for the
  core transform engine, validators, and markdown/json/xml rendering support.
- Add `@contractspec/lib.contracts-runtime-client-react/transform-engine` for
  React render descriptors and React-specific transform-engine helpers.
- Update `@contractspec/lib.contracts-runtime-server-mcp` to use the core
  transform engine without React registration.

Migration notes:

- Import integration provider and secret types from
  `@contractspec/lib.contracts-integrations`.
- Import transform-engine core APIs from
  `@contractspec/lib.presentation-runtime-core/transform-engine`.
- Import React-specific transform-engine helpers from
  `@contractspec/lib.contracts-runtime-client-react/transform-engine`.
