# AI Agent Guide — `@contractspec/action.validation`

Scope: `packages/apps/action-validation/*`

ContractSpec GitHub Action for CI/CD integration. Wraps the `contractspec ci` CLI command as a composite action.

## Quick Context

- **Layer**: app (GitHub Action)
- **Consumers**: external CI/CD pipelines via `lssm/contractspec-action@v1`

## Architecture

This is a **composite action** that:

1. Sets up Bun
2. Installs dependencies
3. Runs `contractspec ci` with the specified options
4. Uploads SARIF to GitHub Code Scanning (optional)
5. Uploads results as artifacts

## Key Files

- `action.yml` — GitHub Action definition (composite action)
- `README.md` — Usage documentation
- `package.json` — Package metadata (private, not published to npm)

## Public Exports

None — this is a GitHub Action, not an npm package. Inputs/outputs are defined in `action.yml`.

## Guardrails

- All input/output changes must be reflected in both `action.yml` and `README.md`.
- The action is versioned with tags on the repository — breaking input changes require a major version bump.
- Test locally using `act` or by referencing the local action: `uses: ./packages/apps/action-validation`.

## Local Commands

- No build step — this is a composite action defined in `action.yml`.
