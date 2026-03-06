# AI Agent Guide — `action-drift`

Scope: `packages/apps/action-drift/*`

GitHub Action that detects contract drift between specs and implementation. Runs in CI to flag when generated code diverges from its source contracts.

## Quick Context

- **Layer**: app (GitHub Action)
- **Consumers**: CI pipelines via GitHub Actions

## Architecture

- Uses `@contractspec/lib.contracts-spec` for contract definitions
- Uses `@contractspec/bundle.workspace` for workspace analysis
- Configured via `action.yml`; no `src/` — logic lives in workspace bundle

## Key Files

- `action.yml` — GitHub Action definition
- `fixtures/` — Test report data for drift scenarios

## Public Exports

N/A (GitHub Action, not a library)

## Guardrails

- Do not change `action.yml` inputs/outputs without updating downstream workflow consumers
- Fixture JSON files are used for CI testing — keep them valid
