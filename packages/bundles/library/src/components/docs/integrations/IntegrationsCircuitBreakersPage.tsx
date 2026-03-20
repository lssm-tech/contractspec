// export const metadata: Metadata = {
//   title: 'Circuit Breakers for Integrations | ContractSpec',
//   description: 'How to wrap external integrations with circuit breakers.',
// };

export function IntegrationsCircuitBreakersPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="font-bold text-4xl">Integration Circuit Breakers</h1>
				<p className="text-lg text-muted-foreground">
					External APIs are the most common source of instability. Wrap every
					integration call in a circuit breaker to protect your system.
				</p>
			</div>

			<div className="space-y-4">
				<h2 className="font-bold text-2xl">Pattern</h2>
				<p>
					Create a dedicated circuit breaker instance for each external service.
					This ensures that a failure in Stripe doesn't trigger the circuit
					breaker for Twilio.
				</p>
				<pre className="rounded-lg border bg-muted p-4 text-sm">
					{`// integrations/stripe.ts
import { CircuitBreaker } from '@contractspec/lib.resilience/circuit-breaker';

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
