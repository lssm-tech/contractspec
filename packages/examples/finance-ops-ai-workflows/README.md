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
2. Switch between the PME recovery and reporting reset scenarios from the demo command bar.
3. Run a workflow draft, select the mission item, invoice, procedure step, reporting variance, or adoption log under discussion, and use the selected-detail panel to request changes or mark the draft ready.
4. Move through Mission intake, Cash aging, Procedure, Reporting, and Adoption ROI as an operator cockpit rather than a slide sequence.
5. Reset the replay when the presenter wants to restart the story from the same synthetic fixture.

## Interactive Preview

The inline template preview is intentionally demo-grade:

- Command bar with scenario switching, deterministic replay reset, draft-run controls and current workflow state.
- Workflow rail for Mission intake, Cash aging, Procedure, Reporting, and Adoption ROI.
- Compact lists and tables instead of oversized card grids.
- Selected-detail panel for every workflow click: mission evidence, invoice follow-up, procedure control, reporting variance, or adoption recommendation.
- Draft-only review actions to request changes or mark the selected workflow ready.

The preview recomputes from the handlers, so it demonstrates the same deterministic contract outputs that tests and replay proof cover. The interactivity is local UI state only: it simulates review and replay, not real operational execution.

## Scope Boundaries

The package uses synthetic fixtures and deterministic handlers only. It does not connect to live finance systems, does not send operational communications, and does not provide production financial, legal, tax, accounting, or investment advice. Workflow outputs keep `humanReviewRequired` set to `true`.

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
