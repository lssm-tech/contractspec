# ContractSpec CI GitHub Action

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
      security-events: write  # Required for SARIF upload
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

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `checks` | Checks to run (comma-separated) or "all" | No | `all` |
| `skip` | Checks to skip (comma-separated) | No | `''` |
| `pattern` | Glob pattern for spec discovery | No | `''` |
| `fail-on-warnings` | Fail the action on warnings | No | `false` |
| `check-handlers` | Include handler implementation checks | No | `false` |
| `check-tests` | Include test coverage checks | No | `false` |
| `upload-sarif` | Upload SARIF to GitHub Code Scanning | No | `true` |
| `working-directory` | Working directory for running checks | No | `.` |
| `bun-version` | Bun version to use | No | `latest` |

### Available Checks

- `structure` - Validate spec structure (meta, io, policy fields)
- `integrity` - Find orphaned specs and broken references
- `deps` - Detect circular dependencies and missing refs
- `doctor` - Check installation health
- `handlers` - Verify handler implementations exist
- `tests` - Verify test files exist

## Outputs

| Output | Description |
|--------|-------------|
| `success` | Whether all checks passed (`true`/`false`) |
| `errors` | Number of errors found |
| `warnings` | Number of warnings found |
| `sarif-file` | Path to SARIF output file |
| `json-file` | Path to JSON output file |

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

| Code | Description |
|------|-------------|
| `0` | All checks passed |
| `1` | Errors found |
| `2` | Warnings found (with `fail-on-warnings: true`) |

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
      - uses: lssm/contractspec-action@v1
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
- run: npx contractspec ci --format sarif --output results.sarif
- uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif
```

## License

MIT


