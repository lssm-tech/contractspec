## Presentations Conventions (A11y & i18n)

- Always provide `meta.description` (≥ 3 chars) — used by a11y/docs/agents.
- Prefer source = BlockNote for rich guides; use component key for interactive flows.
- i18n strings belong in host apps; descriptors carry keys/defaults only.
- Target selection: include only what you intend to support to avoid drift.
- PII: declare JSON-like paths under `policy.pii`; engine redacts in outputs.
