# Workflow-agent integration

## Orchestrator-worker

Main agent + subagent tools = orchestrator-worker. The model decides when to call subagent tools; no spec change needed.

## Workflow steps as agent ops

Workflow steps use `StepAction.operation` (OpRef). An operation can be agent-backed: define `agent.run` that invokes `ContractSpecAgent`; `WorkflowRunner` executes it as a step via `opExecutor`.

## Evaluator-optimizer

Implement an evaluator tool that returns structured feedback. The orchestrator can retry or adjust based on the feedback. See [AI SDK Workflows](https://ai-sdk.dev/docs/agents/workflows#evaluator-optimizer).

## References

- [AI SDK Workflows](https://ai-sdk.dev/docs/agents/workflows)
