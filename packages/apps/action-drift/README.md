# ContractSpec Drift Action

Detect drift between generated artifacts and committed sources.

Website: https://contractspec.io/

## Usage

```yaml
name: ContractSpec Drift

on:
  push:
    branches: [main]

jobs:
  contractspec:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: ContractSpec drift check
        uses: lssm-tech/contractspec/packages/apps/action-drift@main
        with:
          generate-command: 'bun contractspec generate'
```

## Inputs

| Input                   | Description                     | Default               |
| ----------------------- | ------------------------------- | --------------------- |
| `package-manager`       | `bun`, `npm`, `pnpm`, `yarn`    | `bun`                 |
| `working-directory`     | Repo root or package path       | `.`                   |
| `generate-command`      | Command to regenerate artifacts | required              |
| `on-drift`              | `fail`, `issue`, `pr`           | `fail`                |
| `drift-paths-allowlist` | Comma-separated glob patterns   | empty                 |
| `token`                 | GitHub token for issues/PRs     | `${{ github.token }}` |

## Outputs

| Output           | Description                |
| ---------------- | -------------------------- |
| `drift-detected` | Whether drift was detected |
