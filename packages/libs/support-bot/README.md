# @lssm/lib.support-bot

Website: https://contractspec.io/


Production-ready building blocks for AI-first support desks powered by ContractSpec. The library wires knowledge-grounded responses, ticket classification, auto-resolutions, and performance telemetry into `@lssm/lib.ai-agent`.

## Highlights

- **TicketClassifier** – fast heuristics + optional LLM validation for category, priority, urgency, and sentiment.
- **TicketResolver** – multi-space RAG pipeline that cites references and surfaces confidence scores.
- **AutoResponder** – generates tone-aware replies, adds policy disclaimers, and escalates when risky.
- **FeedbackLoop** – records outcomes, tunes confidence thresholds, and syncs new knowledge back.
- **Agent Tools** – helpers to expose the above capabilities as `AgentRunner` tools in one line.

## Quickstart

```ts
import { defineSupportBot, TicketResolver, TicketClassifier, createSupportTools } from '@lssm/lib.support-bot';
import { AgentRegistry, AgentRunner, ToolExecutor } from '@lssm/lib.ai-agent';

const SupportBot = defineSupportBot({
  base: {
    meta: { name: 'support.bot', version: 1, owners: ['team-support'], domain: 'operations' },
    instructions: 'Resolve support tickets with empathy. Escalate if billing or compliance risk.',
    tools: [{ name: 'resolve_ticket' }, { name: 'escalate_ticket' }],
  },
  escalation: { confidenceThreshold: 0.75 },
});

const resolver = new TicketResolver({ knowledge: knowledgeQueryService });
const classifier = new TicketClassifier();
const tools = createSupportTools({ resolver, classifier });

const registry = new AgentRegistry().register(SupportBot);
const runner = new AgentRunner({
  registry,
  llm: mistralProvider,
  toolExecutor: new ToolExecutor({ tools }),
});

const outcome = await runner.run({
  agent: 'support.bot',
  input: 'My payout failed yesterday and it is urgent',
  tenantId: 'acme',
});
```

See `/packages/examples/ai-support-bot` for an end-to-end integration with ticket ingestion, review queues, and analytics.
