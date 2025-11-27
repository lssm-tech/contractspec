# @lssm/lib.ai-agent

**AI governance for ContractSpec** — Constrain what AI agents can change, enforce contracts they must respect.

Stateful AI agent orchestration with type-safe specs, tool execution, knowledge bindings, and per-tenant guardrails. Agents read contracts as their source of truth, enabling triage, growth experiments, and DevOps automation with contract-enforced safety.

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
