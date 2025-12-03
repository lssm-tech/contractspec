// export const metadata: Metadata = {
//   title: 'Workflow Library | ContractSpec',
//   description: 'Runtime orchestration engine for ContractSpec Workflows.',
// };

export default function WorkflowLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Workflow Runtime Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@lssm/lib.contracts/workflow</code> library provides the
          core <code>WorkflowRunner</code> for executing stateful, durable
          workflows.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">WorkflowRunner</h2>
        <p>
          The runner manages execution state, step transitions, retries, and
          compensation.
        </p>

        <div className="bg-muted rounded-lg border p-4">
          <pre className="text-sm">
            {`import { WorkflowRunner } from '@lssm/lib.contracts/workflow/runner';
import { InMemoryStateStore } from '@lssm/lib.contracts/workflow/adapters/memory-store';
import { WorkflowRegistry } from '@lssm/lib.contracts/workflow/spec';

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
          </pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">State Persistence</h2>
        <p>
          The runner relies on a <code>StateStore</code> to persist workflow
          execution history. ContractSpec ships with:
        </p>
        <ul className="list-disc space-y-2 pl-6">
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
        <p>The runner emits events that you can subscribe to for monitoring:</p>
        <ul className="list-disc space-y-2 pl-6">
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
    </div>
  );
}
