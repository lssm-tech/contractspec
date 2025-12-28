import Stripe from 'stripe';

import type {
  CapturePaymentInput,
  CreateCustomerInput,
  CreatePaymentIntentInput,
  ListInvoicesQuery,
  ListTransactionsQuery,
  Money,
  PaymentCustomer,
  PaymentIntent,
  PaymentInvoice,
  PaymentRefund,
  PaymentsProvider,
  PaymentTransaction,
  RefundPaymentInput,
} from '../payments';

export interface StripePaymentsProviderOptions {
  apiKey: string;
  stripe?: Stripe;
}

const API_VERSION: Stripe.LatestApiVersion = '2025-12-15.clover';

export class StripePaymentsProvider implements PaymentsProvider {
  private readonly stripe: Stripe;

  constructor(options: StripePaymentsProviderOptions) {
    this.stripe =
      options.stripe ??
      new Stripe(options.apiKey, {
        apiVersion: API_VERSION,
      });
  }

  async createCustomer(input: CreateCustomerInput): Promise<PaymentCustomer> {
    const customer = await this.stripe.customers.create({
      email: input.email,
      name: input.name,
      description: input.description,
      metadata: input.metadata,
    });
    return this.toCustomer(customer);
  }

  async getCustomer(customerId: string): Promise<PaymentCustomer | null> {
    const customer = await this.stripe.customers.retrieve(customerId);
    if (customer.deleted) return null;
    return this.toCustomer(customer);
  }

  async createPaymentIntent(
    input: CreatePaymentIntentInput
  ): Promise<PaymentIntent> {
    const intent = await this.stripe.paymentIntents.create({
      amount: input.amount.amount,
      currency: input.amount.currency,
      customer: input.customerId,
      description: input.description,
      capture_method: input.captureMethod ?? 'automatic',
      confirmation_method: input.confirmationMethod ?? 'automatic',
      automatic_payment_methods: { enabled: true },
      metadata: input.metadata,
      return_url: input.returnUrl,
      statement_descriptor: input.statementDescriptor,
    });
    return this.toPaymentIntent(intent);
  }

  async capturePayment(
    paymentIntentId: string,
    input?: CapturePaymentInput
  ): Promise<PaymentIntent> {
    const intent = await this.stripe.paymentIntents.capture(
      paymentIntentId,
      input?.amount ? { amount_to_capture: input.amount.amount } : undefined
    );
    return this.toPaymentIntent(intent);
  }

