# Packs Overview

This repository keeps pack sources in `packs/` and generates tool-specific artifacts from `agentpacks.jsonc`.

## Canonical Packs (active)

These packs are loaded by default and are the source of truth for generated configs:

- `workspace-specific`
- `contractspec-rules`
- `software-best-practices`

## Imported VibeCoding Packs (reference)

The `vibecoding-*` folders were imported from a different workspace as a baseline/reference.
They are not loaded by default unless explicitly added to `agentpacks.jsonc`.

Use them as idea sources, but keep production updates in the canonical packs above.
