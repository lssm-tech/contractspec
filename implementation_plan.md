# Implementation Plan: Central Context + Background Agents + ACP (Server + Client)

## Goal

Deliver a ContractSpec-native central context system with auditable background agents and full ACP server + client support (HTTP streamable first), while keeping data retrieval powerful, governed, and traceable.

## Background

### Pain points to solve

- Context is fragmented across docs, contracts, schemas, and data sources, which makes AI output inconsistent and hard to audit.
- Background automation lacks durable run logs, approvals, and replayable provenance.
- External agent interoperability (ACP) is missing or incomplete.
- Data access is either too constrained (no live data) or too risky (no governance layer).

### Success metrics

- 100 percent of agent runs reference a context snapshot ID.
- Context snapshots are deterministic and reproducible across environments.
- ACP server + client conformance tests pass for HTTP streamable transport.
- Policy enforcement prevents any unauthorized data access or tool execution.
- Studio surfaces can explain why an agent did something (context + tools + approvals).

## Constraints

- Spec-first: contracts come before implementation.
- DocBlocks are canonical; no /docs markdown updates.
- Layering rules: libs -> bundles -> apps, no upward dependencies.
- No raw HTML in apps or bundles; design system components only.
- Auditability and traceability take precedence over convenience.
- Security priority: Security > Compliance > Safety/Privacy > Stability/Quality > UX > Performance > Convenience.
- ACP must support server + client with HTTP streamable transport first.
- Auth must support API key, OAuth, and internal tokens.
- Vector store defaults to Postgres pgvector, but must be pluggable.
- Studio integration happens after ACP baseline is stable.

## ContractSpec Alignment

### Contracts to create (type + path + owners)

- Query: `context.pack.describe` -> `packages/libs/contracts/src/operations/context/contextPackDescribe.query.ts` (owners: platform.context)
- Query: `context.pack.search` -> `packages/libs/contracts/src/operations/context/contextPackSearch.query.ts` (owners: platform.context)
- Command: `context.pack.snapshot` -> `packages/libs/contracts/src/operations/context/contextPackSnapshot.command.ts` (owners: platform.context)

- Query: `database.schema.describe` -> `packages/libs/contracts/src/operations/database/databaseSchemaDescribe.query.ts` (owners: platform.data)
- Query: `database.migrations.list` -> `packages/libs/contracts/src/operations/database/databaseMigrationsList.query.ts` (owners: platform.data)
- Query: `database.dictionary.get` -> `packages/libs/contracts/src/operations/database/databaseDictionaryGet.query.ts` (owners: platform.data)
- Query: `database.query.readonly` -> `packages/libs/contracts/src/operations/database/databaseQueryReadonly.query.ts` (owners: platform.data)

- Command: `agent.run` -> `packages/libs/contracts/src/operations/agent/agentRun.command.ts` (owners: platform.ai)
- Query: `agent.status` -> `packages/libs/contracts/src/operations/agent/agentStatus.query.ts` (owners: platform.ai)
- Command: `agent.cancel` -> `packages/libs/contracts/src/operations/agent/agentCancel.command.ts` (owners: platform.ai)
- Query: `agent.artifacts` -> `packages/libs/contracts/src/operations/agent/agentArtifacts.query.ts` (owners: platform.ai)
- Command: `agent.approvals` -> `packages/libs/contracts/src/operations/agent/agentApprovals.command.ts` (owners: platform.ai)

- Command: `acp.session.init` -> `packages/libs/contracts/src/operations/acp/acpSessionInit.command.ts` (owners: platform.ai)
- Command: `acp.session.resume` -> `packages/libs/contracts/src/operations/acp/acpSessionResume.command.ts` (owners: platform.ai)
- Command: `acp.session.stop` -> `packages/libs/contracts/src/operations/acp/acpSessionStop.command.ts` (owners: platform.ai)
- Command: `acp.prompt.turn` -> `packages/libs/contracts/src/operations/acp/acpPromptTurn.command.ts` (owners: platform.ai)
- Command: `acp.tool.calls` -> `packages/libs/contracts/src/operations/acp/acpToolCalls.command.ts` (owners: platform.ai)
- Command: `acp.terminal.exec` -> `packages/libs/contracts/src/operations/acp/acpTerminalExec.command.ts` (owners: platform.ai)
- Command: `acp.fs.access` -> `packages/libs/contracts/src/operations/acp/acpFsAccess.command.ts` (owners: platform.ai)

