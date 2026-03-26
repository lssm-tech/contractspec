# @contractspec/action.version

Website: https://contractspec.io

**GitHub Action for automated ContractSpec version management and changelog generation. Handles versioning and release workflows in CI.**

## What It Does

- Standalone action with no workspace dependencies
- Configured entirely via `action.yml`; no TypeScript source

## Usage

```yaml
name: ContractSpec Version Manager
on: pull_request
jobs:
  contractspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lssm-tech/contractspec/packages/apps/action-version@main
```

## Inputs

- `mode` (default: `analyze`) — Action mode: analyze (check only) or bump (apply changes)
- `auto-bump` (default: `false`) — Whether to automatically applying bumps based on impact analysis
- `commit-message` (default: `chore(release): bump spec versions [skip ci]`) — Commit message for version bumps
- `create-pr` (default: `false`) — Create a Pull Request instead of pushing directly
- `pr-title` (default: `chore(release): version packages`) — Title for the Pull Request
- `pr-branch` (default: `release/next-versions`) — Branch name for the Pull Request
- `github-token` (default: `${{ github.token }}`) — GitHub Token for creating PRs

## Outputs

- `has-changes` — Whether changes were detected/applied
- `specs-bumped` — Number of specs bumped

## Key Files

- `action.yml` — GitHub Action definition (entry point)

## Recent Updates

- Replace eslint+prettier by biomejs to optimize speed
- PublishConfig not supported by bun
- Move automation into actions

## Notes

- Do not change `action.yml` inputs/outputs without updating downstream workflow consumers
- This is a standalone action — avoid adding workspace dependencies unless necessary
