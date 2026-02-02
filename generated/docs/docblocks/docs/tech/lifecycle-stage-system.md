## ContractSpec Lifecycle Stage System – Technical Design

This document describes how ContractSpec implements lifecycle detection and guidance. It covers architecture, module boundaries, scoring heuristics, and integration points so libraries, modules, bundles, and Studio surfaces stay synchronized.

---

### 1. Architecture Overview

```
┌──────────────────────┐
│ @contractspec/lib.lifecycle  │  Types, enums, helpers (pure data)
└───────────┬──────────┘
            │
┌───────────▼──────────┐    ┌───────────────────────────┐
│ modules/lifecycle-   │    │ modules/lifecycle-advisor  │
│ core (detection)     │    │ (guidance & ceremonies)    │
└───────────┬──────────┘    └───────────┬───────────────┘
            │                           │
            ├────────────┬──────────────┤
            ▼            ▼              ▼
  Adapters: analytics, intent, questionnaires
            │
┌───────────▼──────────┐
│ bundles/lifecycle-   │  Managed service for Studio
│ managed              │  (REST handlers, AI agent)     │
└───────────┬──────────┘
            │
  ContractSpec Studio surfaces
  (web/mobile APIs, CLI, docs)
```

- **Libraries** provide shared vocabulary.
- **Modules** encapsulate logic, accepting adapters to avoid environment-specific code.
- **Bundles** compose modules, register agents/events, and expose APIs for Studio.
- **Apps** (web-landing, future Studio views) consume bundle APIs; they do not reimplement logic. For web-landing we now resolve `@contractspec/bundle.studio` and `@contractspec/lib.database-studio` directly from their `packages/.../src` folders via `tsconfig` path aliases so Prisma stays on the server build and Turbopack no longer pulls the prebundled `dist` artifacts into client chunks.

---

### 2. Core Library (`@contractspec/lib.lifecycle`)

- Stage enum (0–6) with metadata (`question`, `signals`, `traps`).
- Axes types (`ProductPhase`, `CompanyPhase`, `CapitalPhase`).
- `LifecycleSignal` (source, metric, value, timestamp).
- `LifecycleMetricSnapshot` (aggregated numbers).
- `LifecycleMilestone`, `LifecycleAction`, `LifecycleAssessment` interfaces.
- Utility helpers:
  - `formatStageSummary(stage, assessment)`
  - `rankStageCandidates(scores)`

The library exports **no runtime dependencies** so it can be imported from apps, modules, and bundles alike.

---

### 3. Lifecycle Core Module

**Location:** `packages/modules/lifecycle-core/`

#### Components
1. **StageSignalCollector**
   - Accepts adapter interfaces:
     - `AnalyticsAdapter` (pulls metrics from `@contractspec/lib.analytics` or fixture streams).
     - `IntentAdapter` (hooks into `@contractspec/lib.observability` intent detectors or logs).
     - `QuestionnaireAdapter` (loads JSON questionnaires and responses).
   - Produces normalized `LifecycleSignal[]`.

2. **StageScorer**
   - Weighted scoring model:
     - Base weight per stage (reflecting expected maturity).
     - Feature weights (retention, revenue, team size, qualitative feedback).
     - Confidence computed via variance of contributing signals.
   - Supports pluggable scoring matrices via JSON config.
   - Accepts sparse metric snapshots; the orchestrator sanitizes metrics to numeric-only records before persisting assessments so downstream analytics stay consistent.

3. **LifecycleOrchestrator**
   - Coordinates collectors + scorer.
   - Returns `LifecycleAssessment` with:
     - `stage`, `confidence`, `axisSnapshot`, `signalsUsed`.
     - Recommended focus areas (high-level categories only).
   - Emits events (internally) when stage confidence crosses thresholds (consumed later by bundle).

4. **LifecycleMilestonePlanner**
   - Loads `milestones-catalog.json` (no DB).
   - Filters upcoming milestones per stage + axis.
   - Tracks completion using provided IDs (caller persists).

#### Data Files
- `configs/stage-weights.json`
- `configs/milestones-catalog.json`
- `questionnaires/stage-readiness.json`

#### Extension Hooks
- All adapters exported as TypeScript interfaces.
- Implementations for analytics/intent can live in bundles or apps without modifying module code.

---

### 4. Lifecycle Advisor Module

**Location:** `packages/modules/lifecycle-advisor/`

#### Components
1. **LifecycleRecommendationEngine**
   - Consumes `LifecycleAssessment`.
   - Maps gaps to `LifecycleAction[]` using rule tables (`stage-playbooks.ts`).
   - Supports override hooks for customer-specific rules.

