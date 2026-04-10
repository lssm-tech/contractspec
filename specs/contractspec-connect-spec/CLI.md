# CLI Surface

## Principles

- Connect lives inside the existing `contractspec` CLI
- Bun-first examples and smoke checks
- local-first defaults
- DTO output is deterministic and scriptable
- reuse `impact` and `control-plane` commands where they already exist

## Implemented command family

```bash
contractspec connect init [--scope workspace|package]
contractspec connect context --task <task-id> [--baseline <ref>] [--paths <path...>] [--actor-id <id>] [--actor-type <type>] [--session-id <id>] [--trace-id <id>]
contractspec connect plan --task <task-id> --stdin [--baseline <ref>] [--paths <path...>] [--actor-id <id>] [--actor-type <type>] [--session-id <id>] [--trace-id <id>]
contractspec connect verify --task <task-id> --tool acp.fs.access --stdin [--baseline <ref>] [--actor-id <id>] [--actor-type <type>] [--session-id <id>] [--trace-id <id>]
contractspec connect verify --task <task-id> --tool acp.terminal.exec --stdin [--baseline <ref>] [--paths <path...>] [--actor-id <id>] [--actor-type <type>] [--session-id <id>] [--trace-id <id>]
contractspec connect hook contracts-spec before-file-edit --stdin
contractspec connect hook contracts-spec before-shell-execution --stdin
contractspec connect hook contracts-spec after-file-edit --stdin
contractspec connect review list
contractspec connect review sync [--all|--decision <decision-id>] [--queue <queue>]
contractspec connect replay <decision-id>
contractspec connect eval <decision-id> --registry <path> (--scenario <key> | --suite <key>) [--version <version>]
```

## Existing CLI surfaces Connect should reuse

```bash
contractspec impact --baseline origin/main
contractspec control-plane approval list --workspace-id workspace-1
contractspec control-plane trace get <decision-id>
contractspec control-plane trace replay <decision-id>
```

## Command semantics

### `contractspec connect init`

- writes or updates `.contractsrc.json`
- scaffolds the `connect` namespace
- creates `.contractspec/connect/` if missing
- respects `--scope workspace|package`
- does **not** create `connect.config.ts` or `connect.overlay.ts`

### `contractspec connect context --task <task-id>`

- prints or writes a `ContextPack`
- resolves affected contracts, surfaces, policy bindings, and config refs
- accepts explicit `--paths` or derives changed files from `--baseline`
- persists the latest `context-pack.json`
- remains a projection over current repo state

### `contractspec connect plan --task <task-id> --stdin`

- accepts a natural-language or structured plan candidate
- returns a `PlanPacket`
- accepts raw text or JSON `{ objective, steps?, touchedPaths?, commands? }`
- persists the latest `context-pack.json` and `plan-packet.json`
- sets `verificationStatus` to `approved`, `revise`, `review`, or `denied`
- populates `requiredApprovals` when review-backed continuation is required
- always includes refs to:
  - `controlPlane.intent.submit`
  - `controlPlane.plan.compile`
  - `controlPlane.plan.verify`

### `contractspec connect verify --task <task-id> --tool acp.fs.access --stdin`

- accepts a normalized filesystem mutation candidate
- returns a `PatchVerdict`
- adapter-facing action types may remain `write_file` or `edit_file`, but the underlying tool ref is ACP-aligned
- always persists latest artifacts, append-only `audit.ndjson`, and a per-decision snapshot under `.contractspec/connect/decisions/<decisionId>/`
- populates `PatchVerdict.controlPlane.decisionId` and approval status when runtime linkage is available
- maps verdicts as:
  - `permit` -> `autonomous`
  - `rewrite` -> `assist` without approval
  - `require_review` -> `assist` with approval
  - `deny` -> `blocked`

### `contractspec connect verify --task <task-id> --tool acp.terminal.exec --stdin`

- accepts a normalized command candidate
- classifies it with command policy and affected scope
- accepts JSON `{ command, cwd?, touchedPaths? }` or raw command text from stdin
- returns a `PatchVerdict`
- uses the same runtime-link behavior and per-decision evidence model as filesystem verification

### `contractspec connect hook contracts-spec <event> --stdin`

