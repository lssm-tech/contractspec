# @contractspec/lib.ai-agent

[![npm version](https://img.shields.io/npm/v/@contractspec/lib.ai-agent)](https://www.npmjs.com/package/@contractspec/lib.ai-agent)
[![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.ai-agent)](https://www.npmjs.com/package/@contractspec/lib.ai-agent)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lssm-tech/contractspec)

Website: https://contractspec.io/

**AI governance for ContractSpec** — Constrain what AI agents can change, enforce contracts they must respect.

Stateful AI agent orchestration with type-safe specs, tool execution, knowledge bindings, and per-tenant guardrails. Agents read contracts as their source of truth, enabling triage, growth experiments, and DevOps automation with contract-enforced safety.

## Features

- Type-safe `AgentSpec` + registry for declarative agent definitions
- `AgentRunner` with tool calling, iteration caps, and confidence-aware escalation
- Memory framework that mixes working memory with long-term persistence hooks
- Tool registry/executor with structured input validation and telemetry hooks
- Approval workflow helpers for human-in-the-loop gates (see `/approval`)
- MCP client support for `stdio`, `sse`, and `http` transports

## Quickstart

```ts
import { AgentRegistry, AgentRunner, defineAgent } from '@contractspec/lib.ai-agent';
import { ToolExecutor } from '@contractspec/lib.ai-agent/tools';
import { InMemoryAgentMemory } from '@contractspec/lib.ai-agent/memory';

const SupportAgent = defineAgent({
  meta: { name: 'support.bot', version: '1.0.0', owners: ['team-support'], domain: 'operations' },
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

## MCP Client Tooling

```ts
import { createAgentFactory } from '@contractspec/lib.ai-agent/agent/agent-factory';

const factory = createAgentFactory({
  defaultModel,
  registry,
  toolHandlers,
  mcpServers: [
    {
      name: 'filesystem',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', '/workspace'],
      toolPrefix: 'fs',
    },
    {
      name: 'posthog',
      transport: 'http',
      url: process.env.POSTHOG_MCP_URL!,
      accessTokenEnvVar: 'POSTHOG_MCP_TOKEN',
      toolPrefix: 'ph',
    },
  ],
});

const agent = await factory.create('support.bot');
const result = await agent.generate({ prompt: 'Summarize today\'s incidents.' });

await agent.cleanup();
```
