import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';
import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';

export function LibrariesAiAgentPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@contractspec/lib.ai-agent</h1>
        <p className="text-muted-foreground text-lg">
          Define AI agents in TypeScript, run them with deterministic tool
          calling, capture working memory, and route low-confidence decisions to
          human reviewers.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.ai-agent" />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Define & register</h2>
        <CodeBlock
          language="typescript"
          code={`import { defineAgent, AgentRegistry } from '@contractspec/lib.ai-agent';

const SupportBot = defineAgent({
  meta: { name: 'support.bot', version: '1.0.0' },
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
        <h2 className="text-2xl font-bold">Run with approvals</h2>
        <CodeBlock
          language="typescript"
          code={`import { AgentRunner, ToolExecutor, ApprovalWorkflow } from '@contractspec/lib.ai-agent';

const runner = new AgentRunner({
  registry,
  llm: mistralProvider,
  toolExecutor: new ToolExecutor({ tools: supportTools }),
  approvalWorkflow: new ApprovalWorkflow(),
});

const result = await runner.run({ agent: 'support.bot', input: ticket.body });
if (result.approvalRequestId) {
  // show in ApprovalQueue UI
}`}
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">What's inside</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <code>defineAgent</code>, <code>AgentRegistry</code>,{' '}
            <code>AgentRunner</code>
          </li>
          <li>
            <code>ToolExecutor</code> with schema-enforced tool definitions
          </li>
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
