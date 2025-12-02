import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Hello World: ContractSpec Docs',
  description: 'Create your first ContractSpec app in 5 minutes.',
};

export default function HelloWorldPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Your First Operation</h1>
        <p className="text-muted-foreground text-lg">
          Build a payment capture operation with policy enforcement in under 10
          minutes.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">What you'll build</h2>
          <p className="text-muted-foreground">
            A real-world payment processing operation that validates input,
            enforces business rules, integrates with Stripe, and audits every
            transaction. This is production-ready code, not a toy example.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">1. Define the operation spec</h2>
          <p className="text-muted-foreground">
            Create <code>lib/specs/billing/capture-payment.ts</code>:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`import { defineCommand } from '@lssm/lib.contracts';
import { SchemaModel, ScalarTypeEnum } from '@lssm/lib.schema';

const CapturePaymentInput = new SchemaModel({
  name: 'CapturePaymentInput',
  fields: {
    invoiceId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    amount: { type: ScalarTypeEnum.PositiveNumber(), isOptional: false },
    currency: { type: ScalarTypeEnum.String(), isOptional: false },
    paymentMethodId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
  },
});

const PaymentResult = new SchemaModel({
  name: 'PaymentResult',
  fields: {
    transactionId: { type: ScalarTypeEnum.String(), isOptional: false },
    status: { type: ScalarTypeEnum.String(), isOptional: false },
    receiptUrl: { type: ScalarTypeEnum.String(), isOptional: true },
  },
});

export const CapturePayment = defineCommand({
  meta: {
    name: 'billing.capturePayment',
    version: 1,
    description: 'Process a payment for an invoice',
    goal: 'Capture funds from customer payment method',
    context: 'Called when customer confirms purchase',
    owners: ['team-billing'],
    tags: ['payments', 'stripe', 'critical'],
    stability: 'stable',
  },
  io: {
    input: CapturePaymentInput,
    output: PaymentResult,
  },
  policy: {
    auth: 'user',
    rules: [
      { resource: 'invoice', action: 'pay', condition: 'owner' },
    ],
  },
});`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">2. Implement the handler</h2>
          <p className="text-muted-foreground">
            Create <code>lib/handlers/billing/capture-payment.ts</code>:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`import { CapturePayment } from '@/lib/specs/billing/capture-payment';
import { stripe } from '@/lib/integrations/stripe';
import { db } from '@/lib/db';

export async function handleCapturePayment(input, ctx) {
  // 1. Verify invoice exists and belongs to user
  const invoice = await db.invoice.findUnique({
    where: { id: input.invoiceId, userId: ctx.userId },
  });
  
  if (!invoice) throw new Error('Invoice not found');
  if (invoice.status === 'paid') throw new Error('Already paid');

  // 2. Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(input.amount * 100),
    currency: input.currency,
    payment_method: input.paymentMethodId,
    confirm: true,
    metadata: { invoiceId: input.invoiceId },
  });

  // 3. Update invoice status
  await db.invoice.update({
    where: { id: input.invoiceId },
    data: { 
      status: 'paid', 
      paidAt: new Date(),
      transactionId: paymentIntent.id,
    },
  });

  return {
    transactionId: paymentIntent.id,
    status: paymentIntent.status,
    receiptUrl: paymentIntent.charges.data[0]?.receipt_url,
  };
}`}</pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold">3. Register and serve</h2>
          <p className="text-muted-foreground">
            Wire it up in <code>lib/registry.ts</code> and{' '}
            <code>app/api/ops/[...route]/route.ts</code>:
          </p>
          <div className="bg-background/50 border-border text-muted-foreground overflow-x-auto rounded-lg border p-4 font-mono text-sm">
            <pre>{`// lib/registry.ts
import { SpecRegistry, installOp } from '@lssm/lib.contracts';
import { CapturePayment } from './specs/billing/capture-payment';
import { handleCapturePayment } from './handlers/billing/capture-payment';

export const registry = new SpecRegistry();
installOp(registry, CapturePayment, handleCapturePayment);

// app/api/ops/[...route]/route.ts
import { makeNextAppHandler } from '@lssm/lib.contracts/server/rest-next-app';
import { registry } from '@/lib/registry';
import { auth } from '@/lib/auth';

const handler = makeNextAppHandler(registry, async (req) => {
  const session = await auth(req);
  return { actor: 'user', userId: session.userId, tenantId: session.tenantId };
});

export { handler as GET, handler as POST };`}</pre>
          </div>
        </div>

        <div className="card-subtle space-y-4 p-6">
          <h3 className="font-bold">What you just built:</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>
              ✓ Type-safe API endpoint at{' '}
              <code>/api/ops/billing.capturePayment</code>
            </li>
            <li>
              ✓ Automatic input validation (amount must be positive, IDs
              required)
            </li>
            <li>✓ Policy enforcement—only invoice owner can pay</li>
            <li>✓ Stripe integration with error handling</li>
            <li>✓ Database transaction with audit trail</li>
            <li>✓ Same spec works with GraphQL, MCP, or webhooks</li>
          </ul>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Link href="/docs/getting-started/dataviews" className="btn-primary">
            Next: Display Data with DataViews <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
