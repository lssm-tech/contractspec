# ContractSpec Roadmap

This roadmap reflects current priorities and is updated as the community ships new capabilities. We welcome feedback through issues and RFCs.

## Recently shipped

- **Cursor marketplace catalog** — Core libraries and plugin listed in Cursor marketplace.
- **AI provider ranking** — Ranking-driven model selection with provider-ranking MCP.
- **Contract management via CLI and MCP** — First-class contract lifecycle tooling.
- **Integration transport, auth, versioning, BYOK** — Unified support across integrations.
- **Composio integration** — Universal fallback and provider-ranking types.
- **Control plane contract baseline** — Intent, plan, execution, approval, and skill contracts.
- **Health integration contracts** — Provider routing and health provider strategy.
- **Docs automation** — Contracts-spec inventory and docs-index regeneration.
- **Public site + OSS docs repositioning** — Web landing and docs now present ContractSpec as the open spec system for AI-native software, with Studio as the additive operating layer.
- **Docs IA + shell rewrite** — Manifest-driven OSS-first docs navigation, metadata wiring, reference entrypoints, and new overview pages across the main docs sections.
- **CI and type-safety hardening** — Lint, build, and type fixes across packages.

## Now (0-3 months)

- Deepen docs leaf coverage (integrations, comparisons, intent pages, and operator playbooks).
- Add search, traversal, and reference UX polish on top of the new docs manifest.
- Complete control plane runtime (deterministic planner, policy gates, approval flows).
- Harden CI gating and deterministic diff workflows.
- Add trust signals (security policy, dependency provenance).
- Central context + ACP baseline (context snapshots, agent runs, ACP server/client).

## Next (3-6 months)

- Remote registry support for plugins and specs.
- Studio-managed policy workflows and audit trails.
- Integration marketplace and verified plugin catalog.
- Spec migration tooling for legacy APIs.
- Signed skill ecosystem and compatibility checks.

## Later (6-12 months)

- Multi-tenant registry orchestration.
- Advanced policy simulation and drift analytics.
- Compliance reporting exports.

## How to contribute

- Check issues labeled `good first issue`, `help wanted`, `integration`, or `docs`.
- Propose larger changes through the RFC process.
- Share implementation notes in pull requests so others can iterate.
