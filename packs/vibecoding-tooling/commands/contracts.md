---
description: List all contracts in the project, optionally filtered by domain
targets: ['*']
---

domain = $ARGUMENTS

List all ContractSpec contracts, optionally filtered by a domain:

1. **Determine scope**:
   - If `domain` provided (e.g., `vcs`, `change`, `onboarding`): filter to that domain
   - If empty: list all contracts across all domains

2. **Scan contract definitions**:
   - Use Serena to search `packages/libs/contracts-contractspec-studio/src/` for calls to:
     - `defineCommand` - command contracts
     - `defineQuery` - query contracts
     - `defineEvent` - event contracts
   - For each contract found, extract:
     - **Name**: the operation key (e.g., `createPullRequest`)
     - **Version**: from the spec's `version` field
     - **Type**: command | query | event
     - **Domain/Tags**: from the spec's `tags` or directory grouping
     - **Owners**: from the spec's `owners` field or `CODEOWNERS`

3. **Cross-reference with remote state** (optional):
   - If the `contractspec-cli` MCP is available, call `contractspec.listOperations` to fetch the registry state
   - Compare local definitions against remote to flag drift

4. **Format output**:
   - Group by domain
   - Sort alphabetically within each group
   - Show a summary count per type

## Example output

```
## Contracts (12 total)

### vcs (5)
| Name              | Type    | Version | Owners       | Tags        |
|-------------------|---------|---------|--------------|-------------|
| createPullRequest | command | 1.2.0   | @team-vcs    | vcs, pr     |
| getPullRequest    | query   | 1.0.0   | @team-vcs    | vcs, pr     |
| listBranches      | query   | 1.1.0   | @team-vcs    | vcs, branch |
| prMerged          | event   | 1.0.0   | @team-vcs    | vcs, pr     |
| prOpened          | event   | 1.0.0   | @team-vcs    | vcs, pr     |

### change (4)
| Name       | Type    | Version | Owners       | Tags          |
|------------|---------|---------|--------------|---------------|
| applyPatch | command | 0.9.0   | @team-change | change, patch |
| ...        | ...     | ...     | ...          | ...           |

Summary: 7 commands, 3 queries, 2 events
```
