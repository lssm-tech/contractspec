# IMPLEMENTATION_PLAN.md — Lesson 12 Spec-Driven Development Adaptation for ContractSpec

## Context (why we’re doing this)

Teams keep shipping fast until they realize they’ve created **three competing “truths”**:
- product docs (what we *meant*)
- API specs / diagrams (what we *described*)
- code (what we *actually built*)

Those artifacts drift, and then humans + agents implement the wrong reality. Lesson 12’s underlying point is: **duplicated knowledge is a bug**. Specs should either be the single source of truth, or they should be disposable scaffolding that you regenerate when needed.

ContractSpec is already spec-first. The plan here is to adopt Lesson 12’s *anti-drift lifecycle* without sacrificing ContractSpec’s core promise: **one canonical contract, regenerable outputs, and continuous validation**.

---

## Goals

1. **One Source of Truth:** The ContractSpec contract is canonical. Everything else is a generated view.
2. **No Spec Sprawl:** Intermediate docs/specs are ephemeral and removable.
3. **Clear Verification:** A Product Owner can validate changes via stable “views” and PR summaries.
4. **Drift Prevention:** CI must detect and block divergence between contract and generated outputs.
5. **Adoption Wedge:** PR/CI integration makes ContractSpec feel inevitable in code review.

## Non-goals (for this implementation plan)

- Solving every legacy codebase edge case on day 1.
- Perfect bidirectional sync between arbitrary hand-written code and contracts.
- Supporting all CI providers immediately (start with GitHub Actions).

---

## Stakeholders & user types

- **Product Owner / PM:** validates user-facing behavior, scope, and breaking changes.
- **Engineering Lead:** validates system boundaries, generated outputs, and drift policy.
- **Developers:** run extract/gap/apply locally; review PR comments; fix contract violations.
- **QA:** uses QA views + generated test mapping to validate expected behavior.
- **Docs/DevRel (optional):** consumes generated documentation and SDKs.

---

## Definitions (terms used in this plan)

- **Contract (canonical):** the authoritative `contracts/**` files.
- **View:** a generated representation of the contract for a given audience (product/eng/qa).
- **Scaffolding:** temporary working artifacts used during extraction or planning (disposable).
- **Generated outputs:** OpenAPI/SDKs/docs/changelogs/etc. Never hand-edited.

---

# The 5 notions (Product Owner framing)

Each notion includes:
- **Intent:** what we want to guarantee
- **PO verification:** how a PM/PO checks it
- **Implementation requirements:** what must exist in ContractSpec
- **Acceptance criteria:** “done means…”

---

## Notion 1 — Single Source of Truth (SSoT): “The contract is law”

### Intent
Eliminate drift by ensuring there is exactly one canonical representation of behavior and interfaces: the **ContractSpec contract**.

### PO verification
- There is a single place to validate “what will ship”: `contracts/**`.
- Every PR shows a contract diff summary (human-readable).
- Generated OpenAPI/SDK/docs match the contract without manual edits.

### Implementation requirements
- A clear file policy:
    - Canonical: `contracts/**`
    - Generated: `generated/**` (or similar)
    - Work/scaffolding: `.contractspec/work/**`
- Generated files are stamped with `@generated` markers (or equivalent metadata).
- CLI supports:
    - `contractspec generate` (rebuild derived artifacts)
    - `contractspec validate` (ensures contract + generated outputs are consistent)

### Acceptance criteria
- Editing generated artifacts is either blocked or overwritten deterministically.
- CI fails if generated outputs don’t match the contract.
- Team can regenerate all derived artifacts from scratch and get identical results.

---

## Notion 2 — Audience Views (“Spec shapes”): “Same truth, different compression”

### Intent
Different stakeholders need different “lenses” on the same contract without creating extra sources of truth.

### PO verification
- PO can run a command that outputs a product-readable summary of changes.
- QA can run a command that outputs testable behaviors and constraints.
- Eng can run a command that outputs system/API-level details.

### Implementation requirements
Add a stable interface:
- `contractspec view --audience product`
- `contractspec view --audience eng`
- `contractspec view --audience qa`

Recommended output fields:
- **product view:** user flows, capabilities, constraints, acceptance criteria checklist
- **eng view:** endpoints/events, schemas, error modes, invariants, performance/security notes
- **qa view:** scenarios, input/output examples, negative cases, mapping to generated tests

### Acceptance criteria
- Views are generated from contracts only (no manual edits).
- Views are deterministic (same contract => same view output).
- Views are readable and can be pasted into tickets/PRs without rewriting.

---

## Notion 3 — The lifecycle: Extract → Modify → Gap → Apply → Clean

### Intent
Support real-world teams that start from existing code or OpenAPI, but end with contracts as the single source of truth. Scaffolding must be disposable.

### PO verification
- A legacy system can be “imported” into ContractSpec as a draft contract.
- The PO can see what will change before code is generated (gap analysis).
- The repo stays clean: scaffolding files don’t accumulate.

### Implementation requirements
Introduce the workflow as first-class CLI commands:

