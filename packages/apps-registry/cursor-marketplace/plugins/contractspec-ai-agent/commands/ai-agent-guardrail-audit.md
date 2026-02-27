---
name: ai-agent-guardrail-audit
description: Audit @contractspec/lib.ai-agent for spec, approval, escalation, and telemetry guardrails
---

Run an orchestration governance audit:

1. Verify `AgentSpec` declarations and tool schemas are explicit.
2. Verify risky tools require approval and escalation paths exist.
3. Verify telemetry covers trace context and failure paths.
4. Summarize guardrail gaps and required mitigations.
