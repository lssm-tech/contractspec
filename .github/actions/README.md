# GitHub Actions Composite Actions

This directory contains reusable composite actions used across ContractSpec workflows.

## Available Actions

### `setup-build-env`

Sets up Node.js, Bun, caches dependencies, and installs packages.

**Inputs:**
- `node-version` (default: '22'): Node.js version to setup
- `bun-version` (default: '1.3.4'): Bun version to setup
- `cache-dependencies` (default: 'true'): Whether to cache dependencies
- `install-dependencies` (default: 'true'): Whether to install dependencies
- `frozen-lockfile` (default: 'true'): Use frozen lockfile for installs

**Example:**
```yaml
- uses: ./.github/actions/setup-build-env
  with:
    node-version: '20'
    frozen-lockfile: 'false'
```

### `security-scan`

Runs security audit, linting, type checking, and tests.

**Inputs:**
- `run-tests` (default: 'true'): Whether to run tests
- `run-codeql` (default: 'true'): Whether to run CodeQL analysis
- `continue-on-test-failure` (default: 'true'): Continue on test failures

**Example:**
```yaml
- uses: ./.github/actions/security-scan
  with:
    run-codeql: 'false'
```

### `cache-build`

Caches and restores build outputs.

**Inputs:**
- `cache-key` (default: '${{ github.sha }}'): Cache key suffix
- `restore-only` (default: 'false'): Only restore cache, do not save

**Example:**
```yaml
- uses: ./.github/actions/cache-build
  with:
    cache-key: 'main'
```

## Usage in Workflows

These actions can be used in any workflow within this repository:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: ./.github/actions/setup-build-env

      - uses: ./.github/actions/security-scan

      - uses: ./.github/actions/cache-build

      # ... rest of build steps
```

## Benefits

- **Consistency**: Standardized setup across all workflows
- **Maintainability**: Updates to setup logic in one place
- **Performance**: Optimized caching and dependency management
- **Security**: Centralized security scanning and auditing
