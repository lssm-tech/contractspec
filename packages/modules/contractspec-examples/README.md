# @lssm/module.contractspec-examples

Website: https://contractspec.lssm.tech/


Pure, deterministic types and registries for ContractSpec Examples.

## Purpose

This module defines the canonical “Example” shape (metadata + entrypoints) and exposes:

- A registry API to list/search examples
- Pure validators to enforce minimum required metadata across examples

## Design principles

- No I/O (no filesystem, no network)
- Deterministic outputs from explicit inputs
- Strong typing (no `any`)


