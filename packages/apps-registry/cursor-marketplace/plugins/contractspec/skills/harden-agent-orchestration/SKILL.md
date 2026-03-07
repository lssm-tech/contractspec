---
name: harden-agent-orchestration
description: Harden agent orchestration with approval gates, escalation policy, MCP safety, and trace telemetry
---

# Harden Agent Orchestration

Use this skill when defining or reviewing AI agent execution behavior.

## Process

1. Start from typed agent specs
   - Define tools, schemas, and execution limits (`maxSteps`).
2. Set tool safety controls
   - Mark risky tools as approval-required.
   - Keep non-risky automation explicit.
3. Configure escalation policy
   - Handle low confidence, timeout, and tool failures.
4. Prevent tool namespace collisions
   - Use MCP tool prefixes and verify no collisions with local tools.
5. Ensure traceability
   - Capture trace/session/actor/tenant metadata in telemetry.
   - Include failure-path telemetry and error context.

## Definition of done

- Approval and escalation rules are explicit.
- Tool execution remains bounded and auditable.
- MCP integration is collision-safe.
- Telemetry is sufficient for post-incident replay.
