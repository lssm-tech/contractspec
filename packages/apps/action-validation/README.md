# ContractSpec CI GitHub Action

> Note: This action is now an internal helper. Prefer `packages/apps/action-pr` and `packages/apps/action-drift`.

Website: https://contractspec.io/

Run ContractSpec validation checks in your CI/CD pipeline with automatic SARIF upload to GitHub Code Scanning.

## Usage

### Basic Usage

```yaml
name: ContractSpec CI

on: [push, pull_request]

jobs:
  contractspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run ContractSpec CI
        uses: lssm/contractspec-action@v1
```

### Full Configuration

```yaml
name: ContractSpec CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  contractspec:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write # Required for SARIF upload
    steps:
      - uses: actions/checkout@v4

      - name: Run ContractSpec CI
        id: contractspec
        uses: lssm/contractspec-action@v1
        with:
          # Run specific checks (default: all)
          checks: 'structure,integrity,deps'

          # Skip specific checks
          skip: 'doctor'

          # Glob pattern for spec discovery
          pattern: 'src/**/*.contracts.ts'

          # Fail on warnings (default: false)
          fail-on-warnings: false

          # Include handler checks (default: false)
          check-handlers: true

          # Include test checks (default: false)
          check-tests: true

          # Upload SARIF to GitHub Code Scanning (default: true)
          upload-sarif: true

          # Working directory (default: .)
          working-directory: '.'

          # Bun version (default: latest)
          bun-version: 'latest'

      - name: Check results
        if: always()
        run: |
          echo "Success: ${{ steps.contractspec.outputs.success }}"
          echo "Errors: ${{ steps.contractspec.outputs.errors }}"
          echo "Warnings: ${{ steps.contractspec.outputs.warnings }}"
```

## Inputs

### Validation Mode Inputs

| Input               | Description                              | Required | Default    |
| ------------------- | ---------------------------------------- | -------- | ---------- |
| `mode`              | Action mode: `validate` or `impact`      | No       | `validate` |
| `checks`            | Checks to run (comma-separated) or "all" | No       | `all`      |
| `skip`              | Checks to skip (comma-separated)         | No       | `''`       |
| `pattern`           | Glob pattern for spec discovery          | No       | `''`       |
| `fail-on-warnings`  | Fail the action on warnings              | No       | `false`    |
| `check-handlers`    | Include handler implementation checks    | No       | `false`    |
| `check-tests`       | Include test coverage checks             | No       | `false`    |
| `upload-sarif`      | Upload SARIF to GitHub Code Scanning     | No       | `true`     |
| `working-directory` | Working directory for running checks     | No       | `.`        |
| `bun-version`       | Bun version to use                       | No       | `latest`   |

### Impact Detection Inputs

| Input              | Description                                        | Required | Default               |
| ------------------ | -------------------------------------------------- | -------- | --------------------- |
| `mode`             | Set to `impact` for breaking change detection      | No       | `validate`            |
| `baseline`         | Git ref to compare against (auto-detected from PR) | No       | `''`                  |
| `pr-comment`       | Post impact results as PR comment                  | No       | `true`                |
| `fail-on-breaking` | Fail action if breaking changes detected           | No       | `true`                |
| `github-token`     | GitHub token for PR comments and check runs        | No       | `${{ github.token }}` |

### Available Checks

- `structure` - Validate spec structure (meta, io, policy fields)
- `integrity` - Find orphaned specs and broken references
- `deps` - Detect circular dependencies and missing refs
- `doctor` - Check installation health
- `handlers` - Verify handler implementations exist
- `tests` - Verify test files exist

## Outputs

### Validation Mode Outputs

| Output       | Description                                |
| ------------ | ------------------------------------------ |
| `success`    | Whether all checks passed (`true`/`false`) |
| `errors`     | Number of errors found                     |
| `warnings`   | Number of warnings found                   |
| `sarif-file` | Path to SARIF output file                  |
| `json-file`  | Path to JSON output file                   |

### Impact Detection Outputs

| Output               | Description                                               |
| -------------------- | --------------------------------------------------------- |
| `impact-status`      | Impact status: `no-impact`, `non-breaking`, or `breaking` |
| `breaking-count`     | Number of breaking changes detected                       |
| `non-breaking-count` | Number of non-breaking changes detected                   |

## Impact Detection

The action can detect breaking and non-breaking contract changes on PRs, providing:

- **✅ No contract impact** - No changes to contracts
- **⚠️ Contract changed (non-breaking)** - Safe additions or optional field changes
- **❌ Breaking change detected** - Removals, type changes, or required field additions

### PR Comment Output

When `pr-comment: true`, the action posts a comment like:

```markdown
## 📋 ContractSpec Impact Analysis

❌ **Breaking changes detected**

### Summary

| Type            | Count |
| --------------- | ----- |
| 🔴 Breaking     | 2     |
| 🟡 Non-breaking | 3     |

### 🔴 Breaking Changes

- **orders.create**: Required field 'userId' was removed
- **orders.get**: Response type changed from 'object' to 'array'
```

## GitHub Code Scanning Integration

When `upload-sarif: true` (default), the action uploads SARIF results to GitHub Code Scanning. This provides:

- **Inline annotations** on pull requests showing issues at the exact location
- **Security tab integration** for tracking issues over time
- **Code scanning alerts** for new issues

To enable this feature, ensure your workflow has the `security-events: write` permission:

```yaml
permissions:
  contents: read
  security-events: write
```

## Exit Codes

| Code | Description                                                      |
| ---- | ---------------------------------------------------------------- |
| `0`  | All checks passed                                                |
| `1`  | Errors found (or breaking changes with `fail-on-breaking: true`) |
| `2`  | Warnings found (with `fail-on-warnings: true`)                   |

## Examples

### Validate on Push and PR

```yaml
name: Validate Contracts

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: lssm-tech/contractspec@action-v1
```

### Impact Detection on PRs

```yaml
name: Contract Impact

on: pull_request

jobs:
  impact:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Required for git history comparison

      - uses: lssm-tech/contractspec@action-v1
        with:
          mode: impact
          pr-comment: 'true'
          fail-on-breaking: 'true'
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Strict Mode (Fail on Warnings)

```yaml
- uses: lssm/contractspec-action@v1
  with:
    fail-on-warnings: true
```

### Skip Doctor Checks in CI

```yaml
- uses: lssm/contractspec-action@v1
  with:
    skip: 'doctor'
```

### Monorepo with Multiple Packages

```yaml
jobs:
  contractspec:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: [api, web, shared]
    steps:
      - uses: actions/checkout@v4
      - uses: lssm/contractspec-action@v1
        with:
          working-directory: packages/${{ matrix.package }}
```

## Using Without the Action

If you prefer to run ContractSpec directly without the action:

```yaml
- uses: oven-sh/setup-bun@v2
- run: bun install
- run: bunx contractspec ci --format sarif --output results.sarif
- uses: github/codeql-action/upload-sarif@v4
  with:
    sarif_file: results.sarif
```

## License

MIT
