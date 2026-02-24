---
name: read-contracts
description: Read and understand ContractSpec contracts with drift detection and implementation comparison
targets: ['*']
claudecode:
  allowed-tools:
    - 'Bash'
    - 'Read'
    - 'Write'
    - 'Glob'
    - 'Grep'
---

# Read Contracts Skill

Use this skill to inspect contract inventory, compare local and remote state, and identify drift between spec and implementation.

## Usage

Invoke when:

- The user asks what contracts exist in the project.
- The user asks for the shape or behavior of a contract.
- The user asks for drift or implementation mismatch checks.

## Prerequisites

Before starting, verify:

1. `contractspec-cli` MCP is available (if not, run local-only analysis).
2. Serena tooling is available for symbol and reference queries.
3. Contracts are present under `packages/libs/contracts-contractspec-studio/`.

## Process

### Step 1: Gather Remote Contracts (if available)

Call the ContractSpec CLI MCP to list contracts.

Expected fields:

- `name`
- `version`
- `type` (`command` | `query` | `event`)
- `domain`
- `status`
- `surfaces`

If remote access is unavailable, continue with local inventory and label remote status as `unknown`.

### Step 2: Build Local Contract Inventory

Search local definitions for:

- `defineCommand`
- `defineQuery`
- `defineEvent`

For each contract, extract:

- Name, type, file path
- Version
- Input/output/error/payload fields
- Policy and side effects (if declared)
- Whether a related DocBlock exists

### Step 3: Compare Local and Remote

Classify each contract:

- `synced`
- `local-only`
- `remote-only`
- `version-drift`
- `schema-drift`
- `unknown`

Matching order:

1. Match by spec ID (if available)
2. Fallback to normalized contract name
3. Compare versions
4. Compare field-level schema details

### Step 4: Inspect Implementations

Find referencing symbols and handlers for each contract.

Check for discrepancies:

- Declared error not handled
- Declared field not read/written
- Handler returns undeclared field
- Side effect missing or undocumented
- Policy declared but not enforced
- No tests covering the contract

### Step 5: Produce a Unified Report

Return:

1. Contract inventory table
2. Drift summary
3. Discrepancy report (severity ranked)
4. Suggested actions

## Output Format

```markdown
## Contract Inventory

| Contract    | Version | Type    | Drift Status | File                                                |
| ----------- | ------- | ------- | ------------ | --------------------------------------------------- |
| createOrder | 1.2.0   | command | synced       | packages/libs/contracts-contractspec-studio/src/... |

## Drift Summary

- Synced: X
- Local only: Y
- Remote only: Z
- Version drift: A
- Schema drift: B

## Discrepancies

- [HIGH] <contract> - missing error handling for `<ERROR_CODE>` in `<file>:<line>`
- [MEDIUM] <contract> - undeclared side effect in `<file>:<line>`

## Recommended Actions

1. <highest priority>
2. <next priority>
```

## Notes

- Prefer actionable findings with file paths and line numbers.
- Do not block on remote MCP failures; provide local-only output with explicit caveats.
