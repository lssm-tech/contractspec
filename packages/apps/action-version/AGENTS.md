# AI Agent Guide — `action-version`

Scope: `packages/apps/action-version/*`

GitHub Action for automated ContractSpec version management and changelog generation. Handles versioning and release workflows in CI.

## Quick Context

- **Layer**: app (GitHub Action)
- **Consumers**: CI pipelines via GitHub Actions

## Architecture

- Standalone action with no workspace dependencies
- Configured entirely via `action.yml`; no TypeScript source

## Key Files

- `action.yml` — GitHub Action definition (entry point)

## Public Exports

N/A (GitHub Action, not a library)

## Guardrails

- Do not change `action.yml` inputs/outputs without updating downstream workflow consumers
- This is a standalone action — avoid adding workspace dependencies unless necessary
