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
  PaymentTransaction,
  PaymentsProvider,
  RefundPaymentInput,
} from '../payments';

export interface StripePaymentsProviderOptions {
  apiKey: string;
  stripe?: Stripe;
}

const API_VERSION: Stripe.LatestApiVersion = '2024-06-20';

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
      reason: input.reason ?? undefined,
      metadata: input.metadata,
    });
    return {
      id: refund.id,
      paymentIntentId: refund.payment_intent ?? '',
      amount: {
        amount: refund.amount ?? 0,
        currency: refund.currency?.toUpperCase() ?? 'USD',
      },
      status: refund.status ?? 'pending',
      reason: refund.reason ?? undefined,
      metadata: refund.metadata as Record<string, string>,
      createdAt: refund.created ? new Date(refund.created * 1000) : undefined,
    };
  }

  async listInvoices(query?: ListInvoicesQuery): Promise<PaymentInvoice[]> {
    const response = await this.stripe.invoices.list({
      customer: query?.customerId,
      status: query?.status?.[0],
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
      paymentIntentId: charge.payment_intent ?? undefined,
      amount: {
        amount: charge.amount,
        currency: charge.currency?.toUpperCase() ?? 'USD',
      },
      type: 'capture',
      status: charge.status === 'succeeded' ? 'succeeded' : 'failed',
      description: charge.description ?? undefined,
      createdAt: new Date(charge.created * 1000),
      metadata: charge.metadata as Record<string, string>,
      score: charge.balance_transaction ?? undefined,
    }));
  }

  private toCustomer(customer: Stripe.Customer): PaymentCustomer {
    return {
      id: customer.id,
      email: customer.email ?? undefined,
      name: customer.name ?? undefined,
      metadata: customer.metadata as Record<string, string>,
      createdAt: customer.created ? new Date(customer.created * 1000) : undefined,
      updatedAt: customer.metadata?.updatedAt
        ? new Date(customer.metadata.updatedAt)
        : undefined,
    };
  }

  private toPaymentIntent(intent: Stripe.PaymentIntent): PaymentIntent {
    return {
      id: intent.id,
      amount: this.toMoney(intent.amount_received || intent.amount, intent.currency),
      status: intent.status,
      customerId: typeof intent.customer === 'string' ? intent.customer : intent.customer?.id,
      description: intent.description ?? undefined,
      clientSecret: intent.client_secret ?? undefined,
      metadata: intent.metadata as Record<string, string>,
      createdAt: new Date(intent.created * 1000),
      updatedAt: intent.last_payment_error?.created
        ? new Date(intent.last_payment_error.created * 1000)
        : undefined,
    };
  }

  private toInvoice(invoice: Stripe.Invoice): PaymentInvoice {
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
      metadata: invoice.metadata as Record<string, string>,
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
}


