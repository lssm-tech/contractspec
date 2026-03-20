# @contractspec/biome-config

Typed ContractSpec policy manifest plus generated Biome presets, Grit plugins,
and AI-facing rule summaries.

This package is the single source of truth for ContractSpec code guardrails.

It currently ships:

- a typed policy manifest for `repo` and `consumer` audiences
- generated Biome preset strings
- generated Grit plugin strings
- generated AI rule summaries
- published static preset, plugin, and AI-doc artifacts via package exports

The raw preset and plugin artifacts are committed under `presets/`, `plugins/`,
and `ai/` so downstream tools can scaffold them without executing code.

When the manifest changes, run `bun run sync:artifacts` in this package to
refresh the committed outputs.
