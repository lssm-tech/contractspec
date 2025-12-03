import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// export const metadata = {
//   title: 'Stripe Integration: ContractSpec Docs',
//   description:
//     'Accept payments, manage subscriptions, and handle invoicing with Stripe in ContractSpec.',
// };

export default function StripeIntegrationPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Stripe</h1>
        <p className="text-muted-foreground">
          The Stripe integration enables payment processing, subscription
          management, and invoicing in your ContractSpec applications. All
          Stripe operations are type-safe, policy-enforced, and automatically
          logged.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Setup</h2>
        <p className="text-muted-foreground">
          Add your Stripe credentials to your environment variables:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`# .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...`}</pre>
        </div>
        <p className="text-muted-foreground text-sm">
          Get your API keys from the{' '}
          <a
            href="https://dashboard.stripe.com/apikeys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300"
          >
            Stripe Dashboard
          </a>
          .
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Available capabilities</h2>
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Payment Intents</h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`capabilityId: stripe-create-payment-intent
provider:
  type: stripe
  operation: createPaymentIntent

inputs:
  amount:
    type: number
    description: "Amount in cents"
  currency:
    type: string
    default: "usd"
  customerId:
    type: string
    optional: true
  metadata:
    type: object
    optional: true

outputs:
  paymentIntentId:
    type: string
  clientSecret:
    type: string
  status:
    type: string`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Customers</h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`capabilityId: stripe-create-customer
provider:
  type: stripe
  operation: createCustomer

inputs:
  email:
    type: string
  name:
    type: string
    optional: true
  metadata:
    type: object
    optional: true

outputs:
  customerId:
    type: string
  email:
    type: string`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Subscriptions</h3>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`capabilityId: stripe-create-subscription
provider:
  type: stripe
  operation: createSubscription

inputs:
  customerId:
    type: string
  priceId:
    type: string
  trialDays:
    type: number
    optional: true

outputs:
  subscriptionId:
    type: string
  status:
    type: string
  currentPeriodEnd:
    type: timestamp`}</pre>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Webhooks</h2>
        <p className="text-muted-foreground">
          ContractSpec automatically handles Stripe webhooks. Configure your
          webhook endpoint in the Stripe Dashboard:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`https://your-app.com/api/webhooks/stripe`}</pre>
        </div>
        <p className="text-muted-foreground">Subscribe to these events:</p>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              payment_intent.succeeded
            </code>
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              payment_intent.payment_failed
            </code>
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              customer.subscription.created
            </code>
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              customer.subscription.updated
            </code>
          </li>
          <li>
            <code className="bg-background/50 rounded px-2 py-1">
              customer.subscription.deleted
            </code>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Example workflow</h2>
        <p className="text-muted-foreground">
          Here's a complete payment workflow using Stripe:
        </p>
        <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
          <pre>{`workflowId: process-payment
version: 1.0.0

steps:
  - id: create-customer
    capability: stripe-create-customer
    inputs:
      email: \$\{input.customerEmail\}
      name: \$\{input.customerName\}
    onSuccess: create-payment-intent
    onFailure: notify-error

  - id: create-payment-intent
    capability: stripe-create-payment-intent
    inputs:
      amount: \$\{input.amount\}
      currency: "usd"
      customerId: \$\{steps.create-customer.output.customerId\}
    onSuccess: send-payment-link
    onFailure: notify-error

  - id: send-payment-link
    capability: send-email
    inputs:
      to: \$\{input.customerEmail\}
      template: "payment-link"
      data:
        clientSecret: \$\{steps.create-payment-intent.output.clientSecret\}
        amount: \$\{input.amount\}

  - id: notify-error
    capability: send-email
    inputs:
      to: "admin@example.com"
      template: "payment-error"
      data:
        error: \$\{error.message\}`}</pre>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Testing</h2>
        <p className="text-muted-foreground">
          Use Stripe's test cards for development:
        </p>
        <div className="border-border/50 overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card/50">
              <tr className="border-border/50 border-b">
                <th className="px-4 py-3 font-semibold">Card Number</th>
                <th className="px-4 py-3 font-semibold">Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-border/50 divide-y">
              <tr>
                <td className="px-4 py-3 font-mono">4242 4242 4242 4242</td>
                <td className="px-4 py-3">Successful payment</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono">4000 0000 0000 9995</td>
                <td className="px-4 py-3">Insufficient funds</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono">4000 0000 0000 0002</td>
                <td className="px-4 py-3">Card declined</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Best practices</h2>
        <ul className="text-muted-foreground list-inside list-disc space-y-2">
          <li>Always use test mode during development</li>
          <li>Verify webhook signatures to prevent fraud</li>
          <li>Handle idempotency for payment operations</li>
          <li>Store customer IDs for recurring payments</li>
          <li>
            Use metadata to link Stripe objects to your application records
          </li>
          <li>Monitor failed payments and retry logic</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/docs/integrations" className="btn-ghost">
          Back to Integrations
        </Link>
        <Link href="/docs/integrations/postmark" className="btn-primary">
          Next: Postmark <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
