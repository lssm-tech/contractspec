# @lssm/lib.ai-agent

Stateful AI agent orchestration for ContractSpec apps. The library wraps LLM providers, tool execution, knowledge bindings, and per-tenant guardrails so that agents can triage tickets, run growth experiments, or automate DevOps tasks with the same primitives used by workflows.

## Features

- Type-safe `AgentSpec` + registry for declarative agent definitions
- `AgentRunner` with tool calling, iteration caps, and confidence-aware escalation
- Memory framework that mixes working memory with long-term persistence hooks
- Tool registry/executor with structured input validation and telemetry hooks
- Approval workflow helpers for human-in-the-loop gates (see `/approval`)

## Quickstart

```ts
import { AgentRegistry, AgentRunner, defineAgent } from '@lssm/lib.ai-agent';
import { ToolExecutor } from '@lssm/lib.ai-agent/tools';
import { InMemoryAgentMemory } from '@lssm/lib.ai-agent/memory';

const SupportAgent = defineAgent({
  meta: { name: 'support.bot', version: 1, owners: ['team-support'], domain: 'operations' },
  instructions: 'Resolve support tickets. Escalate whenever confidence < 0.75.',
  tools: [{ name: 'search_knowledge', description: 'Query support corpus', schema: { type: 'object', properties: { question: { type: 'string' } }, required: ['question'] } }],
  policy: { confidence: { min: 0.75 }, escalation: { auto: true } },
});

const registry = new AgentRegistry().register(SupportAgent);
const runner = new AgentRunner({
  registry,
  llm: mistralProvider,
  toolExecutor: new ToolExecutor({ tools: [searchKnowledgeTool] }),
  memoryManager: new InMemoryAgentMemory(),
});

const result = await runner.run({ agent: 'support.bot', input: 'My payout failed.', tenantId: 'acme' });
if (result.requiresEscalation) notifyHuman(result);
```

See `examples/ai-support-bot` for a full workflow including ticket ingestion and approval queues.
