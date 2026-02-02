/# Implementation Plan: Enhanced ContractSpec Impact Report Table

## Goal

Provide a concise, actionable contract-level verification table in the ContractSpec impact report, enabling stakeholders to quickly identify contracts that are drifting, not fully covered, or not recently verified.

## Background

Today's impact reports summarise contract changes, risk classifications, validation results, drift results, and next steps. They lack a consolidated per-contract health view. Non-technical stakeholders struggle to interpret risk classifications, and engineering managers cannot easily prioritise remediation across dozens of contracts. This feature adds a verification status table near the top of the report.

## Constraints

- Backward compatible: existing reports without `contracts` data must render without errors
- Performance: linear-time scanning per contract; cache GitHub API calls
- Security: expose only short commit SHAs and dates; no PII, secrets, or full commit messages
- Markdown must render correctly in GitHub PR comments and Actions step summaries
- Files must stay under 250 lines; split immediately if exceeded
- No `any` types; strict TypeScript throughout

## ContractSpec Alignment

### Contracts to create

| Type | Name | Path | Owners |
|------|------|------|--------|
| `defineQuery` | `report.getContractVerificationStatus` | `packages/libs/contracts/src/operations/report/` | `team-platform` |
| `defineDataView` | `report.contractVerificationTable` | `packages/libs/contracts/src/data-views/report/` | `team-platform` |

### Contract: `report.getContractVerificationStatus`

```
meta:
  name: report.getContractVerificationStatus
  version: 1.0.0
  description: Retrieves per-contract verification status for the impact report
  goal: Enable stakeholders to see contract health at a glance
  context: Part of the impact report domain; reads from drift check outputs and verified.json
  owners: [team-platform]
  tags: [report, drift, verification]
io:
  input: { projectPath: string, baseline?: string }
  output: { contracts: ContractVerificationStatus[] }
  errors:
    PROJECT_NOT_FOUND: { description: "Project path does not exist", http: 404 }
policy:
  auth: anonymous (CLI context)
```

### Contract: `report.contractVerificationTable`

```
meta:
  name: report.contractVerificationTable
  version: 1.0.0
  description: Data view for the contract verification status table rendered in reports
  goal: Provide a structured view of contract health for Markdown rendering
  context: Consumed by action-pr and action-drift report generators
  owners: [team-platform]
  tags: [report, data-view, verification]
```

### Registry updates

- Register `report.getContractVerificationStatus` in `packages/libs/contracts/src/operations/registry.ts`
- Register `report.contractVerificationTable` in `packages/libs/contracts/src/data-views/registry.ts`

### Versioning strategy

- New additive feature; no breaking changes to existing `ReportData`
- `contracts` field is optional; semver minor bump (e.g., 1.x.0 -> 1.(x+1).0)

## Delivery Steps

### Step 1: Define contracts (spec-first)

1. Create `packages/libs/contracts/src/operations/report/getContractVerificationStatus.ts`
   - Define `ContractVerificationStatus` interface with fields: `name`, `lastVerifiedSha?`, `lastVerifiedDate?`, `surfaces`, `driftMismatches`
   - Define the query contract using `defineQuery`
   - Include meta fields: name, version, description, goal, context, owners, tags
   - Include IO schema (input/output) and error definitions
2. Create `packages/libs/contracts/src/data-views/report/contractVerificationTable.ts`
   - Define the data view contract using `defineDataView`
3. Register both contracts in their respective registries
4. Update `ReportData` interface in both `action-pr` and `action-drift` to add optional `contracts?: ContractVerificationStatus[]`

### Step 2: Implement data collection

1. **Surface detection** (`packages/libs/contracts/src/` or shared utility):
   - Determine surfaces per contract by inspecting spec properties:
     - API schema / runtime validation: `io.input` or `io.output` defined
     - UI form: form definition present in spec
     - Docs/examples: descriptions, examples, or documentation annotations present
     - Permissions: `policy` defined
   - Keep under 100 lines as a utility
2. **Per-contract drift aggregation**:
   - Modify drift detector to map mismatches back to originating contracts
   - Aggregate mismatch count per contract name
3. **Verified state persistence** (Option A - `.contractspec/verified.json`):
   - After successful drift check, write/update mapping of contract name -> `{ sha, date }`
   - Read during report generation to populate `lastVerifiedSha` and `lastVerifiedDate`
4. **Age calculation utility**:
   - Compute human-friendly elapsed time from `lastVerifiedDate` to now
   - Display "Never" when no verification exists

### Step 3: Implement report table rendering

1. In `packages/apps/action-pr/src/report.ts`:
   - Read `contracts` from `ReportData`
   - If present and non-empty, render Markdown table after heading, before "What changed"
   - Columns: Contract name | Time since verified | Drift debt | Surfaces covered | Last verified commit
2. In `packages/apps/action-drift/src/report.ts`:
   - Same table rendering logic (extract shared renderer if both exceed size limits)
3. Backward compatibility: skip table when `contracts` is undefined/empty

### Step 4: Update CI workflows

1. Pass expanded JSON report file to report scripts
2. PR workflow: collect per-contract data only for changed contracts
3. Drift workflow (main): collect data for all contracts
4. Write/update `.contractspec/verified.json` after successful drift check

### Step 5: Tests and DocBlocks

1. **Unit tests**:
   - `ContractVerificationStatus` schema backward compatibility
   - Surface detection logic
   - Age calculation and table cell formatting
   - Report rendering with/without `contracts` data
2. **Integration tests**:
   - Simulate multi-contract repository; verify JSON report and rendered table
3. **DocBlocks**:
   - Create DocBlock for the verification table feature (kind: `how`, visibility: `public`)
   - Register via `registerDocBlocks` with stable route

## Impact & Diff

- Run `contractspec impact` before committing each step to verify no unexpected breaking changes
- Run `contractspec impact --baseline main` for the PR summary
- Run `contractspec diff` if comparing versions of the report data model

## Validation

- `contractspec ci --check-drift` before PR/push
- `bun run lint` passes (no `any`, no raw HTML in app code)
- `bun test` passes with coverage thresholds met (utilities: 95%, services: 80%)
- Report renders correctly in GitHub PR comment preview

## Post-plan Verification

- **Product/business**: contract goals ("enable stakeholders to see contract health at a glance") align with the PRD motivation
- **Technical**: run Greptile/Graphite review if configured; summarize findings
- `contractspec impact` reports no unexpected breaking changes
- All DocBlocks include `kind` and `visibility` fields with allowed values
