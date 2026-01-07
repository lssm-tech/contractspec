AUDIENCE: Coding agent implementing features in the ContractSpec repository (CL + VSCodeI + workflows + CI integration)
GOAL: Make ContractSpec “YC-ready” by turning it into an inevitable PR/CI wedge: deterministic contract diffs, breaking-change detection, drift enforcement, and a single guided workflow entrypoint (`contractspec vibe`) that orchestrates existing primitives reliably.

CONTEXT (already implemented):
- `contractspec vibe` command group + workflow runner
- YAML parsing for configs/workflows (previously JSON/TS)
- Pack install supports remote registries
- More built-in workflows (release, migration, etc.)
- Interactive mode for manual checkpoints (currently simple confirmation)

NOW: stop expanding features. Focus on reliability, determinism, and distribution-quality PR/CI integration.

=================================================
1) PRODUCT PRINCIPLES (non-negotiable)
=================================================
Single source of truth boundaries:
- Canonical: contracts/** (or configured canonical root)
- Work/scaffolding: .contractspec/work/** (disposable)
- Generated: configurable generated root (e.g., src/generated/**), never hand-edited

Enforcement:
- CI must detect drift (canonical contracts vs derived outputs) and fail when required.
- Contract changes must be summarized in a structured, machine-readable way.
- Outputs must be deterministic and stable (JSON schemas with versioning).

=================================================
2) P0 DELIVERABLES (must ship)
=================================================

2.1) Deterministic machine-readable outputs everywhere (stability first)
Implement and/or standardize `--json` outputs for:
- `contractspec impact --json`
- `contractspec diff --json`
- `contractspec ci --json`
- `contractspec vibe run <workflow> --json`

Requirements:
- Add `schemaVersion` to every JSON payload.
- Ensure keys/structure are stable; avoid human-oriented strings in JSON mode.
- Provide minimal, structured fields that downstream automation can rely on.

2.2) Drift enforcement (the wedge)
ContractSpec must be able to:
- Rebuild derived artifacts deterministically from canonical contracts.
- Detect drift between:
  - canonical contracts vs derived artifacts (generated outputs)
  - canonical contracts vs implementation (if supported)
- Provide a single command suitable for CI:
  - `contractspec ci --json` with strict exit codes.
- Add flags:
  - `--fail-on-warn` (optional)
  - `--fail-on-drift` (default in CI mode)
  - `--non-interactive` (default for CI)

2.3) PR/CI integration (GitHub Action template)
Ship a first-party GitHub Action workflow template that:
- Runs `contractspec ci --json`
- Produces a PR comment summarizing:
  - contract diff summary
  - breaking-change flag
  - drift status
- Fails the check when drift/breaking policies are violated.

Must support:
- posting a new comment OR updating an existing comment (idempotent behavior)
- running on pull_request events
- minimal config; works out-of-the-box

2.4) `contractspec vibe` is the golden path (reliability + clarity)
`contractspec vibe` should orchestrate primitives with rock-solid behavior:
- `contractspec vibe init`
  - creates: .contractspec/vibe/*, .contractspec/work/*
  - idempotent, no overwrite without `--force`
  - prints next steps (exact commands)

- `contractspec vibe run <workflow>`
  - supports: `--track quick|product|regulated` (default: product)
  - supports: `--dry-run` (prints plan only)
  - supports: `--json`
  - supports: `--fail-fast`
  - supports: `--no-clean`
  - supports: `--non-interactive` (no prompts; fail with actionable errors)
  - must exit non-zero on any step failure

Built-in workflows (minimum set):
- `brownfield.openapi-import`
- `change.feature`
(If release/migration already exist, keep them, but do not add more for P0.)

2.5) Docs that match reality (copy/paste runnable)
Ship 2 tutorials that exactly match the tool behavior:
- “10-minute brownfield OpenAPI import → canonical contracts → regenerate → ci”
- “Daily workflow: edit contracts → apply/generate → PR/CI checks”

=================================================
3) WHAT NOT TO DO (explicit anti-scope list)
=================================================
- No new workflows unless required to support PR/CI wedge.
- No new registry UX. Remote pack install already exists.
- No multi-agent framework. `vibe` is a workflow runner, not a chatbot product.
- No “dump the whole repo” exporter by default.
- No Studio work for P0.

=================================================
4) ACCEPTANCE CRITERIA (Definition of Done)
=================================================

A) JSON stability
- Every `--json` command includes `schemaVersion`.
- Snapshot tests verify JSON schemas are stable across runs.
- JSON mode contains no human-only prose fields except in a dedicated `message` field (optional).

B) Drift + CI
- `contractspec ci` returns:
  - exit code 0 when all checks pass and no drift
  - exit code non-zero on drift or failed validations
- Drift detection is deterministic and reproducible.

C) PR integration template works
- In a sample repository fixture (or integration test setup):
  - PR triggers workflow
  - workflow runs `contractspec ci --json`
  - PR comment includes:
    - breaking flag
    - summary of changes
    - drift status
  - workflow fails when drift exists

D) `vibe` UX
- `vibe init` and `vibe run` operate without manual fixes.
- `--dry-run` prints a step plan and does not modify files.
- `--non-interactive` never prompts, but fails with actionable instructions.

E) Docs
- Tutorials are copy/paste runnable and verified against tests or a demo fixture.

=================================================
5) ENGINEERING REQUIREMENTS
=================================================
- Prefer calling internal modules instead of shelling out; if shelling out:
  - safe argument handling
  - stream logs
  - capture structured outputs cleanly
- Safety:
  - `clean` must never delete outside `.contractspec/work/**` unless explicit flags.
- Performance:
  - CI path should be as fast as possible (skip expensive optional steps unless `--track regulated`).
- Backwards compatibility:
  - Existing commands remain functional; `vibe` is additive.
  - YAML config support must not break existing JSON/TS configs.

=================================================
6) JSON SCHEMA GUIDELINES (example; implement and freeze)
=================================================
impact.json:
{
  "schemaVersion": "1.0",
  "breaking": true|false,
  "changes": [
    {"type": "...", "path": "...", "summary": "...", "severity": "low|medium|high"}
  ]
}

ci.json:
{
  "schemaVersion": "1.0",
  "checks": [{"name": "...", "status": "pass|fail|warn", "details": {...}}],
  "drift": {"status": "none|detected", "files": ["..."]},
  "summary": {"pass": 0, "fail": 0, "warn": 0}
}

vibe-run.json:
{
  "schemaVersion": "1.0",
  "workflow": "...",
  "track": "...",
  "steps": [
    {"name": "...", "status": "pass|fail|skip", "command": "...", "artifactsTouched": ["..."]}
  ],
  "result": {"status": "pass|fail", "exitCode": 0}
}

=================================================
7) IMMEDIATE TASK LIST (start here, in order)
=================================================
1) Audit current `--json` outputs for impact/diff/ci/vibe and standardize + add schemaVersion.
2) Add snapshot tests for JSON outputs to prevent regressions.
3) Implement drift detection + `ci` strict exit codes + `--non-interactive`.
4) Ship GitHub Action workflow template + PR comment renderer (idempotent).
5) Validate against a sample repo fixture + fix papercuts.
6) Write the 2 tutorials and verify they match actual outputs.

DELIVERABLES TO COMMIT:
- code changes
- tests (including JSON snapshots)
- GitHub Action template
- documentation tutorials