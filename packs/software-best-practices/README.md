# software-best-practices

This pack contains reusable software engineering standards that should apply across projects.

## Scope

- Rules for code quality, type safety, accessibility, security, performance, observability, and delivery efficiency.
- Rules for code quality, type safety, accessibility, security, performance, observability, delivery efficiency, and Cursor marketplace readiness.
- Commands and agents for the full delivery lifecycle: ideation support, impact analysis, plan review, build/lint/test/fix/refactor, shipping, QA/review, observability, and docs sync.
- Shared MCP tooling for semantic code assistance and external documentation lookup.
- Ignore policy inherited from the legacy default pack.
- Cursor plugin and Cursor marketplace readiness workflows via dedicated commands.
- AI-native model routing via `models.json` profiles for planning, review, security, and documentation workflows.

## Belongs here

- Cross-project standards that are not specific to ContractSpec product governance.
- Automation and review guardrails for day-to-day software delivery.

## Lifecycle Commands

- Ideation and planning support: `/analyze-codebase`, `/impact`, `/review-plan`
- Shipping and release prep: `/ship`, `/draft-pr`
- QA and quality checks: `/lint`, `/test`, `/review-pr`
- Runtime health and observability: `/audit-health`, `/audit-observability`
- Documentation sync: `/document`
- Cursor plugin readiness: `/cursor-plugin`

## Does not belong here

- ContractSpec mission, architecture, or workspace-specific product context.
- Specification-governance rules or ContractSpec-only planning/audit process guidance.
