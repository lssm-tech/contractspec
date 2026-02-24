---
description: Analyze telemetry and generate spec improvement suggestions via evolution pipeline
targets: ['*']
---

args = $ARGUMENTS

Use the evolution pipeline to generate data-driven spec improvement proposals:

1. **Parse arguments**:
   - Extract `operation-key` from `args` to target a specific contract
   - Extract `--all` flag to run across all contracts
   - If neither provided, ask the user which contract(s) to evolve

2. **Gather telemetry data**:
   - If PostHog integration is available, query for:
     - Usage frequency per operation
     - Error rates and common failure patterns
     - Field-level usage (which fields are populated vs always null)
     - Latency distributions
   - If telemetry is unavailable, fall back to static analysis:
     - Analyze call sites and usage patterns via Serena
     - Detect unused fields and dead code paths

3. **Run SpecAnalyzer pipeline**:
   - Use `@contractspec/lib.evolution` to execute the analysis:
     - **AnomalyDetector**: identify unusual patterns (high error rates, unused fields, type mismatches)
     - **IntentPatternConverter**: convert detected anomalies into structured IntentPatterns
     - **AISpecGenerator**: generate concrete spec improvement proposals from IntentPatterns
   - Each proposal includes: change type, affected fields, rationale, risk assessment

4. **Present proposals**:
   - Display each proposal with:
     - Operation key and current version
     - Proposed change (add, remove, rename, retype, deprecate)
     - Rationale (data-driven or static analysis feedback)
     - Risk level and backward compatibility impact
   - Ask the user to approve, reject, or modify each proposal

5. **Submit approved proposals**:
   - Use `SpecSuggestionOrchestrator` to submit approved proposals
   - Each submission creates a tracked suggestion with:
     - Status: pending review
     - Source: evolution pipeline
     - Feedback: telemetry data or analysis references
   - Optionally open an issue via `/open-issue` for each approved proposal

6. **Report results**

## Example output

```
## Evolution Analysis: createUser

Telemetry source: PostHog (last 30 days)
Invocations: 12,450 | Error rate: 2.3% | P95 latency: 340ms

### Proposals (3)

1. DEPRECATE field `legacyId` (input)
   - Rationale: populated in 0.4% of calls, all from deprecated client v1
   - Risk: LOW - field is optional, no downstream consumers
   - Suggested version: 1.2.0 -> 1.3.0 (minor)

2. ADD field `phoneNumber` (input, optional)
   - Rationale: 68% of callers immediately call `updateUserPhone` after creation
   - Risk: LOW - additive, optional field
   - Suggested version: 1.3.0 (minor)

3. RETYPE field `role` from string to enum
   - Rationale: 99.7% of values are one of ["admin", "member", "viewer"]
   - Risk: MEDIUM - requires consumer updates for type narrowing
   - Suggested version: 2.0.0 (major)

Approve proposals? [1,2,3 / none / all]
```
