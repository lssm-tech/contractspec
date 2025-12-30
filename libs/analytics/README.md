# @contractspec/lib.analytics

Website: https://contractspec.io/


Zero-dependency analytics toolkit used by Phase 2 AI-Native Ops. It ingests telemetry events and outputs:

- Funnel conversion reports with drop-off detection.
- Cohort retention curves and LTV summaries.
- Churn predictors that flag risky accounts.
- Growth hypothesis generator that suggests experiments.

All utilities operate on plain JSON events so they can run in jobs, background workers, or MCP agents without a warehouse.
