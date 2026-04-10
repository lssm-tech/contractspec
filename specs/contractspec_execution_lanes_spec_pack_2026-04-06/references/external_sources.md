# External Sources Grounding Summary

This spec pack was grounded against live public sources on 2026-04-06.

## Rippletide sources reviewed

- Rippletide homepage: decision context graph, deterministic validation, and full traceability before execution
- Enterprise / agent decision infrastructure page: validates, authorizes, and traces autonomous decisions before execution
- Coding Agents overview: persistent structured memory, rule-guided coding, hook integration, planning reviewed against rules
- Connect: repository scan, rule generation/selection, hook installation, read-only mode
- Coding Session: prompt-time rule injection, pre-write blocking, auto-rewrite loop, override flow
- Rule Management: natural-language add/edit/delete with confirmation
- Rule Sharing: invite/receive conflict-aware sharing
- Team Governance: read-only shared team graph and centralized policy / distributed agents
- Planning: `/plan` and `/review-plan` iterative plan review loop

## oh-my-codex sources reviewed

- Repository README and AGENTS guidance: recommended flow of clarify -> consensus planning -> team or Ralph
- `skills/ralplan/SKILL.md`: Planner + Architect + Critic consensus planning
- `skills/ralph/SKILL.md`: persistent completion loop with architect verification and session persistence
- `skills/team/SKILL.md`: tmux-backed durable team runtime, mailbox/dispatch, explicit lifecycle, standalone team launch, later separate Ralph only if needed
- `src/agents/definitions.ts`: typed role metadata fields
- `prompts/planner.md` and `prompts/architect.md`: role purity and evidence-backed architecture review

## ContractSpec sources reviewed

- Root README
- `@contractspec/lib.contracts-spec` README
- `@contractspec/lib.ai-agent` README
- `@contractspec/lib.harness` README
- `agentpacks.jsonc`
- `implementation_plan_workflow_loop_robustification.md`

## Interpretation rule used for this pack

Rippletide was treated as the authority/governance substrate.
OMX was treated as the orchestration/runtime inspiration.
ContractSpec was treated as the target implementation environment.
