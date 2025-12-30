// export const metadata: Metadata = {
//   title: 'Personalization Library | ContractSpec',
//   description: 'Behavior tracking and insights for overlay automation.',
// };

export default function PersonalizationLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">
          @contractspec/lib.personalization
        </h1>
        <p className="text-muted-foreground text-lg">
          Track field/feature/workflow usage, analyze drop-offs, and convert
          insights into OverlaySpecs or workflow tweaks.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tracker</h2>
        <p>
          Buffer events per tenant/user and emit OpenTelemetry counters
          automatically.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { createBehaviorTracker } from '@contractspec/lib.personalization';

const tracker = createBehaviorTracker({
  store,
  context: { tenantId: ctx.tenant.id, userId: ctx.identity.id },
});

tracker.trackFieldAccess({ operation: 'billing.createOrder', field: 'items' });
tracker.trackWorkflowStep({ workflow: 'invoice', step: 'review', status: 'entered' });`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Analyzer</h2>
        <p>
          Summarize events and highlight unused UI, frequent fields, and
          workflow bottlenecks.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { BehaviorAnalyzer } from '@contractspec/lib.personalization/analyzer';

const analyzer = new BehaviorAnalyzer(store);
const insights = await analyzer.analyze({ tenantId: 'acme', userId: 'ops-42' });
// { unusedFields: ['internalNotes'], workflowBottlenecks: [...] }`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Adapter</h2>
        <p>Convert insights into overlays or workflow extension hints.</p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { insightsToOverlaySuggestion } from '@contractspec/lib.personalization/adapter';

const overlay = insightsToOverlaySuggestion(insights, {
  overlayId: 'acme-order-form',
  tenantId: 'acme',
  capability: 'billing.createOrder',
});`}
        </pre>
      </div>
    </div>
  );
}
