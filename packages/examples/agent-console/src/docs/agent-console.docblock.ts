import type { DocBlock } from '@contractspec/lib.contracts-spec/docs';
import { registerDocBlocks } from '@contractspec/lib.contracts-spec/docs';

const agentConsoleDocBlocks: DocBlock[] = [
	{
		id: 'docs.examples.agent-console.goal',
		title: 'Agent Console — Goal',
		summary: 'AI agent ops console: tools, agents, runs, logs, and metrics.',
		kind: 'goal',
		visibility: 'public',
		route: '/docs/examples/agent-console/goal',
		tags: ['ai', 'agents', 'goal'],
		body: `## Why it matters
- Provides a regenerable agent operations surface with tool registry and run history.
- Prevents drift between tool schemas, agent configs, and execution logs.

## Business/Product goal
- Safely manage tools/agents/runs with auditability and observability.
- Enable staged rollout of tools and metrics via feature flags.

## Success criteria
- Tool/agent/run specs regenerate UI/API/events cleanly.
- Logs/metrics stay aligned and PII is scoped.`,
	},
	{
		id: 'docs.examples.agent-console.usage',
		title: 'Agent Console — Usage',
		summary: 'How to operate, extend, and regenerate the agent console safely.',
		kind: 'usage',
		visibility: 'public',
		route: '/docs/examples/agent-console/usage',
		tags: ['ai', 'agents', 'usage'],
		body: `## Canonical walkthrough
1) Open the default sandbox route at \`/sandbox\` or \`/sandbox?template=agent-console\`.
2) Inspect seeded agents, tools, runs, and metrics from the deterministic demo runtime.
3) Create an agent, activate it, execute a run, and confirm the metrics update.
4) Generate or inspect the replay proof at \`packages/examples/agent-console/proofs/agent-console-meetup.replay.json\`.

## Extend & regenerate
1) Adjust tool schemas (inputs/outputs), agent configs, and run metrics in spec.
2) Regenerate to sync UI/API/events/logs; mark PII paths for run payloads.
3) Keep the demo runtime deterministic unless you are explicitly validating live providers.

## Guardrails
- Emit events for run lifecycle; store logs with redaction where needed.
- Enforce tool input validation; avoid unsafe arbitrary code exec in handlers.
- Keep tenant/user scoping explicit for ops data and keep meetup demos offline-safe by default.`,
	},
	{
		id: 'docs.examples.agent-console.reference',
		title: 'Agent Console — Reference',
		summary:
			'Entities, contracts, events, and presentations for the agent console.',
		kind: 'reference',
		visibility: 'public',
		route: '/docs/examples/agent-console',
		tags: ['ai', 'agents', 'reference'],
		body: `## Entities
- Tool, Agent, AgentTool, Run, RunStep, RunLog, RunMetric.

## Contracts
- tool/create, agent/create, agent/execute, run/get, run/logs, run/metrics.

## Events
- tool.created, agent.created, run.started/completed/failed, tool.invoked.

## Presentations
- Tool registry, agent list/detail, run list/detail, metrics dashboards, and a server-mode shared table for run history.

## Notes
- Keep tool schemas explicit; enforce validation in spec.
- Use the seeded demo runtime for sandbox and markdown walkthroughs.
- Generate a replay bundle before demos or talks so the walkthrough has proof output ready.`,
	},
	{
		id: 'docs.examples.agent-console.constraints',
		title: 'Agent Console — Constraints & Safety',
		summary:
			'Internal guardrails for tool/agent/run safety, PII, and regeneration.',
		kind: 'reference',
		visibility: 'internal',
		route: '/docs/examples/agent-console/constraints',
		tags: ['ai', 'agents', 'constraints', 'internal'],
		body: `## Constraints
- Tool schemas (inputs/outputs) must be explicit in spec; no arbitrary untyped payloads.
- Events to emit: tool.created, agent.created, run.started/completed/failed, tool.invoked.
- Regeneration must not loosen execution policies or logging without explicit spec diff.

## Safety & PII
- Mark PII in run payloads/logs; redact in markdown/JSON targets.
- Avoid exposing raw tool outputs to MCP/web without policy checks.

## Verification
- Add fixtures for tool schema changes and run lifecycle.
- Ensure Audit/Notifications remain wired for runs; metrics collection unchanged.
- Use Feature Flags to gate risky tools; default safe/off.`,
	},
];

registerDocBlocks(agentConsoleDocBlocks);
