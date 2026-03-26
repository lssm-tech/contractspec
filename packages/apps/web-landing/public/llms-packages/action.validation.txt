# @contractspec/action.validation

Website: https://contractspec.io

**ContractSpec GitHub Action for CI/CD integration. Wraps the `contractspec ci` CLI command as a composite action.**

## What It Does

- **Layer**: app (GitHub Action)
- **Consumers**: external CI/CD pipelines via `lssm/contractspec-action@v1`

## Usage

```yaml
name: ContractSpec CI
on: pull_request
jobs:
  contractspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lssm-tech/contractspec/packages/apps/action-validation@main
```

## Inputs

- `checks` (default: `all`) — Checks to run (comma-separated: structure,integrity,deps,doctor,handlers,tests) or "all"
- `skip` — Checks to skip (comma-separated)
- `pattern` — Glob pattern for spec discovery
- `fail-on-warnings` (default: `false`) — Fail the action on warnings (not just errors)
- `check-handlers` (default: `false`) — Include handler implementation checks
- `check-tests` (default: `false`) — Include test coverage checks
- `upload-sarif` (default: `true`) — Upload SARIF results to GitHub Code Scanning
- `working-directory` (default: `.`) — Working directory for running checks
- `bun-version` (default: `latest`) — Bun version to use
- `mode` (default: `validate`) — Action mode: "validate" (run checks) or "impact" (detect breaking changes)
- `baseline` — Git ref to compare against for impact detection (default: base branch from PR context)
- `pr-comment` (default: `true`) — Post impact results as PR comment

## Outputs

- `success` — Whether all checks passed
- `errors` — Number of errors found
- `warnings` — Number of warnings found
- `sarif-file` — Path to SARIF output file (if uploaded)
- `json-file` — Path to JSON output file
- `impact-status` — Impact status: "no-impact" | "non-breaking" | "breaking"
- `breaking-count` — Number of breaking changes detected
- `non-breaking-count` — Number of non-breaking changes detected

## Key Files

- `action.yml` — GitHub Action definition (composite action)
- `README.md` — Usage documentation
- `package.json` — Package metadata (private, not published to npm)

## Local Commands

- `bun run test` — bun test

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- Stability
- PublishConfig not supported by bun

## Notes

- All input/output changes must be reflected in both `action.yml` and `README.md`.
- The action is versioned with tags on the repository — breaking input changes require a major version bump.
- Test locally using `act` or by referencing the local action: `uses: ./packages/apps/action-validation`.