1. **Extract (draft contracts from reality)**
    - `contractspec extract` (from OpenAPI/repo)
    - Output: `.contractspec/work/<timestamp>/draft.contract.*`

2. **Modify (human decision point)**
    - PO/eng edit contract in canonical location: `contracts/**`

3. **Gap analysis (contract vs repo)**
    - `contractspec gap`
    - Output: a structured change plan (files/modules impacted, missing tests, breaking-change flags)

4. **Apply (generate code/tests/docs)**
    - `contractspec apply` (or `generate` + `patch`)
    - Output: code changes + test updates + regenerated outputs

5. **Clean (delete scaffolding)**
    - `contractspec clean` removes `.contractspec/work/**` safely

### Acceptance criteria
- Each step is runnable independently and produces predictable artifacts.
- `gap` highlights behavior deltas in plain English (PO-readable) + technical deltas (eng-readable).
- `clean` is safe (never deletes canonical `contracts/**`).

---

## Notion 4 — Drift prevention & reconciliation: “No silent divergence”

### Intent
If code changes but contracts don’t, the system must surface the mismatch quickly. Drift should be explicit and actionable, not a surprise weeks later.

### PO verification
- PR checks clearly state whether contract and generated outputs are consistent.
- If drift exists, the PR shows exactly what changed and what must be updated.

### Implementation requirements
- `contractspec diff`:
    - compares canonical contracts vs generated outputs (and optionally code-level facts)
    - outputs: change summary + severity (breaking/feature/patch)
- CI gate:
    - runs `validate` and fails if drift is detected
- Protected generated areas:
    - changes in `generated/**` are only allowed when produced by `generate/apply`

### Acceptance criteria
- Drift is detected in CI with a clear message.
- Developers can reproduce the failure locally with the same command.
- The system recommends next actions (“update contract” vs “regenerate outputs”).

---

## Notion 5 — PR/CI distribution wedge: “Make review impossible *without* ContractSpec”

### Intent
Adoption comes from making code review safer and faster. The product owner should see “what changed” without reading code.

### PO verification
- Every PR includes a comment that:
    - summarizes contract-level changes
    - flags breaking changes
    - links to audience views (product/qa)

### Implementation requirements
Ship a GitHub Action (Phase 1) that posts:
- **Contract diff summary** (human-readable)
- **Breaking-change status** (suggested semver bump)
- **Validation results** (pass/fail)
- Optional: links/artifacts for `view --audience …`

### Acceptance criteria
- PR comment appears on every PR that touches contracts or generated outputs.
- Breaking changes are clearly flagged.
- The comment content is stable enough to be used in release notes.

---

# Roadmap (phased implementation)

## Phase 0 — Baseline conventions (1–2 days)
- Define repo layout: `contracts/**`, `generated/**`, `.contractspec/work/**`
- Add `@generated` markers to outputs
- Decide deterministic generation rules (ordering, formatting, stable IDs)

## Phase 1 — CLI foundation (core user value)
- Implement: `generate`, `validate`, `view --audience`, `diff`
- Minimum viable `gap` (contract vs generated outputs, not full code semantics)

## Phase 2 — Workflow support (legacy + planning)
- Implement: `extract`, improved `gap`, `apply`, `clean`
- Improve change plan output for PO readability

## Phase 3 — CI/PR integration (distribution)
- GitHub Action:
    - runs validate/diff
    - posts PR comment
    - blocks merge on drift

## Phase 4 — Quality & scale
- Test fixtures and golden files for deterministic outputs
- Performance improvements on large repos
- Optional reconciliation tooling (controlled “sync back” for legacy code)

---

# Verification plan (how we prove it works)

## End-to-end scenarios (must pass)
1. **Greenfield**
    - Write a contract → generate code/OpenAPI/SDK/docs → validate passes
2. **Legacy import**
    - Extract from OpenAPI → edit contract → gap shows deltas → apply generates changes → clean removes scaffolding
3. **Drift detection**
    - Manually edit generated output → CI fails with actionable diff
4. **PR summary**
    - PR touching contracts produces a comment with breaking-change flag and links to product/qa views

## Metrics (signals we’re succeeding)
- % PRs with ContractSpec summary comment
- Drift incidents caught in CI (should spike early, then fall)
- Time-to-review for API changes (should drop)
- Rate of “surprise breaking changes” (should drop)

---

# Risks & mitigations

- **Risk: developers bypass contracts and edit code directly**
    - Mitigation: protect generated areas + CI drift checks + clear workflow
- **Risk: views become noisy or unreadable**
    - Mitigation: keep views concise, stable fields, and audience-specific templates
- **Risk: extraction produces low-quality drafts**
    - Mitigation: treat extract output as scaffolding, not canonical truth; require explicit promotion into `contracts/**`

---

# Definition of Done (project)

- Canonical contract + generated outputs + scaffolding are clearly separated.
- `view`, `diff`, `validate`, `generate` exist and are deterministic.
- CI blocks drift and PRs get a contract change summary.
- A PO can validate scope/breaking changes without reading code.