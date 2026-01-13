# 10-Minute Brownfield OpenAPI Import

This tutorial shows you how to stabilize an existing OpenAPI-based API with ContractSpec in under 10 minutes.

## Prerequisites

- Node.js 18+ installed
- An existing project with OpenAPI specs (swagger.json or openapi.yaml)
- ContractSpec CLI installed: `bun add -D contractspec`

## Step 1: Initialize ContractSpec (1 minute)

Navigate to your project root and initialize ContractSpec:

```bash
cd your-project
contractspec vibe init
```

This creates:
- `.contractspec/` directory for configuration
- `contracts/` directory for your specs (if not exists)

## Step 2: Import OpenAPI Specification (2 minutes)

Import your existing OpenAPI spec:

```bash
contractspec import openapi path/to/openapi.yaml
```

This will:
1. Parse your OpenAPI specification
2. Generate ContractSpec operation specs for each endpoint
3. Place them in `contracts/operations/`

**Example output:**

```
✓ Imported 12 operations from openapi.yaml
  - GET /users → getUserList.operation.ts
  - POST /users → createUser.operation.ts
  - GET /users/{id} → getUser.operation.ts
  ...
```

## Step 3: Review Generated Contracts (2 minutes)

Check the generated specs:

```bash
contractspec list
```

Each spec includes:
- Input/output schemas (derived from OpenAPI)
- Operation metadata (key, version)
- Semantic versioning

**Example spec:**

```typescript
// contracts/operations/getUser.operation.ts
import { defineCommand, z } from '@contractspec/lib.contracts';

export const getUserCommand = defineCommand({
  key: 'getUser',
  version: '1',
  intent: 'Retrieve a user by ID',
  input: z.object({
    id: z.string().uuid(),
  }),
  output: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
  }),
});
```

## Step 4: Validate Your Contracts (2 minutes)

Run CI checks to ensure everything is valid:

```bash
contractspec ci
```

This verifies:
- Spec structure is correct
- No circular dependencies
- All referenced types exist

## Step 5: Set Up CI Integration (3 minutes)

Copy the GitHub Action template:

```bash
cp node_modules/@contractspec/cli/templates/github-action.yml .github/workflows/contractspec.yml
```

Or create manually:

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
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm install -g @contractspec/cli
      - run: contractspec ci --format json --check-drift
```

## What You Get

After this 10-minute setup, you have:

1. **Contract-First Development**: Your API is now defined by contracts, not implementations
2. **Breaking Change Detection**: Any API changes are automatically detected
3. **CI Integration**: Every PR is validated against your contracts
4. **Drift Detection**: Detect when implementations diverge from specs

## Next Steps

- **Generate Handlers**: `contractspec generate handlers`
- **Add Tests**: `contractspec generate tests`
- **Set Up Impact Analysis**: Compare changes between branches with `contractspec impact`

## Common Issues

### "No specs found"

Ensure your contracts directory is correct:

```bash
# Check configuration
cat .contractspec/vibe/config.json
```

### "OpenAPI parsing failed"

Verify your OpenAPI spec is valid:

```bash
# Validate OpenAPI first
npx @apidevtools/swagger-cli validate path/to/openapi.yaml
```

---

Time to complete: **< 10 minutes**

Need help? Check our [documentation](https://contractspec.dev/docs) or [open an issue](https://github.com/contractspec/contractspec/issues).
