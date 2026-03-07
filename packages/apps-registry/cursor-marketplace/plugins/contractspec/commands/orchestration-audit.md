---
name: orchestration-audit
description: Audit agent orchestration for approvals, escalation, telemetry, and tool safety
---

Run a guardrail audit for ContractSpec agent orchestration.

1. Review agent definitions and runtime wiring:
   - `AgentSpec` tool declarations and schemas
   - `requiresApproval` / `automationSafe` settings
   - escalation policies and step limits
2. Verify runtime safety:
   - MCP tool name collisions are prevented
   - risky tools require approval workflow
3. Verify traceability:
   - telemetry captures trace/session/actor/tenant dimensions
   - failure paths are instrumented

Output format:

```md
## Orchestration Audit

Status: PASS | WARN | FAIL

### Findings

1. <issue> - <impact> - <fix>

### Guardrail coverage

- Tool approval: pass|warn|fail
- Escalation: pass|warn|fail
- MCP safety: pass|warn|fail
- Telemetry traceability: pass|warn|fail
```
