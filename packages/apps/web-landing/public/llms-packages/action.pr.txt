# @contractspec/action.pr

Website: https://contractspec.io

**GitHub Action that runs ContractSpec validation checks on pull requests. Posts drift reports, validation results, and product views as PR comments.**

## What It Does

- Uses `@contractspec/lib.contracts-spec` for contract definitions
- Uses `@contractspec/bundle.workspace` for workspace analysis
- Configured via `action.yml`; no `src/` — logic lives in workspace bundle

## Usage

```yaml
name: ContractSpec PR
on: pull_request
jobs:
  contractspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lssm-tech/contractspec/packages/apps/action-pr@main
      with:
        generate-command: 'bun contractspec generate'
```

## Inputs

- `package-manager` (default: `bun`) — Package manager to use (bun|npm|pnpm|yarn)
- `working-directory` (default: `.`) — Working directory for running commands
- `report-mode` (default: `summary`) — Report output mode (summary|comment|both|off)
- `enable-drift` (default: `true`) — Run drift detection after generate
- `fail-on` (default: `any`) — Fail on breaking, drift, any, or never
- `generate-command` (default: `bun contractspec generate`) — Command to regenerate artifacts (required when enable-drift=true)
- `validate-command` — Override validation command
- `contracts-dir` — Directory containing contract specs
- `contracts-glob` — Glob pattern for contract specs
- `token` (default: `${{ github.token }}`) — GitHub token for PR comments

## Outputs

- `drift-detected` — Whether drift was detected
- `breaking-change-detected` — Whether breaking changes were detected
- `validation-failed` — Whether validation failed

## Key Files

- `action.yml` — GitHub Action definition
- `fixtures/` — Test report data and validation fixtures
- `.contractspec-ci/contracts.json` — CI contract configuration

## Local Commands

- `bun run test` — bun test

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Stability
- Standardize tool naming to underscore notation

## Notes

- Do not change `action.yml` inputs/outputs without updating downstream workflow consumers
- Fixture files are used for CI testing — keep them valid
