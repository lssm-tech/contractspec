import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesAiAgentPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">@contractspec/lib.ai-agent</h1>
				<p className="text-lg text-muted-foreground">
					Define AI agents in TypeScript, run them with deterministic tool
					calling, capture working memory, and route low-confidence decisions to
					human reviewers.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Installation</h2>
				<InstallCommand package="@contractspec/lib.ai-agent" />
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Define & register</h2>
				<CodeBlock
					language="typescript"
					code={`import { defineAgent, AgentRegistry } from '@contractspec/lib.contracts-spec/agent';

const SupportBot = defineAgent({
  meta: {
    key: 'support.bot',
    version: '1.0.0',
    description: 'Resolve tickets and escalate low-confidence decisions.',
    owners: ['support'],
    tags: ['support'],
    stability: 'experimental',
  },
  instructions: 'Resolve tickets. Escalate when confidence < 0.75.',
  tools: [{ name: 'support_resolve_ticket' }],
  policy: {
    confidence: { min: 0.7, default: 0.6 },
    escalation: { confidenceThreshold: 0.75 },
  },
});

const registry = new AgentRegistry().register(SupportBot);`}
				/>
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">Run with approvals</h2>
				<CodeBlock
					language="typescript"
					code={`import { createUnifiedAgent, ApprovalWorkflow } from '@contractspec/lib.ai-agent';

const approvals = new ApprovalWorkflow();
const agent = createUnifiedAgent(SupportBot, {
  backend: 'ai-sdk',
  tools: new Map([['support_resolve_ticket', async (input) => resolveTicket(input)]]),
});

const result = await agent.run(ticket.body);
// Route low-confidence or manual-review flows through approvals when needed.
`}
				/>
			</div>

			<div className="space-y-3">
				<h2 className="font-bold text-2xl">What's inside</h2>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground">
					<li>
						<code>createUnifiedAgent</code>, <code>ContractSpecAgent</code>,{' '}
						<code>UnifiedAgent</code>
					</li>
					<li>MCP, operation-backed, memory, and subagent tool adapters</li>
					<li>
						<code>InMemoryAgentMemory</code> plus interfaces for custom stores
					</li>
					<li>
						<code>ApprovalWorkflow</code> + <code>ApprovalStore</code> for
						human-in-the-loop reviews
					</li>
				</ul>
			</div>

			<div className="flex items-center gap-4 pt-4">
				<Link href="/docs/libraries" className="btn-ghost">
					Back to Libraries
				</Link>
				<Link href="/docs/libraries/support-bot" className="btn-primary">
					Next: Support Bot <ChevronRight size={16} />
				</Link>
			</div>
		</div>
	);
}
