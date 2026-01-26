# ContractSpec Version Manager Action

> Note: This action is now an internal helper. Prefer the reusable workflows for ContractSpec automation.

Automate versioning and changelogs for your ContractSpec workspace.

## Usage

```yaml
name: Release

on:
  push:
    branches:
      - main

jobs:
  version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: ContractSpec Version Bump
        uses: ./packages/apps/action-version
        with:
          mode: bump
          auto-bump: true
          create-pr: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Input          | Description                                 | Default                 |
| -------------- | ------------------------------------------- | ----------------------- |
| `mode`         | `analyze` or `bump`                         | `analyze`               |
| `auto-bump`    | Automatically bump versions based on impact | `false`                 |
| `create-pr`    | Create a Pull Request with changes          | `false`                 |
| `pr-branch`    | Branch name for PR                          | `release/next-versions` |
| `github-token` | GitHub token for PR creation                | `${{ github.token }}`   |

## Outputs

| Output         | Description                  |
| -------------- | ---------------------------- |
| `has-changes`  | `true` if versions need bump |
| `specs-bumped` | Number of specs needing bump |
