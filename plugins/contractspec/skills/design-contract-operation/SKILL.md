---
name: design-contract-operation
description: Design robust ContractSpec operations in @contractspec/lib.contracts-spec with explicit compatibility and policy metadata
---

# Design Contract Operation

Use this skill when adding or evolving command/query contracts.

## Process

1. Define operation first
   - Use `defineCommand` for write operations.
   - Use `defineQuery` for read operations.
2. Complete required metadata
   - `meta.key`, `meta.version`, `description`, `goal`, `context`, `owners`, `tags`, `stability`.
3. Define schema boundaries
   - Explicit `io.input` and `io.output`.
   - Add named `io.errors` for known failure states.
4. Define policy expectations
   - Set auth level, idempotency, and applicable policy references.
5. Validate compatibility
   - Run `contractspec impact --baseline main`.

## Definition of done

- Operation is contract-first and schema-complete.
- Policy and side effects are explicitly declared.
- Compatibility impact is recorded before merge.