- provides a stable executable surface for Cursor, Claude Code, and Codex hook delivery
- accepts host hook payloads on stdin and normalizes them into Connect context/plan/verify flows
- supports:
  - `before-file-edit`
  - `before-shell-execution`
  - `after-file-edit`
- blocks on non-zero Connect outcomes for pre-mutation events
- refreshes local Connect artifacts and prints replay/review guidance for post-edit events

### `contractspec connect review list`

- lists pending local review packets under `.contractspec/connect/review-packets/`
- keeps local packet inspection authoritative even when Studio review transport is enabled

### `contractspec connect review sync`

- syncs one or more local review packets into the configured Studio review bridge
- defaults to all pending local review packets when `--decision` is omitted
- accepts `--queue` to override `.contractsrc.json > connect.studio.queue` for one sync attempt
- updates local decision envelopes and `audit.ndjson` with sync status, queue, and returned lineage refs
- remains best-effort for auto-sync after `verify`, but explicit `review sync` fails when bridge config or auth is missing

### `contractspec connect replay <decision-id>`

- resolves the local verdict and review artifacts from `.contractspec/connect/decisions/<decisionId>/`
- points back to trace and replay refs
- enriches with control-plane trace replay when trace metadata exists
- prefers the stored runtime-linked control-plane `decisionId`, then falls back to stored `traceId`
- returns a local-only envelope instead of failing when no trace is available

### `contractspec connect eval <decision-id> --registry <path> (--scenario <key> | --suite <key>)`

- runs deterministic evaluation for one prior decision
- requires `--registry`
- requires exactly one of `--scenario` or `--suite`
- reuses harness-style evaluation and replay patterns instead of inventing a separate evaluator
- stores `evaluation-result.json` beside the decision history and may also emit `replay-bundle.json`

## Exit code behavior

- `0` success or permit
- `10` rewrite required
- `20` review required
- `30` denied
- `40` missing config or missing authoritative refs

## Studio/operator HTTP surface

When Studio review-bridge mode is enabled, the internal control-plane app exposes:

```bash
POST /internal/control-plane/connect/reviews
GET  /internal/control-plane/connect/reviews
GET  /internal/control-plane/connect/reviews/:id
```

- queue items remain projections over local Connect artifacts plus current control-plane and execution-lane state
- dashboard responses include a `connectReviewQueue` section for pending review work

## Output behavior

- default output is concise operator text
- `--json` emits full DTO payloads or replay/evaluation envelopes
- `context`, `plan`, and `verify` still persist local artifacts even when stdout is piped

## Example `.contractsrc.json` shape

```json
{
  "connect": {
    "enabled": true,
    "adapters": {
      "cursor": { "enabled": true, "mode": "plugin" },
      "codex": { "enabled": true, "mode": "wrapper" }
    },
    "storage": {
      "root": ".contractspec/connect",
      "contextPack": ".contractspec/connect/context-pack.json",
      "planPacket": ".contractspec/connect/plan-packet.json",
      "patchVerdict": ".contractspec/connect/patch-verdict.json",
      "auditFile": ".contractspec/connect/audit.ndjson",
      "reviewPacketsDir": ".contractspec/connect/review-packets"
    },
    "policy": {
      "protectedPaths": ["packages/libs/contracts-spec/**"],
      "immutablePaths": [".changeset/**"],
      "generatedPaths": ["generated/**"],
      "smokeChecks": ["bun run typecheck"],
      "reviewThresholds": {
        "protectedPathWrite": "require_review",
        "unknownImpact": "require_review",
        "contractDrift": "require_review",
        "breakingChange": "require_review",
        "destructiveCommand": "deny"
      }
    },
    "commands": {
      "allow": ["bun run typecheck"],
      "review": ["git push"],
      "deny": ["git push --force", "git reset --hard", "rm -rf"]
    },
    "canonPacks": [{ "ref": "team/platform@1.2.0", "readOnly": true }],
    "studio": {
      "enabled": true,
      "mode": "review-bridge",
      "endpoint": "http://127.0.0.1:8090",
      "queue": "connect-review"
    }
  }
}
```

## Explicit non-goals

- `npx @contractspec/connect init`
- a standalone `@contractspec/connect` CLI
- editor-specific commands that bypass the main `contractspec` CLI and current operator surfaces