- Event: `context.snapshot.created` -> `packages/libs/contracts/src/events/context/contextSnapshotCreated.event.ts` (owners: platform.context)
- Event: `agent.run.started` -> `packages/libs/contracts/src/events/agent/agentRunStarted.event.ts` (owners: platform.ai)
- Event: `agent.run.completed` -> `packages/libs/contracts/src/events/agent/agentRunCompleted.event.ts` (owners: platform.ai)
- Event: `agent.run.failed` -> `packages/libs/contracts/src/events/agent/agentRunFailed.event.ts` (owners: platform.ai)
- Event: `agent.approval.requested` -> `packages/libs/contracts/src/events/agent/agentApprovalRequested.event.ts` (owners: platform.ai)

- Capability: `context.system` -> `packages/libs/contracts/src/capabilities/contextSystem.capability.ts` (owners: platform.context)
- Capability: `agent.execution` -> `packages/libs/contracts/src/capabilities/agentExecution.capability.ts` (owners: platform.ai)
- Capability: `acp.transport` -> `packages/libs/contracts/src/capabilities/acpTransport.capability.ts` (owners: platform.ai)
- Capability: `database.context` -> `packages/libs/contracts/src/capabilities/databaseContext.capability.ts` (owners: platform.data)

- Data view: `context.snapshot.index` -> `packages/libs/contracts/src/data-views/contextSnapshots.dataView.ts` (owners: platform.context)
- Data view: `agent.run.index` -> `packages/libs/contracts/src/data-views/agentRuns.dataView.ts` (owners: platform.ai)
- Data view: `database.schema.index` -> `packages/libs/contracts/src/data-views/databaseSchemas.dataView.ts` (owners: platform.data)

- Form: `agent.run.form` -> `packages/libs/contracts/src/forms/agentRun.form.ts` (owners: platform.ai)
- Form: `context.pack.search.form` -> `packages/libs/contracts/src/forms/contextPackSearch.form.ts` (owners: platform.context)

- Presentation: `context.snapshot.summary` -> `packages/libs/contracts/src/presentations/contextSnapshot.presentation.ts` (owners: platform.context)
- Presentation: `agent.run.audit` -> `packages/libs/contracts/src/presentations/agentRunAudit.presentation.ts` (owners: platform.ai)

### Required meta fields for every contract

- `name`, `version`, `description`, `goal`, `context`, `owners`, `tags`
- IO schemas and policy definitions must be present for every operation.

### Registry updates

- Update registries for operations, events, capabilities, data views, forms, and presentations.
- Ensure DocBlocks are registered (no barrel registries).

### Versioning strategy

- New specs start at `1.0.0` and follow semver.
- Breaking changes require new major versions and deprecation notices in DocBlocks.
- Old versions remain registered until migration is complete.

## Delivery Steps

1. Define contracts (spec-first)
   - Create all operations, events, capabilities, data views, forms, and presentations listed above.
   - Add DocBlocks for every new spec and link them via `docId`.
   - Register all specs in their registries.

2. Implement handlers and adapters using contract types
   - Build context snapshot pipeline and knowledge ingestion with pgvector default and pluggable adapters.
   - Implement read-only data access using DataView-backed queries with policy gating and redaction.
   - Implement durable agent run orchestration with approvals, artifacts, and telemetry.
   - Implement ACP server (HTTP streamable) and ACP client; bridge MCP-over-ACP.
   - Defer Studio UI implementation until ACP baseline is stable.

3. Tests and docs updates
   - Add contract tests, run orchestration tests, and ACP conformance tests.
   - Update DocBlocks for all behavior and policy decisions.
   - Ensure knowledge and context documentation is in DocBlocks only.

## Impact and Diff

- Run `contractspec impact` before committing changes.
- Run `contractspec impact --baseline main` to generate PR summaries.
- Use `contractspec diff <refA>..<refB> --json` when comparing versions.
- For breaking changes, create new versions and document deprecations with migration guidance.

## Generation and Validation

- Run `contractspec generate` when scaffolding specs or registries is needed.
- Run `contractspec ci --check-drift` before PR or push.
- Run package-level lint and tests for touched packages.

## Post-plan Verification

- Product and business review: confirm contract goals and context align to intended outcomes.
- Technical review: run Greptile or Graphite review if configured, summarize findings.
- Confirm `contractspec impact` reports no unexpected breaking changes.

## Plan execution

- Hand off to `/implementation-plan` once this plan is finalized.
