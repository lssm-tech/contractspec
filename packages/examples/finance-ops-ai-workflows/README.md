# @contractspec/example.finance-ops-ai-workflows

Finance Ops AI Workflows is a public ContractSpec template for safe, deterministic, human-reviewed AI-assisted finance operations workflows.

It is designed as a credible business demo for NDconsulting / Desliance style work: DAF transition, cash management, reporting, procedures, finance process improvement, training, and AI adoption ROI.

## Product Positioning

This is not a chatbot, prompt collection, SaaS app, or live integration. It demonstrates how to turn finance-ops work into explicit workflows:

business input -> ContractSpec operation -> deterministic handler -> simulated AI-assisted workflow -> human review -> reviewable output -> ROI/adoption log.

The value is not "make an LLM talk". The value is to frame finance work, separate deterministic rules from assisted drafting, block autonomous decisions, and leave evidence that can be tested and industrialized.

## Included Workflows

- `financeOps.missionIntake.triage`: fictive DAF / finance transformation mission intake.
- `financeOps.cashAging.prioritize`: fixed-date aged receivables prioritization using deterministic rules.
- `financeOps.procedureDraft.create`: internal finance procedure draft with roles, steps, controls and KPIs.
- `financeOps.reportingNarrative.compose`: management reporting narrative with variance helpers and no invented causes.
- `financeOps.aiAdoption.logUsage`: AI adoption ROI log that tracks use cases, not intrusive employee surveillance.

## Demo Script

1. Open `/templates` and preview `Finance Ops AI Workflows`.
2. Import the fixtures from `@contractspec/example.finance-ops-ai-workflows/fixtures`.
3. Run mission intake to frame the DAF / finance recovery situation.
4. Run cash aging, procedure draft, and reporting narrative to show operational workflows.
5. Run AI adoption ROI logging to show measurable safe adoption and governance next steps.

## Safety Boundaries

- No LLM calls.
- No external API calls.
- No autonomous email sending.
- No real personal or client data.
- No production financial, legal, tax, or accounting advice.
- `humanReviewRequired` is always `true` for workflow outputs.
- Cash aging uses fixed reference date `2026-04-28`.
- Invalid JSON inputs return safe review outputs instead of triggering uncontrolled behavior.

## Public Entry Points

- `@contractspec/example.finance-ops-ai-workflows`
- `@contractspec/example.finance-ops-ai-workflows/contracts`
- `@contractspec/example.finance-ops-ai-workflows/contracts/mission-intake-triage.operation`
- `@contractspec/example.finance-ops-ai-workflows/contracts/cash-aging-prioritization.operation`
- `@contractspec/example.finance-ops-ai-workflows/contracts/procedure-draft.operation`
- `@contractspec/example.finance-ops-ai-workflows/contracts/reporting-narrative.operation`
- `@contractspec/example.finance-ops-ai-workflows/contracts/adoption-roi-log.operation`
- `@contractspec/example.finance-ops-ai-workflows/fixtures`
- `@contractspec/example.finance-ops-ai-workflows/handlers`
- `@contractspec/example.finance-ops-ai-workflows/proof`
- `@contractspec/example.finance-ops-ai-workflows/ui`

## Implementation Notes

- Handlers are pure deterministic functions wrapped with `HandlerForOperationSpec`.
- Structured lists are returned as JSON strings where the contract surface asks for `*Json` fields.
- Fixtures are fictive and tuned for a commercial demo: PME industrielle, 85 employees, 14 M EUR revenue, RAF departure, missing reporting, cash tension and fragmented Excel/Power BI tools.
- The replay proof runs all five workflows and returns a compact evidence object.

## Commands

- `bun run build`
- `bun run typecheck`
- `bun run test`
- `bun run smoke`
- `bun run preflight`
