ROLE: Product Owner / Product Manager
AUDIENCE: Coding agent implementing features in the ContractSpec CLI repo
GOAL: Design + implement “contractspec vibe” as a guided, BMAD-inspired workflow layer that orchestrates existing ContractSpec primitives (extract/gap/apply/impact/ci/clean/view), reduces cognitive load, and enforces “single source of truth” (canonical contracts) while keeping scaffolding disposable.

========================
1) Problem / Why this exists
========================
ContractSpec already has the right primitives (extract, gap, apply, impact, ci, clean, view), but new users face a “verb soup” CLI that does not reveal the golden path.
We want a single, memorable entrypoint that:
- Makes the correct lifecycle obvious (especially for brownfield/baseline import work)
- Implements “spec-driven discipline without spec sprawl”: canonical contracts are truth, everything else is derived or disposable
- Brings BMAD-style “tracks, preferences, workflows, packs” to ContractSpec without becoming bureaucracy
- Increases adoption and repeat usage by making the workflow feel inevitable in PR/CI

Business outcomes:
- Higher conversion (install → first success)
- Faster time-to-value (brownfield import + consistent regeneration)
- Reduced drift incidents (CI fails on drift, enforced boundaries)
- Better distribution story (“vibe coding, but with contracts and guardrails”)

