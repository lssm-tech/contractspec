---
name: apply-patch
description: Apply a ContractSpec action item intent to the codebase with full code generation and PR creation
targets: ['*']
claudecode:
  allowed-tools:
    - 'Bash'
    - 'Read'
    - 'Write'
    - 'Glob'
    - 'Grep'
---

# Apply Action Item Skill

Use this skill to apply a ContractSpec action item intent into concrete code updates across contracts, implementation, tests, and docs.

## Usage

Invoke when:

- A `actionItemId` must be applied end-to-end.
- The user provides a raw `actionItemIntent` object.
- A generated spec variant must be translated into implementation updates.

## Prerequisites

Before applying:

1. Confirm the input (`actionItemId` or `actionItemIntent`).
2. Confirm `contractspec-internal` and `contractspec-cli` MCP availability.
3. Confirm Serena tooling is available.
4. Confirm branch strategy (new action item branch is recommended).

## Process

### Step 1: Resolve Action Item Input

Accept either:

- `actionItemId`
- `actionItemIntent` JSON

If `actionItemId` is provided, fetch full action item details from MCP.

Validate the payload contains:

- Action Item ID
- Target spec ID
- Change list
- Metadata (author, createdAt, priority)

If validation fails, stop and report exact error.

### Step 2: Compile and Analyze Impact

Compile the action item and gather:

- Risk level
- Surface impact (`api`, `db`, `ui`, `events`, `tests`, `docs`)
- Files likely affected
- Versioning implications (patch/minor/major)

Build a change map linking action item changes to symbols and files.

### Step 3: Plan Ordered Code Changes

Apply in this order to reduce cascading failures:

1. Contract definitions and registries
2. Type exports and schema references
3. Application handlers/services
4. UI consumers
5. Tests
6. DocBlocks

For each change, specify:

- Target file
- Symbol
- Modification type (`modify`, `create`, `delete`)

### Step 4: Apply Contract and Implementation Updates

Common change handling:

- `add_field`: update Zod schema + downstream callsites + tests
- `remove_field`: remove schema field + migrate consumers
- `update_field`: adjust type/validation + compatibility checks
- `add_operation`: create new spec + register + wire handler
- `update_operation`: update spec + handler + docs
- `add_event` / `update_event`: update event payload and emitters
- `add_error`: add error code and runtime mapping
- `update_policy`: enforce policy in runtime guards

### Step 5: Validate

Run repo-standard checks:

- `bun run build:types`
- `bun run lint`
- `bun run test`

If checks fail, fix or report blockers with file and line references.

### Step 6: Prepare Review Deliverable

Create branch:

- `contractspec/action-item-<actionItemId>`

Commit with conventional message:

- `feat(contracts): apply action item <actionItemId>`

If requested, open draft PR with:

- Action item summary
- Impact summary
- Breaking-change notes
- Validation checklist

### Step 7: Status Update

If action item tracking is available, set action item status to `applied` with:

- Branch name
- PR URL
- Applied timestamp
- Files changed count
- Surfaces affected

## Output Format

```markdown
## Action Item Apply Result

- Action Item: <actionItemId>
- Risk: <low|medium|high>
- Branch: <branch>
- PR: <url or pending>

### Files Updated

- <path>

### Validation

- Types: pass|fail
- Lint: pass|fail
- Tests: pass|fail

### Follow-ups

1. <manual review item>
2. <migration note>
```

## Notes

- Keep edits minimal, traceable, and reversible.
- When breaking changes are present, always include migration guidance.
