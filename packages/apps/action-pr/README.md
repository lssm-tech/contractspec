# ContractSpec PR Action

Run ContractSpec PR checks (view, impact, validation, drift) with a reusable GitHub Action.

Website: https://contractspec.io/

## Usage

```yaml
name: ContractSpec PR

on: pull_request

jobs:
  contractspec:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4

      - name: ContractSpec PR checks
        uses: lssm-tech/contractspec/packages/apps/action-pr@main
        with:
          generate-command: 'bun contractspec generate'
```

## Inputs

| Input               | Description                         | Default               |
| ------------------- | ----------------------------------- | --------------------- |
| `package-manager`   | `bun`, `npm`, `pnpm`, `yarn`        | `bun`                 |
| `working-directory` | Repo root or package path           | `.`                   |
| `report-mode`       | `summary`, `comment`, `both`, `off` | `summary`             |
| `enable-drift`      | Run generate + drift check          | `true`                |
| `fail-on`           | `breaking`, `drift`, `any`, `never` | `any`                 |
| `generate-command`  | Command to regenerate artifacts     | empty                 |
| `validate-command`  | Validation command override         | empty                 |
| `contracts-dir`     | Directory for contract changes      | empty                 |
| `contracts-glob`    | Glob for contract changes           | empty                 |
| `token`             | GitHub token for PR comments        | `${{ github.token }}` |

## Outputs

| Output                     | Description                            |
| -------------------------- | -------------------------------------- |
| `drift-detected`           | Whether drift was detected             |
| `breaking-change-detected` | Whether breaking changes were detected |
| `validation-failed`        | Whether validation failed              |
