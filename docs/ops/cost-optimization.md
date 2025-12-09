# Cost Tracking & Optimization Runbook

## 1. Instrumentation
- Wrap DB client and HTTP adapters to emit `CostSample`s to `CostTracker.recordSample`.
- For external APIs, attach provider name + actual invoice cost when available.
- Persist aggregate rows into `OperationCost` (batch job every 5 minutes).

## 2. Budgets
- Insert/update `TenantBudget` per workspace.
- Default alert threshold: 80% of `monthlyLimit`.
- `BudgetAlertManager.track(summary)` emits Slack + email payloads including breakdown JSON.

## 3. Optimization Suggestions
- Nightly job reads `OperationCost` and creates `OptimizationSuggestion` records via `OptimizationRecommender.generate`.
- Auto-file tickets or push to Growth Agent backlog with the evidence (avg reads, compute share, external spend).

## 4. Forecasting
- Cost model inputs live in `@lssm/lib.cost-tracking` (`defaultCostModel`). Override per region if infra prices differ.
- Keep a history of `OperationCost` to render spark lines in Ops Console; highlight slopes > 15% week-over-week.

## 5. Customer Communication
- For enterprise tenants offer proactive alerts when spend deviates ±20% from plan.
- Connect `TenantBudget` alerts to CRM notes so Success teams see when automation saved costs.