2. **ContractSpecLibraryRecommender**
   - Maintains mapping from stage → recommended libraries/modules/bundles.
   - Returns prioritized list with rationale and adoption prerequisites.

3. **LifecycleCeremonyDesigner**
   - Provides textual/structural data for ceremonies (title, copy, animation cues, soundtrack references).
   - Ensures low-tech friendly instructions (clear copy, undo guidance).

4. **AI Hooks**
   - Defines prompt templates and tool manifests for lifecycle advisor agents (consumed by bundles).
   - Keeps actual LLM integration outside module.

---

### 5. Managed Bundle (`lifecycle-managed`)

**Responsibilities**
- Wire modules together.
- Provide HTTP/GraphQL handlers (exact transport optional).
- Register LifecycleAdvisorAgent via `@contractspec/lib.ai-agent`.
- LifecycleAdvisorAgent meta: domain `operations`, owners `team-lifecycle`, stability `experimental`, tags `guide/lifecycle/ops` so ops tooling can route incidents quickly.
- Emit lifecycle events through `@contractspec/lib.bus` + `@contractspec/lib.analytics`.
- Integrate with `contractspec-studio` packages:
  - Use Studio contracts for authentication/tenant context (without accessing tenant DBs).
  - Store assessments in Studio-managed storage abstractions (in-memory or file-based for now).

**APIs**
- `POST /lifecycle/assessments`: Accepts metrics + optional questionnaire answers. Returns `LifecycleAssessment`.
- `GET /lifecycle/playbooks/:stage`: Returns stage playbook + ceremonies.
- `POST /lifecycle/advise`: Invokes LifecycleAdvisorAgent with context.

**Events**
- `LifecycleAssessmentCreated`
- `LifecycleStageChanged`
- `LifecycleGuidanceConsumed`

---

### 6. Library Enhancements

| Library | Enhancement |
| --- | --- |
| `@contractspec/lib.analytics` | Lifecycle metric collectors, helper to emit stage events, adapter implementation used by `StageSignalCollector`. |
| `@contractspec/lib.evolution` | Accepts `LifecycleContext` when ranking spec anomalies/suggestions. |
| `@contractspec/lib.growth` | Stage-specific experiment templates + guardrails referencing lifecycle enums. |
| `@contractspec/lib.observability` | Lifecycle KPI pipeline definitions (drift detection, regression alerts). |

Each enhancement must import stage types from `@contractspec/lib.lifecycle`.

---

### 7. Feature Flags & Progressive Delivery

- Add new flags in progressive-delivery library:
  - `LIFECYCLE_DETECTION_ALPHA`
  - `LIFECYCLE_ADVISOR_ALPHA`
  - `LIFECYCLE_MANAGED_SERVICE`
- Bundles/modules should check flags before enabling workflows.
- Flags referenced in docs + Studio UI to avoid accidental exposure.

---

### 8. Analytics & Telemetry

- Events defined in analytics library; consumed by bundle/app:
  - `lifecycle_assessment_run`
  - `lifecycle_stage_changed`
  - `lifecycle_guidance_consumed`
- Observability pipeline includes:
  - Composite lifecycle health metric (weighted sum of KPIs).
  - Drift detection comparing stage predictions over time.
  - Alert manager recipes for regression (e.g., PMF drop).

---

### 9. Testing Strategy

1. **Unit**
   - StageScorer weight matrix.
   - RecommendationEngine mapping.
   - Library recommender stage coverage.

2. **Contract**
   - Adapters: ensure mock adapters satisfy interfaces.
   - Bundles: ensure HTTP handlers respect request/response contracts even without persistence.

3. **Integration**
   - CLI example runs detection + guidance end-to-end on fixture data.
   - Dashboard example renders assessments, verifying JSON structures remain stable.

---

### 10. Implementation Checklist

- [ ] Documentation (product, tech, ops, user).
- [ ] Library creation (`@contractspec/lib.lifecycle`).
- [ ] Modules (`lifecycle-core`, `lifecycle-advisor`).
- [ ] Bundle (`lifecycle-managed`) + Studio wiring.
- [ ] Library enhancements (analytics/evolution/growth/observability).
- [ ] Examples (CLI + dashboard).
- [ ] Feature flags + telemetry.
- [ ] Automated tests + fixtures.

Keep this document in sync as modules evolve. When adding new stages or axes, update `@contractspec/lib.lifecycle` first, then cascade to adapters, then refresh docs + Studio copy.*** End Patch*** End Patch


