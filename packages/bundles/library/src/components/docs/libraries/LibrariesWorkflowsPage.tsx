import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesWorkflowsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Workflow Runtime Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@contractspec/lib.contracts/workflow</code> library provides
          the core <code>WorkflowRunner</code> for executing stateful, durable
          workflows.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.contracts" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">WorkflowRunner</h2>
        <p className="text-muted-foreground">
          The runner manages execution state, step transitions, retries, and
          compensation.
        </p>

        <CodeBlock
          language="typescript"
          code={`import { WorkflowRunner } from '@contractspec/lib.contracts/workflow/runner';
import { InMemoryStateStore } from '@contractspec/lib.contracts/workflow/adapters/memory-store';
import { WorkflowRegistry } from '@contractspec/lib.contracts/workflow/spec';

const registry = new WorkflowRegistry();
registry.register(MyWorkflow);

const runner = new WorkflowRunner({
  registry,
  stateStore: new InMemoryStateStore(),
  opExecutor: async (op, input, ctx) => {
    // Execute operation using your adapter (REST, GraphQL, etc.)
    return await myAdapter.execute(op, input);
  },
});

// Start a workflow
const workflowId = await runner.start('my.workflow', 1, { userId: '123' });

// Execute next step (usually called by a worker or queue consumer)
await runner.executeStep(workflowId);`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">State Persistence</h2>
        <p className="text-muted-foreground">
          The runner relies on a <code>StateStore</code> to persist workflow
          execution history. ContractSpec ships with:
        </p>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6">
          <li>
            <code>InMemoryStateStore</code> - for testing and development.
          </li>
          <li>
            <code>PrismaStateStore</code> - for production using Prisma ORM.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Events</h2>
        <p className="text-muted-foreground">
          The runner emits events that you can subscribe to for monitoring:
        </p>
        <ul className="text-muted-foreground list-disc space-y-2 pl-6">
          <li>
            <code>workflow.started</code>
          </li>
          <li>
            <code>workflow.step_completed</code>
          </li>
          <li>
            <code>workflow.step_failed</code>
          </li>
          <li>
            <code>workflow.step_retrying</code>
          </li>
          <li>
            <code>workflow.completed</code>
          </li>
          <li>
            <code>workflow.cancelled</code>
          </li>
          <li>
            <code>workflow.compensation_step_completed</code>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/data-views" className="btn-primary">
          Next: Data Views <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
