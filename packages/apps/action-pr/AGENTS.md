# AI Agent Guide — `action-pr`

Scope: `packages/apps/action-pr/*`

GitHub Action that runs ContractSpec validation checks on pull requests. Posts drift reports, validation results, and product views as PR comments.

## Quick Context

- **Layer**: app (GitHub Action)
- **Consumers**: CI pipelines via GitHub Actions

## Architecture

- Uses `@contractspec/lib.contracts-spec` for contract definitions
- Uses `@contractspec/bundle.workspace` for workspace analysis
- Configured via `action.yml`; no `src/` — logic lives in workspace bundle

## Key Files

- `action.yml` — GitHub Action definition
- `fixtures/` — Test report data and validation fixtures
- `.contractspec-ci/contracts.json` — CI contract configuration

## Public Exports

N/A (GitHub Action, not a library)

## Guardrails

- Do not change `action.yml` inputs/outputs without updating downstream workflow consumers
- Fixture files are used for CI testing — keep them valid
