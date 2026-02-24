---
description: 'Analyze codebase health across architecture, contracts, quality, and observability'
targets: ['*']
---

scope = $ARGUMENTS

Run a codebase audit to identify drift and engineering risk:

1. **Determine analysis scope**:
   - If `scope` is provided, analyze only that path.
   - Otherwise analyze the full repository.

2. **Map architecture and boundaries**:
   - Identify changed or high-churn modules.
   - Check dependency direction against repository architecture rules.
   - Flag boundary leaks (UI importing infrastructure, adapters leaking into domain, etc.).

3. **Evaluate contract and API coherence**:
   - Look for contract/spec definitions and their implementations.
   - Flag uncovered behavior (implementation with no clear contract/spec) and orphaned specs.
   - Highlight obvious shape drift between types/schemas and runtime handlers.

4. **Assess quality and safety posture**:
   - Surface files likely violating size/splitting guidance.
   - Check type-safety hotspots (`any`, weak casts, suppressed checks).
   - Identify missing tests around critical paths and risky change areas.

5. **Assess observability posture**:
   - Confirm key runtime paths include structured logs/metrics/tracing hooks.
   - Flag silent failure paths and missing error instrumentation.

6. **Produce prioritized actions**:
   - Return top findings with severity (`HIGH`, `MEDIUM`, `LOW`).
   - Include file references and concrete remediation steps.
   - Recommend follow-up commands (`/impact`, `/audit-health`, `/audit-observability`, `/review-plan`).

## Output format

```md
## Codebase Analysis

Scope: <path|repo>
Overall risk: LOW | MEDIUM | HIGH

### Top Findings

1. [HIGH] <finding> - <file>
2. [MEDIUM] <finding> - <file>

### Architecture

- Boundary issues: <count>
- Dependency drift: <count>

### Contracts and API

- Uncovered implementations: <count>
- Orphaned specs: <count>
- Potential drift hotspots: <count>

### Quality and Safety

- Type safety hotspots: <count>
- Oversized files: <count>
- Test gaps: <count>

### Observability

- Missing instrumentation hotspots: <count>
- Silent failure risks: <count>

### Next actions

1. <action>
2. <action>
```
