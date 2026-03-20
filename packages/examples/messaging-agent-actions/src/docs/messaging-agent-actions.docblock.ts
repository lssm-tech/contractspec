import type { DocBlock } from "@contractspec/lib.contracts-spec/docs";
import { registerDocBlocks } from "@contractspec/lib.contracts-spec/docs";

const blocks: DocBlock[] = [
	{
		id: "docs.examples.messaging-agent-actions",
		title: "Messaging Agent Actions",
		summary:
			"Messaging example for safe inbound automation with fixed intents, allowlisted actions, workflow dispatch, and deterministic replies.",
		kind: "reference",
		visibility: "public",
		route: "/docs/examples/messaging-agent-actions",
		tags: ["messaging", "agents", "actions", "workflow"],
		body: `## Included assets
- A single \`messaging.agentActions.process\` command for inbound message routing.
- Deterministic classification for \`status\`, \`run action\`, and \`dispatch workflow\`.
- Allowlisted action and workflow catalog instead of arbitrary tool execution.
- Replay proof for the canonical meetup walkthrough.

## Why it exists
Use this example to show that live messaging demos can stay trustworthy even when inbound text comes from real provider webhooks.`,
	},
	{
		id: "docs.examples.messaging-agent-actions.goal",
		title: "Messaging Agent Actions Goal",
		summary: "Why this safe messaging example exists.",
		kind: "goal",
		visibility: "public",
		route: "/docs/examples/messaging-agent-actions/goal",
		tags: ["messaging", "goal"],
		body: `## Goal
- Prove that provider-connected messaging flows can stay deterministic and reviewable.
- Keep the example narrow enough for a live talk: classify, allowlist, confirm, and stop.
- Avoid free-form tool execution from chat-like input.`,
	},
	{
		id: "docs.examples.messaging-agent-actions.usage",
		title: "Messaging Agent Actions Usage",
		summary: "How to run and extend the messaging agent actions example.",
		kind: "usage",
		visibility: "public",
		route: "/docs/examples/messaging-agent-actions/usage",
		tags: ["messaging", "usage"],
		body: `## Usage
1. Run \`bun run test\` to verify the deterministic classification and allowlist behavior.
2. Run \`bun run proof\` to regenerate the replay artifact used in the meetup lane.
3. Wire the handler behind Slack, WhatsApp, or Telegram ingress in the deployed API library.

## Extension rules
- Add new actions only through the allowlist.
- Add new workflows only through the allowlist.
- Do not execute arbitrary commands from unstructured message text.`,
	},
];

registerDocBlocks(blocks);
