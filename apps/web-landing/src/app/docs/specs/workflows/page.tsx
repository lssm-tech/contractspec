import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Workflows: ContractSpec Docs',
//   description:
//     'Learn how to define multi-step workflows with retries, compensation, and monitoring in ContractSpec.',
// };

export default function WorkflowsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Workflows</h1>
        <p className="text-muted-foreground">
          A <strong>WorkflowSpec</strong> orchestrates multi-step processes. It
          defines the sequence of operations, handles failures with retries and
          compensation, and provides observability into long-running tasks.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Core concepts</h2>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold">Identifiers</h3>
            <p className="text-muted-foreground">
              Each workflow has a unique{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                workflowId
              </code>{' '}
              and a{' '}
              <code className="bg-background/50 rounded px-2 py-1">
                version
              </code>
              . This allows you to run multiple versions of the same workflow
              simultaneously during migrations or A/B tests.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Steps</h3>
            <p className="text-muted-foreground">
              A workflow is composed of <strong>steps</strong>. Each step
              invokes a{' '}
              <Link
                href="/docs/specs/capabilities"
                className="text-violet-400 hover:text-violet-300"
              >
                CapabilitySpec
              </Link>
              , passes inputs, and receives outputs. Steps can run sequentially
              or in parallel.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Transitions</h3>
            <p className="text-muted-foreground">
              <strong>Transitions</strong> define the flow between steps. They
              can be conditional (e.g., "if payment succeeds, go to step 3;
              otherwise, go to step 5") or unconditional.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Retries</h3>
            <p className="text-muted-foreground">
              If a step fails, the workflow can retry it with exponential
              backoff. You specify the maximum number of retries and the backoff
              strategy in the spec.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Compensation</h3>
            <p className="text-muted-foreground">
              When a workflow fails partway through,{' '}
              <strong>compensation</strong> steps undo the effects of completed
              steps (e.g., refunding a payment, releasing a reservation). This
              ensures consistency even in failure scenarios.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">SLAs</h3>
            <p className="text-muted-foreground">
              You can define Service Level Agreements (SLAs) for each step or
              the entire workflow. If a step exceeds its SLA, the system can
              trigger alerts or escalations.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Example WorkflowSpec (TypeScript)
        </h2>
        <p className="text-muted-foreground">
          Here's a simplified example of a payment workflow in TypeScript:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`import { defineWorkflow } from '@contractspec/lib.contracts';
import { ValidatePaymentMethod, ChargePayment, SendEmail } from './specs';

export const PaymentFlow = defineWorkflow({
  meta: {
    key: 'payment.flow',
    version: '1.0.0',
    description: 'End-to-end payment processing',
    owners: ['team-payments'],
    tags: ['payments'],
    stability: 'stable',
  },
  steps: [
    {
      id: 'validate-payment',
      operation: ValidatePaymentMethod,
      inputs: (ctx, input) => ({
        userId: ctx.userId,
        paymentMethodId: input.paymentMethodId,
      }),
      retry: {
        maxAttempts: 3,
        backoff: 'exponential',
      },
      onSuccess: 'charge-payment',
      onFailure: 'notify-user',
    },
    {
      id: 'charge-payment',
      operation: ChargePayment,
      inputs: (ctx, input, steps) => ({
        amount: input.amount,
        paymentMethodId: input.paymentMethodId,
      }),
      compensation: 'refund-payment',
      onSuccess: 'send-receipt',
      onFailure: 'notify-admin',
    },
    {
      id: 'send-receipt',
      operation: SendEmail,
      inputs: (ctx, input, steps) => ({
        to: ctx.userEmail,
        template: 'payment-receipt',
        data: steps['charge-payment'].output,
      }),
    },
  ],
  sla: {
    maxDuration: 30000, // milliseconds
    alertOnBreach: true,
  },
});`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Triggers</h2>
        <p className="text-muted-foreground">
          Workflows can be triggered in several ways:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <strong>Manual invocation</strong> – A user or system calls the
            workflow via an API endpoint.
          </li>
          <li>
            <strong>Event-driven</strong> – The workflow starts automatically
            when a specific event occurs (e.g., a new order is created).
          </li>
          <li>
            <strong>Scheduled</strong> – The workflow runs on a cron schedule
            (e.g., nightly batch processing).
          </li>
          <li>
            <strong>Chained</strong> – One workflow can invoke another as a
            step.
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Monitoring and versioning</h2>
        <p className="text-muted-foreground">
          ContractSpec automatically instruments workflows with telemetry. You
          can view:
        </p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Real-time execution status for each step</li>
          <li>Historical run data and success/failure rates</li>
          <li>Latency distributions and SLA compliance</li>
          <li>Compensation events and retry attempts</li>
        </ul>
        <p className="text-muted-foreground">
          When you update a workflow, you increment its version. Running
          workflows continue on their original version, while new invocations
          use the latest version. This allows safe, zero-downtime deployments.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            Keep steps idempotent – they should be safe to retry without side
            effects.
          </li>
          <li>
            Define compensation for any step that modifies external state.
          </li>
          <li>Use meaningful step IDs that describe the operation.</li>
          <li>Set realistic SLAs and monitor them in production.</li>
          <li>Test failure scenarios locally before deploying.</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/specs/capabilities" className="btn-ghost">
          Previous: Capabilities
        </Link>
        <Link href="/docs/safety" className="btn-primary">
          Next: Safety Features <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
