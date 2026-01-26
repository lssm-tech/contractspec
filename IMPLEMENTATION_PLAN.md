CONTEXT (problem to solve)
- Today our GitHub automations are fragmented: some logic lives in published actions (action-validation, action-version) but other key workflows (contract-pr, contract-drift) are hardcoded inside this repo.
- The result: too many entrypoints, low readability, low adoption, and poor reuse across other repos/projects.
- Product goal: “2 commands to rule them all.” Users should be able to copy-paste minimal YAML and get value immediately.

PRODUCT OUTCOME (what success looks like)
1) A user integrating ContractSpec into any repo should only need ONE small workflow file for PRs and ONE for drift (optional).
2) Documentation shows copy-paste snippets with < 20 lines each.
3) Outputs are human-friendly: a clear report in GitHub Job Summary, and optionally a PR comment.
4) Everything is reusable across repos: no bespoke YAML logic hidden in this repo.

SCOPE: Build 2 reusable workflows (primary deliverable)
A) contracts PR workflow: “view + validation + drift (optional)”
B) drift workflow: “detect drift on main/nightly + report + optional issue/PR”

Keep current behavior parity as much as possible, but simplify the interface.

--------------------------------------------
STEP 1 — Audit & map current behaviors
- Read these existing implementations and write a short map:
    - packages/apps/action-validation
    - packages/apps/action-version
    - .github/workflows/contract-pr.yml
    - .github/workflows/contract-drift.yml
- Produce an inventory:
    - triggers (on: pull_request, push, schedule)
    - steps executed (commands, scripts)
    - outputs generated (artifacts, summaries, comments)
    - failure conditions
    - permissions required (pull-requests: write, contents: read, etc.)
      Deliverable: a concise “current → future mapping” in markdown.

STEP 2 — Define the new public surface (inputs/outputs)
Create 2 reusable workflows under:
- .github/workflows/contractspec-pr.yml
- .github/workflows/contractspec-drift.yml

Define a minimal, product-friendly input API (with defaults):
PR workflow inputs:
- package_manager (bun|npm|pnpm|yarn) default: bun
- working_directory default: .
- report_mode (summary|comment|both|off) default: summary
- enable_drift (true|false) default: true
- fail_on (breaking|drift|any|never) default: any
- generate_command (string) required only if enable_drift=true
- validate_command (string) optional override
- contracts_dir or contracts_glob (optional)
- token default: ${{ github.token }}

Drift workflow inputs:
- package_manager default: bun
- working_directory default: .
- generate_command (string) REQUIRED
- on_drift (fail|issue|pr) default: fail
- drift_paths_allowlist (optional)
- token default: ${{ github.token }}

Outputs (both workflows):
- Always write a markdown report to $GITHUB_STEP_SUMMARY.
- If report_mode includes comment (PR workflow), post the same report as a PR comment (only if permissions allow).
- Provide machine-readable outputs as workflow outputs if feasible (e.g., drift_detected, breaking_change_detected).

Deliverable: workflow definitions + a short README section listing inputs and defaults.

STEP 3 — Refactor existing repo workflows to consumers of reusable workflows
- Replace .github/workflows/contract-pr.yml and contract-drift.yml logic with thin wrappers that call the new reusable workflows via `jobs.<id>.uses`.
- Keep the same triggers as before.
- Ensure minimal permissions and safe behavior on forks (do not attempt PR comments if not allowed).

Deliverable: old workflows become ~10–20 line wrappers.

STEP 4 — Consolidate or deprecate existing actions
Decision rule:
- If action-validation and action-version are still useful as low-level building blocks, keep them but mark them “internal” and stop marketing them as primary integration.
- If they duplicate logic now inside reusable workflows, reduce them to helpers or deprecate.

Deliverable:
- Either keep as internal helpers (documented minimally), or create a deprecation note.

STEP 5 — Report UX (critical for adoption)
Implement a stable report template used in both workflows:
Sections:
1) What changed (contracts/spec diff summary)
2) Risk classification (breaking / non-breaking / docs-only)
3) Validation results (pass/fail + key errors)
4) Drift results (pass/fail + where diff is)
5) Next steps (regen / bump / migration notes)

- Ensure the summary is readable in GitHub UI with links to files when possible.
- Keep under ~200 lines of markdown.

Deliverable: a single shared report generator (script) invoked by both workflows.

STEP 6 — Documentation for copy-paste adoption
Update README (or docs site) with:
- “Quickstart: PR checks” snippet (<20 lines)
- “Quickstart: Drift check” snippet (<20 lines)
- Explanation of inputs in a compact table
- Example screenshots (optional) or sample output markdown

Deliverable: docs that a random repo owner can adopt in <5 minutes.

STEP 7 — Acceptance tests (definition of done)
- Open a test PR that changes contracts and verify:
    - summary appears
    - validation fails when expected
    - drift fails when expected
    - optional PR comment works when permissions allow
- Push to main or simulate schedule to verify drift workflow.
- Ensure workflows succeed on a clean repo state and fail with actionable errors on misconfig.

Deliverable: checklist + evidence in PR description.

NON-GOALS (do not do)
- Do not create more than 2 public workflows.
- Do not add new “actions” unless necessary for a shared helper.
- Do not over-engineer configuration. Defaults should work for this repo and most users.