========================
2) Core product principle
========================
Single source of truth:
- Canonical (persisted and reviewed): contracts/** (or configured canonical root)
- Disposable scaffolding: .contractspec/work/** (always safe to delete)
- Generated artifacts: configurable generated root (e.g. src/generated/**) never edited by hand

Enforcement:
- CLI should make these boundaries explicit and default behaviors should follow them.
- CI should be able to detect drift: canonical contracts vs derived outputs.

========================
3) Scope (P0 vs P1)
========================
P0 (must ship first):
- New top-level command group: `contractspec vibe`
- Subcommands:
  1) `contractspec vibe init`
  2) `contractspec vibe run <workflow>`
  3) `contractspec vibe pack install <name>` (minimal stub to integrate with existing registry or local packs)
  4) `contractspec vibe context export` (optional P0-lite: produce a safe, allowlisted “context bundle” for LLMs/agents)
- Provide at least 2 built-in workflows:
  - `brownfield.openapi-import`
  - `change.feature`
- Track support: `--track quick|product|regulated` modifies depth/strictness + generated outputs
- Deterministic, machine-readable output options: `--json`, `--dry-run`, `--no-clean`, `--fail-fast`

P1 (nice-to-have after P0):
- More workflows (`release`, `hotfix`, `migration`)
- Pack marketplace browsing/search
- IDE integrations (Cursor/Claude Code slash commands generated from workflows)
- Advanced context packer: shard/index output, redaction policy, token budgets

Non-goals:
- Replacing existing commands or removing functionality
- Implementing a full multi-agent framework inside ContractSpec
- Bundling proprietary BMAD artifacts or copying their branding

========================
4) User stories
========================
US1: As a new user with an OpenAPI API, I run one command path to get canonical contracts + generated outputs and a clear next step list.
US2: As a dev, I edit contracts/** and run a single command to regenerate derived artifacts and validate drift.
US3: As a team, we run `contractspec vibe run … --track regulated` in CI to enforce stricter validation and compliance-related outputs.
US4: As a user of coding agents, I can export a safe “context bundle” that contains only allowlisted docs/contracts to feed an agent.

========================
5) CLI UX requirements
========================
Command: `contractspec vibe`
Positioning:
- “Vibe coding, but with contracts and guardrails.”
- Provide a boring alias for enterprise if possible: `contractspec flow` (alias to vibe). If aliasing is cheap and non-breaking, do it.

`contractspec vibe init`
- Creates:
  - .contractspec/vibe/technical-preferences.md  (agent guidance; stable project preferences)
  - .contractspec/vibe/config.(json|yaml)        (always-inject file list + defaults)
  - .contractspec/work/                          (scaffolding directory)
  - Optionally: contracts/ if missing (or respect existing config)
- Must not overwrite without `--force`
- Prints “next steps” with exact commands

`contractspec vibe run <workflow>`
- Orchestrates existing commands with correct ordering.
- Supports:
  - `--track quick|product|regulated` (default: product)
  - `--dry-run` (print plan, do not execute)
  - `--json` (machine output for automation)
  - `--no-clean` (keep scaffolding)
  - `--workdir` override
  - `--canonical-root` override (if not already in config)
  - `--generated-root` override
- Must exit non-zero on failure.
- Should output a concise summary:
  - steps executed
  - artifacts touched
  - drift/breaking-change status if available

`contractspec vibe pack install <name>`
- P0 minimal:
  - Support local packs via path: `contractspec vibe pack install ./packs/foo`
  - If registry exists: allow `contractspec vibe pack install registry:foo` (wire to existing `registry` command if possible)
- Pack contains:
  - workflows/*.yaml
  - templates/*
  - optional: ide-snippets/*

`contractspec vibe context export`
- Produce a safe bundle for agents:
  - allowlist-based (config-controlled)
  - respects .gitignore
  - excludes secrets: .env, keys, node_modules, dist, etc.
  - output:
    - .contractspec/context/index.json
    - .contractspec/context/files/** (copied or referenced)
    - optional: single concatenated file behind `--single` (P1)
- This is NOT OCR. This is NOT “dump the whole repo.”

========================
6) Workflow definitions (built-in)
========================
Workflow 1: brownfield.openapi-import
Goal: import OpenAPI into draft contracts (work), promote to canonical (user edits), regenerate, validate, clean.

Recommended step plan:
1) extract: `contractspec extract --from openapi --out .contractspec/work/openapi-import`
2) user action checkpoint (P0: just print instructions; P1: interactive mode):
   - “Review and move selected drafts into contracts/**”
3) gap: `contractspec gap`
4) apply: `contractspec apply` (or `generate` for all)
5) impact: `contractspec impact` (breaking vs non-breaking)
6) ci: `contractspec ci`
7) clean: `contractspec clean --work` (default on unless `--no-clean`)

Workflow 2: change.feature
Goal: for day-to-day contract edits
1) impact (or diff against main if available)
2) apply (regenerate derived)
3) ci
4) optional: changelog/version hooks (P1)

Track behaviors:
- quick:
  - minimal validations, skip expensive checks, skip optional docs generation
- product:
  - default validations + docs views
- regulated:
  - strict integrity checks, drift checks, enforce generated marker policy, require machine-readable reports, fail on warnings

========================
7) Implementation requirements (engineering)
========================
- Must reuse existing internal modules/commands rather than shelling out if the CLI codebase supports it.
  - If not feasible, shell out to `contractspec <cmd>` with robust error handling and streaming logs.
- Deterministic outputs:
  - For `--json`, output structured records of steps + statuses; avoid human-only strings in JSON mode.
- Config:
  - Extend existing .contractsrc.json (preferred) OR create .contractspec/vibe/config.yaml but keep a single source.
  - Config fields (minimum):
    - canonicalRoot
    - workRoot
    - generatedRoot
    - alwaysInjectFiles[]
    - contextExportAllowlist[]
- Safety:
  - Never export secrets in context export.
  - Never delete outside .contractspec/work unless user explicitly requests.
- DX:
  - `contractspec vibe --help` must be short and show golden path, not the whole CLI universe.
  - Keep the main CLI list untouched for backwards compatibility.
- Logging:
  - Human mode: readable, step-based, minimal spam.
  - JSON mode: stable schema, versioned.

========================
8) Acceptance criteria (Definition of Done)
========================
Functional:
- `contractspec vibe init` creates the expected files with sane defaults and is idempotent.
- `contractspec vibe run brownfield.openapi-import` runs the orchestrated steps and handles the “human checkpoint” clearly.
- `contractspec vibe run change.feature` works on a repo with existing contracts and regenerates + validates.
- `contractspec vibe pack install ./packs/foo` installs workflows and makes them runnable.
- `contractspec vibe context export` produces a bundle that excludes common secret patterns and ignored files.

Quality:
- Unit tests for workflow planner + config resolution + step execution ordering
- Snapshot tests for `--json` schema stability
- Docs: README section “Vibe workflows” with 2 copy/paste examples
- No breaking changes to existing CLI commands

========================
9) Deliverables
========================
- CLI implementation (new command group + workflow runner)
- Workflow definition format (YAML/JSON) + built-in workflows
- Config schema + migration strategy (if needed)
- Context export implementation + redaction rules
- Tests + docs

========================
10) Notes on naming and positioning
========================
- Use `vibe` as the marketing-friendly guided workflow mode.
- Optional alias: `flow` for enterprise or serious contexts.
- Do not call it `sdd` in user-facing UX (can appear in docs as “spec-driven discipline” but not as the command name).

========================
11) Success metrics (instrumentation optional, but plan it)
========================
- Time-to-first-success (init → first run)
- Number of users running vibe vs raw commands
- CI drift failure rate (should drop after adoption)
- Pack installs count