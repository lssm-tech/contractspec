---
name: design-integration-provider
description: Design provider integrations with contract-first boundaries and runtime safety
---

# Design Integration Provider

Use this skill when adding or changing provider adapters.

## Process

1. Start from integration contracts and capability/feature declarations.
2. Define input/output and error boundaries before runtime wiring.
3. Wire credentials through approved secret providers.
4. Add health, retry, timeout, and failure-classification behavior.
5. Validate compatibility impact and migration needs.

## Definition of done

- Provider behavior is contract-aligned and secrets-safe.
- Runtime resilience controls are explicit and testable.
- Compatibility impact is documented for release.
