// export const metadata: Metadata = {
//   title: 'Resilience Library | ContractSpec',
//   description: 'Utilities for building robust, self-healing applications.',
// };

export function LibrariesResiliencePage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Resilience Library</h1>
        <p className="text-muted-foreground text-lg">
          The <code>@contractspec/lib.resilience</code> library provides
          primitives to handle failures gracefully.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Circuit Breaker</h2>
        <p>
          Prevent cascading failures by stopping calls to a failing dependency.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { CircuitBreaker } from '@contractspec/lib.resilience/circuit-breaker';

const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeoutMs: 30000,
});

const result = await breaker.execute(async () => {
  return await fetch('https://api.stripe.com/v1/charges');
});`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Retry</h2>
        <p>Automatically retry transient failures with exponential backoff.</p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { retry } from '@contractspec/lib.resilience/retry';

const result = await retry(
  async () => fetchUser(id),
  3, // retries
  1000, // initial delay
  true // backoff
);`}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Timeout & Fallback</h2>
        <p>
          Set hard limits on execution time and provide default values on
          failure.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`import { timeout, fallback } from '@contractspec/lib.resilience';

const result = await fallback(
  () => timeout(slowOperation, 5000),
  defaultValue
);`}
        </pre>
      </div>
    </div>
  );
}
