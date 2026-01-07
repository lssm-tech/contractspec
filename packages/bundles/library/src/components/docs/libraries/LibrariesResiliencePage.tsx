import { CodeBlock, InstallCommand } from '@contractspec/lib.design-system';
import Link from '@contractspec/lib.ui-link';
import { ChevronRight } from 'lucide-react';

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
        <h2 className="text-2xl font-bold">Installation</h2>
        <InstallCommand package="@contractspec/lib.resilience" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Circuit Breaker</h2>
        <p className="text-muted-foreground">
          Prevent cascading failures by stopping calls to a failing dependency.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { CircuitBreaker } from '@contractspec/lib.resilience/circuit-breaker';

const breaker = new CircuitBreaker({
  failureThreshold: 5,
  resetTimeoutMs: 30000,
});

const result = await breaker.execute(async () => {
  return await fetch('https://api.stripe.com/v1/charges');
});`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Retry</h2>
        <p className="text-muted-foreground">Automatically retry transient failures with exponential backoff.</p>
        <CodeBlock
          language="typescript"
          code={`import { retry } from '@contractspec/lib.resilience/retry';

const result = await retry(
  async () => fetchUser(id),
  3, // retries
  1000, // initial delay
  true // backoff
);`}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Timeout & Fallback</h2>
        <p className="text-muted-foreground">
          Set hard limits on execution time and provide default values on
          failure.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { timeout, fallback } from '@contractspec/lib.resilience';

const result = await fallback(
  () => timeout(slowOperation, 5000),
  defaultValue
);`}
        />
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/libraries" className="btn-ghost">
          Back to Libraries
        </Link>
        <Link href="/docs/libraries/testing" className="btn-primary">
          Next: Testing <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
