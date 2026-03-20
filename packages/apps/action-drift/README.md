# @contractspec/action.drift

Website: https://contractspec.io

**GitHub Action that detects contract drift between specs and implementation. Runs in CI to flag when generated code diverges from its source contracts.**

## What It Does

- Uses `@contractspec/lib.contracts-spec` for contract definitions
- Uses `@contractspec/bundle.workspace` for workspace analysis
- Configured via `action.yml`; no `src/` — logic lives in workspace bundle

## Usage

```yaml
name: ContractSpec Drift
on: pull_request
jobs:
  contractspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lssm-tech/contractspec/packages/apps/action-drift@main
      with:
        generate-command: 'bun contractspec generate'
```

## Inputs

- `package-manager` (default: `bun`) — Package manager to use (bun|npm|pnpm|yarn)
- `working-directory` (default: `.`) — Working directory for running commands
- `generate-command` (default: `bun contractspec generate`) — Command to regenerate artifacts
- `on-drift` (default: `fail`) — Behavior when drift is detected (fail|issue|pr)
- `drift-paths-allowlist` — Comma-separated glob patterns to check for drift
- `token` (default: `${{ github.token }}`) — GitHub token for issues/PRs

## Outputs

- `drift-detected` — Whether drift was detected

## Key Files

- `action.yml` — GitHub Action definition
- `fixtures/` — Test report data for drift scenarios

## Local Commands

- `bun run test` — bun test

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Stability
- Stability improvements

## Notes

- Do not change `action.yml` inputs/outputs without updating downstream workflow consumers
- Fixture JSON files are used for CI testing — keep them valid
