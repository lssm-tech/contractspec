// export const metadata: Metadata = {
//   title: 'Circuit Breakers for Integrations | ContractSpec',
//   description: 'How to wrap external integrations with circuit breakers.',
// };

export function IntegrationsCircuitBreakersPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Integration Circuit Breakers</h1>
        <p className="text-muted-foreground text-lg">
          External APIs are the most common source of instability. Wrap every
          integration call in a circuit breaker to protect your system.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Pattern</h2>
        <p>
          Create a dedicated circuit breaker instance for each external service.
          This ensures that a failure in Stripe doesn't trigger the circuit
          breaker for Twilio.
        </p>
        <pre className="bg-muted rounded-lg border p-4 text-sm">
          {`// integrations/stripe.ts
import { CircuitBreaker } from '@lssm/lib.resilience/circuit-breaker';

const stripeBreaker = new CircuitBreaker({
  failureThreshold: 10,
  resetTimeoutMs: 60000,
});

export async function createCharge(amount: number) {
  return stripeBreaker.execute(() => stripe.charges.create({ amount }));
}`}
        </pre>
      </div>
    </div>
  );
}
