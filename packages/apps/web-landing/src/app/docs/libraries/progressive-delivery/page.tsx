import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Progressive Delivery Library',
  description: 'Stage-based rollouts with traffic shifting, guardrails, and auto-rollback.',
};

export default function ProgressiveDeliveryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Progressive Delivery Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@lssm/lib.progressive-delivery</code> package helps you ship
          new specs with confidence: canary + blue-green strategies, metric
          guardrails, and rollback hooks in one place.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Define a Strategy</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { DeploymentCoordinator, createDefaultCanaryController, TrafficShifter, RollbackManager } from '@lssm/lib.progressive-delivery';

const strategy = {
  target: { name: 'billing.createInvoice', version: 7 },
  mode: 'canary',
  thresholds: {
    errorRate: 0.01,
    latencyP99: 500,
    latencyP95: 250,
  },
};`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Run the Coordinator</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const eventBus = new DeploymentEventBus();
const controller = createDefaultCanaryController(strategy, fetchMetrics, eventBus);
const coordinator = new DeploymentCoordinator({
  strategy,
  controller,
  trafficShifter: new TrafficShifter(strategy.mode),
  rollbackManager: new RollbackManager({ rollback: revertSpec }),
  applyTrafficSplit: updateFeatureFlag,
  eventBus,
});

const result = await coordinator.run();`}
        </pre>
        <p className="text-muted-foreground text-sm">
          The coordinator emits <code>stage_started</code>,{' '}
          <code>stage_failed</code>, and <code>rolled_back</code> events, making
          it easy to power dashboards or alerting workflows.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Blue-Green Swap</h2>
        <p className="text-muted-foreground text-sm">
          Switch to <code>mode: 'blue-green'</code> to warm up the new stack in
          parallel and cut over once smoke tests pass. The same guardrails apply
          before the final swap.
        </p>
      </div>
    </div>
  );
}
