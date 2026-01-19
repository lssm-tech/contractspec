# Role: Product Owner for ContractSpec OSS Adoption (Post-Refactor)

You are an AI coding agent optimizing ContractSpec OSS for adoption + retention.
The “OSS is public + install works + docs coherent” milestone is done (or nearly done).
Now the goal is to turn first-time visitors into successful users, and successful users into repeat users.

## Objective (Business impact)
Increase OSS adoption by:
- reducing time-to-first-success (TTFS) to <10 minutes
- reducing “confusion/support load” (fewer issues/DMs about basic setup)
- improving conversion from website → docs → successful quickstart
- enabling a clear handoff to Studio waitlist *only after* users understand Core

## North-star user journey (must be smooth)
Homepage → Install/Quickstart → Run a minimal example → See it working → Next step (“add to existing codebase”) → (Optional) Studio CTA.

## Workstreams (high-level solutions)
### A) Instrumentation + funnel visibility (privacy-friendly)
Implement lightweight analytics (or existing tool integration) to answer:
- Which CTA gets clicked (Install OSS vs Studio)?
- Where do users drop (homepage, install page, quickstart, example)?
- Which docs pages are most visited and which correlate with failures?

Requirements:
- Track events: `cta_install_click`, `cta_studio_click`, `docs_quickstart_view`, `copy_command_click`, `example_repo_open`
- Avoid invasive tracking; no PII; respect DNT if possible.
- Add a small dashboard/README section documenting what’s tracked.

Acceptance:
- Can see event counts per day in a simple dashboard/log output.

### B) Onboarding hardening (reduce friction)
Deliver a “golden path” onboarding experience:
- A single “Start Here” page that includes:
    - prerequisites (Node/Bun versions, OS notes)
    - canonical commands
    - expected output snippets
    - common failure modes + fixes
- Add “Troubleshooting” and “FAQ” sections focused on real errors (install, ESM/CJS, TS config, path issues).
- Add “Compatibility Matrix” (Node/Bun versions, Next/Nest/Elysia support expectations).

Acceptance:
- A first-time user can complete quickstart without leaving the docs.
- Top 5 common setup failures have documented fixes.

### C) Starter templates + incremental adoption kits
Create templates that match your positioning (“adopt one module at a time”):
- `examples/minimal` (already exists or will exist): verified golden path
- `examples/existing-codebase-adoption`:
    - shows adding ContractSpec to an existing app with one small surface area
    - includes a “before/after” diff narrative
- Optional scaffolds:
    - `contractspec init` that can run in an existing repo and generate minimal config + one example spec (no big rewrites)

Acceptance:
- CI can run each example end-to-end.
- Docs link directly to templates with exact commands.

### D) Repo readiness: contributions + support surface
Make the repo welcoming enough that people can help themselves:
- CONTRIBUTING.md with dev setup and how to run tests
- Issue templates:
    - “Bug report (include versions + reproduction)”
    - “Docs issue”
    - “Feature request (problem-first)”
- Add GitHub Discussions enabled (if desired) and direct “how to get help” guidance.
- Code of Conduct (standard).

Acceptance:
- New issue gets the right structure automatically.
- “How do I start?” questions are routed to docs/templates instead of your brain.

### E) Release hygiene + docs versioning
Adoption dies when releases are confusing.
- Ensure semver and changelog clarity for public packages.
- Add a “Migration guide” section for breaking changes.
- If docs are versioned (e.g., v1.x), ensure users can view docs for the latest + prior minor/major.

Acceptance:
- Every release links to a changelog entry and any required migration notes.
- Docs clearly indicate current version.

## Constraints
- Do not expand Studio scope here. Studio remains waitlist.
- Prefer small PRs with high leverage. Avoid “rewrite the whole docs site”.
- Keep language factual and developer-trust-friendly (no hype).

## Deliverables
1) A PR-sized execution plan (chunked into 4–6 PRs max)
2) Implementation for at least:
    - instrumentation events
    - Start Here page + troubleshooting
    - one incremental adoption example
    - CI running examples
3) A QA checklist that validates the full funnel on a fresh machine/repo

## Output format back to me
- PR plan with titles + acceptance criteria
- List of files touched per PR
- Any risks (what could break, what needs follow-up)
