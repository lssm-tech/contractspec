# @lssm/lib.growth

Experiment orchestration primitives used by Phase 2 growth agents. It provides:

- Typed experiment definitions (variants, metrics, guardrails).
- Deterministic bucketing + assignment (`ExperimentRunner`).
- Streaming tracker for exposures and conversions (`ExperimentTracker`).
- Stats engine for chi-square / t-test significance (`StatsEngine`).
- Lightweight reporting helpers for insights dashboards.

The goal: evaluate ideas without standing up a full experimentation platform.