  async cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const intent = await this.stripe.paymentIntents.cancel(paymentIntentId);
    return this.toPaymentIntent(intent);
  }

  async refundPayment(input: RefundPaymentInput): Promise<PaymentRefund> {
    const refund = await this.stripe.refunds.create({
      payment_intent: input.paymentIntentId,
      amount: input.amount?.amount,
      reason: mapRefundReason(input.reason),
      metadata: input.metadata,
    });
    const paymentIntentId =
      typeof refund.payment_intent === 'string'
        ? refund.payment_intent
        : (refund.payment_intent?.id ?? '');
    return {
      id: refund.id,
      paymentIntentId,
      amount: {
        amount: refund.amount ?? 0,
        currency: refund.currency?.toUpperCase() ?? 'USD',
      },
      status: mapRefundStatus(refund.status),
      reason: refund.reason ?? undefined,
      metadata: this.toMetadata(refund.metadata),
      createdAt: refund.created ? new Date(refund.created * 1000) : undefined,
    };
  }

  async listInvoices(query?: ListInvoicesQuery): Promise<PaymentInvoice[]> {
    const requestedStatus = query?.status?.[0];
    const stripeStatus =
      requestedStatus && requestedStatus !== 'deleted'
        ? requestedStatus
        : undefined;
    const response = await this.stripe.invoices.list({
      customer: query?.customerId,
      status: stripeStatus,
      limit: query?.limit,
      starting_after: query?.startingAfter,
    });
    return response.data.map((invoice) => this.toInvoice(invoice));
  }

  async listTransactions(
    query?: ListTransactionsQuery
  ): Promise<PaymentTransaction[]> {
    const response = await this.stripe.charges.list({
      customer: query?.customerId,
      payment_intent: query?.paymentIntentId,
      limit: query?.limit,
      starting_after: query?.startingAfter,
    });
    return response.data.map((charge) => ({
      id: charge.id,
      paymentIntentId:
        typeof charge.payment_intent === 'string'
          ? charge.payment_intent
          : charge.payment_intent?.id,
      amount: {
        amount: charge.amount,
        currency: charge.currency?.toUpperCase() ?? 'USD',
      },
      type: 'capture',
      status: mapChargeStatus(charge.status),
      description: charge.description ?? undefined,
      createdAt: new Date(charge.created * 1000),
      metadata: this.mergeMetadata(this.toMetadata(charge.metadata), {
        balanceTransaction:
          typeof charge.balance_transaction === 'string'
            ? charge.balance_transaction
            : undefined,
      }),
    }));
  }

  private toCustomer(customer: Stripe.Customer): PaymentCustomer {
    const metadata = this.toMetadata(customer.metadata);
    const updatedAtValue = metadata?.updatedAt;
    return {
      id: customer.id,
      email: customer.email ?? undefined,
      name: customer.name ?? undefined,
      metadata,
      createdAt: customer.created
        ? new Date(customer.created * 1000)
        : undefined,
      updatedAt: updatedAtValue ? new Date(updatedAtValue) : undefined,
    };
  }

  private toPaymentIntent(intent: Stripe.PaymentIntent): PaymentIntent {
    const metadata = this.toMetadata(intent.metadata);
    return {
      id: intent.id,
      amount: this.toMoney(
        intent.amount_received ?? intent.amount ?? 0,
        intent.currency
      ),
      status: mapPaymentIntentStatus(intent.status),
      customerId:
        typeof intent.customer === 'string'
          ? intent.customer
          : intent.customer?.id,
      description: intent.description ?? undefined,
      clientSecret: intent.client_secret ?? undefined,
      metadata,
      createdAt: new Date(intent.created * 1000),
      updatedAt:
        intent.canceled_at != null
          ? new Date(intent.canceled_at * 1000)
          : new Date(intent.created * 1000),
    };
  }

  private toInvoice(invoice: Stripe.Invoice): PaymentInvoice {
    const metadata = this.toMetadata(invoice.metadata);
    return {
      id: invoice.id,
      number: invoice.number ?? undefined,
      status: (invoice.status as PaymentInvoice['status']) ?? 'draft',
      amountDue: this.toMoney(invoice.amount_due ?? 0, invoice.currency),
      amountPaid: this.toMoney(invoice.amount_paid ?? 0, invoice.currency),
      customerId:
        typeof invoice.customer === 'string'
          ? invoice.customer
          : invoice.customer?.id,
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
      hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,
      metadata,
      createdAt: invoice.created ? new Date(invoice.created * 1000) : undefined,
      updatedAt: invoice.status_transitions?.finalized_at
        ? new Date(invoice.status_transitions.finalized_at * 1000)
        : undefined,
    };
  }

  private toMoney(amount: number, currency?: string | null): Money {
    return {
      amount,
      currency: currency?.toUpperCase() ?? 'USD',
    };
  }

  private toMetadata(
    metadata: Stripe.Metadata | Stripe.Metadata | null | undefined
  ): Record<string, string> | undefined {
    if (!metadata) return undefined;
    const entries = Object.entries(metadata).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    );
    if (entries.length === 0) return undefined;
    return Object.fromEntries(entries);
  }

  private mergeMetadata(
    base: Record<string, string> | undefined,
    extras: Record<string, string | undefined>
  ): Record<string, string> | undefined {
    const filteredExtras = Object.entries(extras).filter(
      (entry): entry is [string, string] => typeof entry[1] === 'string'
    );
    if (!base && filteredExtras.length === 0) {
      return undefined;
    }
    return {
      ...(base ?? {}),
      ...Object.fromEntries(filteredExtras),
    };
  }
}

function mapRefundReason(
  reason?: string
): Stripe.RefundCreateParams.Reason | undefined {
  if (!reason) return undefined;
  const allowed: Stripe.RefundCreateParams.Reason[] = [
    'duplicate',
    'fraudulent',
    'requested_by_customer',
  ];
  return allowed.includes(reason as Stripe.RefundCreateParams.Reason)
    ? (reason as Stripe.RefundCreateParams.Reason)
    : undefined;
}

function mapPaymentIntentStatus(
  status: string | null | undefined
): PaymentIntent['status'] {
  switch (status) {
    case 'requires_payment_method':
      return 'requires_payment_method';
    case 'requires_confirmation':
      return 'requires_confirmation';
    case 'requires_action':
    case 'requires_capture':
      return 'requires_action';
    case 'processing':
      return 'processing';
    case 'succeeded':
      return 'succeeded';
    case 'canceled':
      return 'canceled';
    default:
      return 'requires_payment_method';
  }
}

function mapRefundStatus(
  status: string | null | undefined
): PaymentRefund['status'] {
  switch (status) {
    case 'pending':
    case 'succeeded':
    case 'failed':
    case 'canceled':
      return status;
    default:
      return 'pending';
  }
}

function mapChargeStatus(
  status: string | null | undefined
): PaymentTransaction['status'] {
  switch (status) {
    case 'pending':
    case 'processing':
      return 'pending';
    case 'succeeded':
      return 'succeeded';
    case 'failed':
    case 'canceled':
      return 'failed';
    default:
      return 'pending';
  }
}
