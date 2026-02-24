---
description: Analyze the codebase for contract coverage, drift, and orphaned specs
targets: ['*']
---

scope = $ARGUMENTS

Run a full codebase analysis to assess contract coverage and health:

1. **Determine scope**:
   - If `scope` provided (e.g., `packages/apps/api`): restrict analysis to that directory
   - If empty: analyze the entire project

2. **Extract source deliverables**:
   - Use `@contractspec/lib.source-extractors` to detect:
     - **Framework**: Express, Fastify, Next.js, tRPC, etc.
     - **Endpoints**: HTTP routes, API handlers, RPC methods
     - **Schemas**: Zod schemas, TypeScript types, database models
     - **Event handlers**: message consumers, webhook handlers
   - Use Serena to scan for route definitions, handler exports, and schema declarations

3. **Extract contract definitions**:
   - Scan for all `defineCommand`, `defineQuery`, `defineEvent` calls
   - Build a registry of declared contracts with their operation keys

4. **Cross-reference**:
   - Match endpoints -> contracts (by name, path, or handler reference)
   - Match event handlers -> event contracts
   - Match schemas -> contract input/output types
   - Identify:
     - **Covered endpoints**: have a matching contract
     - **Uncovered endpoints**: no contract defined
     - **Orphaned contracts**: contract exists but no implementation found
     - **Drift**: implementation diverges from contract (mismatched fields, types)
     - **Ambiguities**: multiple contracts could match a single endpoint

5. **Generate report**:
   - Show coverage percentage
   - List all findings grouped by category
   - Include file:line references for each finding
   - Suggest next steps for uncovered endpoints and orphaned contracts

## Example output

```
## Codebase Analysis Report

Scope: packages/apps/api
Framework: Express + tRPC

### Coverage: 78% (14/18 endpoints covered)

### Covered Endpoints (14)
| Endpoint              | Contract         | Status |
|-----------------------|------------------|--------|
| POST /api/users       | createUser       | yes    |
| GET  /api/users/:id   | getUser          | yes    |
| ...                   | ...              | ...    |

### Uncovered Endpoints (4)
| Endpoint              | File                          | Line |
|-----------------------|-------------------------------|------|
| POST /api/invite      | src/routes/invite.ts          | 12   |
| GET  /api/metrics     | src/routes/metrics.ts         | 8    |
| DELETE /api/users/:id | src/routes/users.ts           | 45   |
| PATCH /api/settings   | src/routes/settings.ts        | 22   |

### Orphaned Contracts (1)
| Contract       | File                                          | Line |
|----------------|-----------------------------------------------|------|
| archiveProject | contracts-contractspec-studio/src/project.ts  | 34   |

### Drift (2)
| Contract    | Issue                          | File              | Line |
|-------------|--------------------------------|-------------------|------|
| createUser  | extra field `nickname` in impl | handlers/users.ts | 58   |
| getUser     | missing field `role` in impl   | handlers/users.ts | 92   |

### Ambiguities (0)
None detected.

### Recommendations
1. Add contracts for 4 uncovered endpoints
2. Remove or implement `archiveProject` contract
3. Align `createUser` and `getUser` implementations with their specs
```

## Related commands

- Run `/audit-health` for file organization, reusability, and observability coverage checks (complementary to contract analysis).
- Run `/audit-observability` for detailed logging/analytics gap analysis.
- Run `/impact` to analyze changes between branches for contract drift.
