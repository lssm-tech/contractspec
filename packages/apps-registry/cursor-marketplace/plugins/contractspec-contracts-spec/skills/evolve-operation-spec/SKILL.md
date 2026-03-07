---
name: evolve-operation-spec
description: Evolve operation contracts in @contractspec/lib.contracts-spec with compatibility discipline
---

# Evolve Operation Spec

Use this skill when changing command/query contracts.

## Process

1. Update contract definitions first (`defineCommand` / `defineQuery`).
2. Keep metadata complete and version intent explicit.
3. Update IO schemas and named errors with deterministic behavior.
4. Run impact analysis and classify compatibility.
5. Add migration notes for every breaking change.

## Definition of done

- Contract changes are spec-first and compatibility-labeled.
- Policy/workflow side effects remain declared and verifiable.
- Release notes include impacted operation keys.
