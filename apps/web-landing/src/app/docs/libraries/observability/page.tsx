// export const metadata: Metadata = {
//   title: 'Observability Library | ContractSpec',
//   description: 'OpenTelemetry integration for tracing, metrics, and logs.',
// };

export default function ObservabilityLibraryPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Observability Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@contractspec/lib.observability</code> library provides a
          thin wrapper around OpenTelemetry to simplify instrumentation.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Tracing</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { traceAsync, traceSync } from '@contractspec/lib.observability/tracing';

await traceAsync('process_order', async (span) => {
  span.setAttribute('order_id', order.id);
  await db.save(order);
});`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Metrics</h2>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { createCounter, createHistogram } from '@contractspec/lib.observability/metrics';

const ordersCounter = createCounter('orders_total');
const latencyHistogram = createHistogram('request_duration_seconds');

ordersCounter.add(1, { status: 'success' });
latencyHistogram.record(0.123);`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Middleware</h2>
        <p>Automatically instrument your HTTP handlers:</p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { createTracingMiddleware } from '@contractspec/lib.observability/tracing/middleware';

app.use(createTracingMiddleware());`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Anomaly Detection</h2>
        <p className="text-muted-foreground text-sm">
          Includes baseline calculation and anomaly detection helpers for
          auto-rollback without writing custom math.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { AnomalyDetector, RootCauseAnalyzer, AlertManager } from '@contractspec/lib.observability';

const detector = new AnomalyDetector({ errorRateDelta: 0.4 });
const analyzer = new RootCauseAnalyzer();
const alertManager = new AlertManager({ transport: sendOpsAlert });

const signals = detector.evaluate(point);
signals.forEach((signal) => {
  const analysis = analyzer.analyze(signal, recentDeployments);
  alertManager.notify(signal, analysis);
});`}
        </pre>
      </div>
    </div>
  );
}
