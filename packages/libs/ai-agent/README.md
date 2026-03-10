# @contractspec/lib.ai-agent

[![npm version](https://img.shields.io/npm/v/@contractspec/lib.ai-agent)](https://www.npmjs.com/package/@contractspec/lib.ai-agent)
[![npm downloads](https://img.shields.io/npm/dt/@contractspec/lib.ai-agent)](https://www.npmjs.com/package/@contractspec/lib.ai-agent)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/lssm-tech/contractspec)

Website: https://contractspec.io/

**AI governance for ContractSpec** — Constrain what AI agents can change, enforce contracts they must respect.

Stateful AI agent orchestration with type-safe specs, tool execution, knowledge bindings, and per-tenant guardrails. Agents read contracts as their source of truth, enabling triage, growth experiments, and DevOps automation with contract-enforced safety.

## Features

- Type-safe `AgentSpec` + registry for declarative agent definitions
- Tool loop orchestration with runtime `maxSteps` overrides and confidence-aware escalation hooks
- Memory framework that mixes working memory with long-term persistence hooks
- Tool registry/executor with structured input validation, timeout, and cooldown controls
- Approval workflow helpers for human-in-the-loop gates (see `/approval`)
- MCP client support for `stdio`, `sse`, and `http` transports
- Adapter-first runtime interop surfaces for LangGraph, LangChain, and workflow-devkit style integrations

## Runtime adapter surfaces

`AgentSpec.runtime` and `interop/runtime-adapters` expose optional ports for:

- checkpoint storage
- suspend/resume orchestration
- retry classification
- approval gateways

These ports are optional by design and keep external runtime dependencies decoupled from core agent contracts.

## Operations as Tools

**Preferred pattern:** One contract → multiple surfaces. Reference a ContractSpec operation in your agent; the tool handler and input schema are derived automatically.

```ts
import { defineAgent } from '@contractspec/lib.ai-agent';
import { defineQuery } from '@contractspec/lib.contracts-spec';
import { OperationSpecRegistry } from '@contractspec/lib.contracts-spec';
import { createAgentFactory } from '@contractspec/lib.ai-agent/agent/agent-factory';

// 1. Define operation (existing pattern)
const SearchKnowledgeQuery = defineQuery({
  meta: { key: 'knowledge.search', version: '1.0.0', owners: ['@platform'], goal: '...', context: '...' },
  io: { input: SearchInputModel, output: SearchOutputModel },
});

// 2. Register and bind handler
const ops = new OperationSpecRegistry().register(SearchKnowledgeQuery).bind(SearchKnowledgeQuery, handler);

// 3. Reference in agent
const agent = defineAgent({
  meta: { key: 'support.bot', version: '1.0.0', owners: ['@platform'] },
  instructions: 'Resolve support tickets.',
  tools: [
    { name: 'search_knowledge', operationRef: { key: 'knowledge.search', version: '1.0.0' }, automationSafe: true },
  ],
});

// 4. Create factory with operationRegistry
const factory = createAgentFactory({
  defaultModel,
  registry: agentRegistry,
  toolHandlers: new Map(),
  operationRegistry: ops,
});
```

**Output rendering:** When tool output should render via PresentationSpec, FormSpec, or DataViewSpec, add `outputPresentation`, `outputForm`, or `outputDataView` to `AgentToolConfig` (at most one per tool). The tool adapter wraps raw output as `{ presentationKey, data }`, `{ formKey, defaultValues }`, or `{ dataViewKey, items }` for `ToolResultRenderer`. OperationSpec can also declare these refs; when the tool has no output refs, the operation's refs are used as fallback.

**Fallback (inline tools):** When the tool is not an operation (LLM subcalls, external APIs), use inline `AgentToolConfig` with `schema` and a manual handler in `toolHandlers`.

## Bundle spec / surface-runtime integration

When building planner agents for `@contractspec/lib.surface-runtime`, planner tools (e.g. `propose-patch`) from `@contractspec/lib.surface-runtime/runtime/planner-tools` map to `AgentToolConfig`. Wire `proposePatchToolConfig` into `AgentSpec.tools`; the handler should validate via `validatePatchProposal` and return `SurfacePatchProposal`. Tools from surface-runtime planner-tools are `AgentToolConfig`-compatible.

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
