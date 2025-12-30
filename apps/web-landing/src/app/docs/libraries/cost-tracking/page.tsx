// export const metadata: Metadata = {
//   title: 'Cost Tracking Library',
//   description:
//     'Per-operation cost attribution, tenant budgets, and optimization suggestions.',
// };

export default function CostTrackingLibraryPage() {
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
        <h2 className="text-2xl font-bold">Record Samples</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const tracker = new CostTracker();
tracker.recordSample({
  operation: 'orders.list',
  tenantId: 'acme',
  dbReads: 1200,
  dbWrites: 4,
  computeMs: 180,
  externalCalls: [{ provider: 'stripe', cost: 0.02 }],
});`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Budget Alerts</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`const budgets = new BudgetAlertManager({
  budgets: [{ tenantId: 'acme', monthlyLimit: 150 }],
  onAlert: ({ tenantId, total }) => notifyFinance(tenantId, total),
});

tracker.getTotals({ tenantId: 'acme' }).forEach((summary) => budgets.track(summary));`}
        </pre>
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
    </div>
  );
}
