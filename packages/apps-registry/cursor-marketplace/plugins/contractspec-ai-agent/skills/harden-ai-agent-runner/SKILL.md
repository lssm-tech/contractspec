---
name: harden-ai-agent-runner
description: Harden @contractspec/lib.ai-agent runtime with approval, escalation, MCP safety, and telemetry
---

# Harden AI Agent Runner

Use this skill when implementing or reviewing agent runtime behavior.

## Process

1. Define typed agents and explicit execution limits.
2. Gate risky tools with approval requirements.
3. Add escalation paths for uncertainty and execution failures.
4. Enforce MCP prefixing and collision checks.
5. Ensure telemetry captures run context and failures.

## Definition of done

- Agent execution is bounded and reversible.
- Approval/escalation behavior is explicit.
- MCP integration remains collision-safe.
- Telemetry supports audit and replay.
