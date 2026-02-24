---
description: Run impact analysis between two branches and generate a SpecDelta report
targets: ['*']
---

args = $ARGUMENTS

Run impact analysis to understand what contracts and surfaces are affected:

1. **Parse arguments**:
   - Extract `base` and `head` from `args` (space-separated)
   - Defaults: `base` = `main`, `head` = current branch
   - If on `main` with no arguments, ask the user for branches to compare

2. **Compute SpecDeltas**:
   - Use the `cursorpm.compareBranches` MCP tool with `{ base, head }` to retrieve SpecDeltas
   - Each SpecDelta contains: operation key, change type, field-level diffs, version bump

3. **Analyze impact**:
   - For each SpecDelta, determine:
     - **Surfaces affected**: API, database, UI, events, tests
     - **Breaking changes**: removed fields, type changes, renamed operations
     - **Downstream consumers**: services or packages that import the changed contract
     - **Risk level**: low (additive) | medium (optional -> required) | high (breaking)
   - Use Serena `find_referencing_symbols` to trace consumers of changed contracts

4. **Generate impact report**:
   - Group changes by domain
   - Highlight breaking changes prominently
   - Include migration guidance for high-risk items
   - Suggest version bumps (patch, minor, major)

5. **Output the report**

## Example output

```
## Impact Analysis: main <- feature/add-user-roles

Comparing: main...feature/add-user-roles
SpecDeltas: 3 changes detected

### Breaking Changes (1)
| Contract    | Change        | Risk | Surfaces    | Consumers |
|-------------|---------------|------|-------------|-----------|
| createUser  | field removed | HIGH | API, DB, UI | 4 files   |

### Additive Changes (2)
| Contract    | Change      | Risk | Surfaces | Consumers |
|-------------|-------------|------|----------|-----------|
| getUser     | field added | LOW  | API, UI  | 2 files   |
| userCreated | field added | LOW  | Events   | 1 file    |

### Migration Required
- `createUser`: field `legacyId` removed -> update 4 consumers
  - packages/apps/api/src/handlers/createUser.handler.ts:42
  - packages/apps/web/src/forms/CreateUserForm.tsx:18
  - packages/apps/api/src/handlers/__tests__/createUser.test.ts:55
  - packages/libs/sdk/src/client.ts:102

### Suggested Version Bumps
- @contractspec/contracts-contractspec-studio: major (breaking change)
```
