import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Library | ContractSpec',
  description: 'Funnels, cohorts, churn, and hypotheses without spinning up a warehouse.',
};

export default function AnalyticsLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">@lssm/lib.analytics</h1>
        <p className="text-muted-foreground text-lg">
          Work directly with telemetry events to understand conversion, retention, churn, and growth opportunities.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Funnels in memory</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
{`import { FunnelAnalyzer } from '@lssm/lib.analytics/funnel';

const analyzer = new FunnelAnalyzer();
const report = analyzer.analyze(events, {
  name: 'signup',
  steps: [
    { id: 'view', eventName: 'page.view', match: (e) => e.properties?.slug === '/signup' },
    { id: 'submit', eventName: 'signup.submit' },
    { id: 'verified', eventName: 'account.verified' },
  ],
});`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Cohorts & churn</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
{`import { CohortTracker } from '@lssm/lib.analytics/cohort';
import { ChurnPredictor } from '@lssm/lib.analytics/churn';

const cohorts = new CohortTracker().analyze(events, { bucket: 'week', periods: 8 });
const churn = new ChurnPredictor().score(events);`}
        </pre>
      </div>

      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Growth hypotheses</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
{`import { GrowthHypothesisGenerator } from '@lssm/lib.analytics/growth';

const ideas = new GrowthHypothesisGenerator().generate([
  { name: 'Activation rate', current: 0.42, previous: 0.55, target: 0.6 },
  { name: 'Expansion ARPU', current: 1.2, previous: 0.9 },
]);`}
        </pre>
      </div>
    </div>
  );
}
