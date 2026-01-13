import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

export function LibrariesCostTrackingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Cost Tracking Library</h1>
        <p className="text-muted-foreground text-lg">
          <code>@contractspec/lib.cost-tracking</code> transforms raw telemetry
          into dollars: DB/API/compute costs per operation, budget alerts per
          tenant, and actionable optimization tips.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.cost-tracking" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Record Samples</h2>
        <CodeBlock
          language="typescript"
          code={`const tracker = new CostTracker();
tracker.recordSample({
  operation: 'orders.list',
  tenantId: 'acme',
  dbReads: 1200,
  dbWrites: 4,
  computeMs: 180,
  externalCalls: [{ provider: 'stripe', cost: 0.02 }],
});`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Budget Alerts</h2>
        <CodeBlock
          language="typescript"
          code={`const budgets = new BudgetAlertManager({
  budgets: [{ tenantId: 'acme', monthlyLimit: 150 }],
  onAlert: ({ tenantId, total }) => notifyFinance(tenantId, total),
});

tracker.getTotals({ tenantId: 'acme' }).forEach((summary) => budgets.track(summary));`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Optimization Suggestions</h2>
        <p className="text-muted-foreground text-sm">
          Feed summaries into <code>OptimizationRecommender</code> to surface
          N+1 queries, compute-heavy steps, or expensive external calls. Store
          the generated suggestions in the new Prisma model to power Ops
          playbooks.
        </p>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/slo" className="btn-primary">
          Next: SLO <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
