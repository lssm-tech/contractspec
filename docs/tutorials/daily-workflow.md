# Daily Workflow with ContractSpec

This tutorial covers the typical daily workflow when using ContractSpec for contract-first API development.

## Morning: Check Your Contract Health

Start your day by ensuring your contracts are in good shape:

```bash
contractspec ci
```

This runs all validation checks:
- **Structure**: Are all specs properly formatted?
- **Integrity**: Do all references resolve?
- **Dependencies**: No circular dependencies?
- **Drift**: Are generated files in sync?

### Quick Health Check

For a faster check during development:

```bash
contractspec doctor
```

## Making Changes: The Spec-First Flow

### 1. Create or Modify a Spec

When adding a new endpoint, start with the spec:

```bash
# Create a new operation spec
contractspec create operation getUserProfile
```

Or manually edit an existing spec:

```typescript
// contracts/operations/getUserProfile.operation.ts
import { defineCommand, z } from '@contractspec/lib.contracts';

export const getUserProfileCommand = defineCommand({
  key: 'getUserProfile',
  version: '2',  // Bump version for breaking changes
  intent: 'Get user profile with preferences',
  input: z.object({
    userId: z.string().uuid(),
  }),
  output: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    preferences: z.object({
      theme: z.enum(['light', 'dark']),
      notifications: z.boolean(),
    }),
  }),
});
```

### 2. Check Impact Before Committing

Before committing, see what your changes affect:

```bash
contractspec impact
```

This shows:
- **Breaking changes**: Removals, type changes
- **Non-breaking changes**: Additions, documentation
- **Affected consumers**: What might break

### 3. Generate/Regenerate Artifacts

If you need handler or test scaffolds:

```bash
# Generate handler scaffold
contractspec generate handler getUserProfile

# Generate test scaffold  
contractspec generate test getUserProfile
```

### 4. Validate Before Push

Run full validation:

```bash
contractspec ci --check-drift
```

## Comparing Branches

When reviewing a PR or comparing changes:

```bash
# Compare current branch to main
contractspec impact --baseline main

# Compare two specific refs
contractspec diff v1.0.0..v2.0.0 --json
```

## Handling Breaking Changes

When `contractspec impact` reports breaking changes:

### Option 1: Version Bump (Recommended)

Increment the spec version to support both old and new contracts:

```typescript
export const getUserCommand = defineCommand({
  key: 'getUser',
  version: '2',  // Was '1'
  // ...
});
```

### Option 2: Deprecation Flow

Mark the old version as deprecated and add a new spec:

```typescript
// getUserV1.operation.ts (deprecated)
export const getUserV1Command = defineCommand({
  key: 'getUser',
  version: '1',
  deprecated: true,
  deprecationReason: 'Use v2 for preferences support',
  // ...
});

// getUserV2.operation.ts (new)
export const getUserV2Command = defineCommand({
  key: 'getUser', 
  version: '2',
  // ...
});
```

## Drift Resolution

When CI reports drift:

```
⚠️ Drift detected in generated files:
  - src/generated/handlers/getUser.handler.ts
```

Resolve by regenerating:

```bash
# Regenerate all artifacts
contractspec generate

# Or regenerate specific file
contractspec generate handler getUser
```

## PR Workflow

### Before Opening PR

```bash
# Full validation
contractspec ci --check-drift

# Check impact for PR description
contractspec impact --format markdown > impact.md
```

### During Review

The GitHub Action automatically:
1. Runs `contractspec ci`
2. Posts impact summary as PR comment
3. Blocks merge on breaking changes (configurable)

## Team Conventions

### Spec Naming

- Operations: `{verb}{Resource}.operation.ts`
  - `createUser.operation.ts`
  - `listOrders.operation.ts`
- Events: `{resource}{Action}.event.ts`
  - `userCreated.event.ts`
  - `orderShipped.event.ts`

### Version Strategy

- Start at `'1'`
- Bump for breaking changes only
- Document in spec's `changelog` field if available

### Review Checklist

Before approving spec changes:

1. ✅ Is the `intent` clear?
2. ✅ Are schemas complete with descriptions?
3. ✅ Are breaking changes versioned?
4. ✅ Does `contractspec ci` pass?

## Common Commands Reference

| Command | Description |
|---------|-------------|
| `contractspec ci` | Run all CI checks |
| `contractspec impact` | Show contract changes |
| `contractspec diff` | Compare two specs |
| `contractspec doctor` | Quick health check |
| `contractspec list` | List all specs |
| `contractspec generate` | Generate artifacts |
| `contractspec vibe run` | Run managed workflow |

## Troubleshooting

### "Spec not found"

Check your contracts directory:

```bash
ls contracts/
contractspec list --verbose
```

### "Drift keeps recurring"

Your generator might have non-deterministic output. Check:

```bash
# Generate twice and compare
contractspec generate
cp -r src/generated src/generated.1
contractspec generate
diff -r src/generated src/generated.1
```

### "CI is slow"

Use specific checks:

```bash
# Skip expensive checks during development
contractspec ci --skip handlers,tests
```

---

For more details, see the [full documentation](https://contractspec.dev/docs).
