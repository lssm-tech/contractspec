# Implementation Plan: OpenCode agent mode in ContractSpec CLI

## Goal

Enable first-class OpenCode agent mode in the ContractSpec CLI (user-facing `opencode` alias mapped to `opencode-sdk`) alongside existing modes to expand vendor-neutral AI backend options.

Success metrics:

- `contractspec build ... --agent-mode opencode` routes to `opencode-sdk`.
- `contractspec validate ... --agent-mode opencode` accepts the mode.
- CLI docs/help describe OpenCode and dependency on `@opencode-ai/sdk`.
- Tests cover opencode routing and fallback chain behavior.
- Example exists under `packages/examples/` using OpenCode.
- No unexpected breaking changes in `contractspec impact`.

## Background

- The library already implements and registers the `opencode-sdk` backend.
- CLI `--agent-mode` omits OpenCode; validate also omits it.
- Pain points: users cannot select OpenCode; docs/examples/tests do not mention it.

## Constraints

- Spec-first: update contracts before implementation changes.
- Preserve existing modes and defaults (no regressions).
- TypeScript strict, no `any`, 2-space formatting, file size limits.
- Conflict priority: Security > Compliance > Safety/Privacy > Stability/Quality > UX > Performance > Convenience.

## ContractSpec Alignment

Deliverable mapping to contracts:

- CLI `--agent-mode opencode` and config alias -> data view (workspace config) and command semantics (build/validate behavior already defined; no new command spec unless missing).
- Agent registration/alias -> capability (external agent support) if a new capability spec is required; otherwise update existing config data view only.
- CLI help/README updates -> presentation/doc contracts.
- Tests and example -> no new contract unless a new example spec is introduced.

Contracts to create/update (type + path + owners):

- Data view (workspace config) update: `packages/libs/contracts/src/workspace-config/contractsrc-schema.ts` (owners: follow existing workspace-config ownership; add if missing).
- Data view (workspace config) update: `packages/libs/contracts/src/workspace-config/contractsrc-types.ts` (owners: follow existing workspace-config ownership; add if missing).
- Presentation/doc update: `packages/libs/contracts/src/docs/tech/cli.docblock.ts` (owners: `@contractspec/app.cli-contractspec`).
- Presentation/doc update (if documenting agentMode in workspace config docs): `packages/libs/contracts/src/workspace-config/workspace-config.docblock.ts` (owners: follow existing workspace-config ownership; add if missing).
- Optional capability spec (only if needed for external agent alias): `packages/libs/contracts/src/capabilities/` (owners: align with existing capability ownership).

Contract requirements for any new specs:

- Meta fields: `name`, `version`, `description`, `goal`, `context`, `owners`, `tags`.
- IO schema definitions for command/query/event specs.
- Policy definitions for command/query/event specs.

Registry updates:

- Ensure docblocks/specs are registered (e.g., `registerDocBlocks` usage or registry updates) for any new files.
- Update any spec registries if new capability/data view specs are added.

Versioning strategy:

- Additive alias or enum expansion: patch/minor bump.
- Breaking change: deprecate old value for one minor, then major bump on removal.

## Delivery Steps

1. Define contracts (spec-first)
   - Update workspace-config data view enum to allow `opencode` alias if supported.
   - Update CLI docblock (and workspace-config docblock if needed) to mention OpenCode and dependencies.
   - Add/update capability spec only if alias requires explicit capability.
   - Apply meta fields, IO schema, and policy definitions for any new specs.
   - Register any new docs/specs in the appropriate registries.

2. Implement handlers/UI using contract types
   - Extend CLI `build` and `validate` `--agent-mode` options to include `opencode`.
   - Map `opencode` to internal `opencode-sdk` when setting `config.agentMode`.
   - Add agent alias registration if required in the orchestrator.

3. Tests and docs updates
   - Add/update CLI tests for `--agent-mode opencode` and fallback chain.
   - Update README/help strings.
   - Add example under `packages/examples/` demonstrating OpenCode usage.

4. Generation (if scaffolding is needed)
   - Run `contractspec generate` when creating new spec files or example scaffolding.

## Impact & Diff

- Run `contractspec impact` before committing.
- Run `contractspec impact --baseline main` for PR summaries.
- Run `contractspec diff <refA>..<refB> --json` when comparing versions.

## Validation

- `contractspec ci --check-drift` before PR/push.
- Lint/test gates (as required by the plan):
  - CLI: `bun run lint` and `bun test` in `packages/apps/cli-contractspec`.
  - Contracts: run relevant tests if schema enums change.

## Post-plan Verification

- Business outcomes verified: goal/context align with vendor-neutral OpenCode support.
- Technical review: run Greptile/Graphite if configured and summarize findings.
- Confirm `contractspec impact` reports no unexpected breaking changes.

## Plan Execution

- Hand off to `/implementation-plan` once this plan is saved.
