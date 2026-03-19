# Brownfield OpenAPI Import

This is the maintained brownfield path for stabilizing an existing OpenAPI-based API with ContractSpec.

## Prerequisites

- Node.js 18+ installed
- An existing OpenAPI spec such as `swagger.json` or `openapi.yaml`
- ContractSpec CLI installed with `bun add -D contractspec`

## 1. Initialize ContractSpec

```bash
cd your-project
contractspec init
```

This creates the ContractSpec workspace configuration used by validation, drift checks, and imports.

## 2. Import The OpenAPI Source

```bash
contractspec openapi import path/to/openapi.yaml
```

This will:
1. Parse the OpenAPI document.
2. Generate ContractSpec operations for each imported endpoint.
3. Materialize the imported contracts into your workspace.

## 3. Review The Imported Contracts

```bash
contractspec list
```

Confirm that the generated operations look correct before you start editing or regenerating downstream artifacts.

## 4. Validate The Result

```bash
contractspec ci
```

This verifies:
- Spec structure is valid.
- Feature references resolve.
- Dependency analysis passes.

## 5. Add CI

```yaml
name: ContractSpec CI

on:
  pull_request:
    branches: [main]

jobs:
  contractspec:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: "1.3.8"
      - run: bun install --frozen-lockfile
      - run: bunx contractspec ci --check-drift
```

## Next Steps

- Rebuild derived artifacts with `contractspec generate`
- Review changes against `main` with `contractspec impact --baseline main`
- Explore a maintained example with `contractspec examples init crm-pipeline`

## Common Issues

### "No specs found"

Check the generated configuration:

```bash
cat .contractsrc.json
```

### "OpenAPI parsing failed"

Validate the OpenAPI file before import:

```bash
npx @apidevtools/swagger-cli validate path/to/openapi.yaml
```
