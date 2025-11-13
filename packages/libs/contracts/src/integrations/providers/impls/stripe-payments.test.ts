import Stripe from 'stripe';
import { describe, expect, it, vi } from 'vitest';

import { StripePaymentsProvider } from './stripe-payments';

const sampleCustomer: Stripe.Customer = {
  id: 'cus_123',
  object: 'customer',
  created: Math.floor(Date.now() / 1000),
  email: 'user@example.com',
  metadata: {},
};

const sampleIntent: Stripe.PaymentIntent = {
  id: 'pi_123',
  object: 'payment_intent',
  amount: 1000,
  currency: 'usd',
  status: 'requires_payment_method',
  created: Math.floor(Date.now() / 1000),
  livemode: false,
  metadata: {},
  charges: {
    object: 'list',
    data: [],
    has_more: false,
    total_count: 0,
    url: '',
  },
};

const sampleInvoice: Stripe.Invoice = {
  id: 'in_123',
  object: 'invoice',
  amount_due: 1000,
  amount_paid: 0,
  currency: 'usd',
  status: 'draft',
  livemode: false,
  metadata: {},
  lines: {
    object: 'list',
    data: [],
    has_more: false,
    url: '',
  },
};

const sampleCharge: Stripe.Charge = {
  id: 'ch_123',
  object: 'charge',
  amount: 1000,
  currency: 'usd',
  status: 'succeeded',
  created: Math.floor(Date.now() / 1000),
  paid: true,
  refunded: false,
  captured: true,
  balance_transaction: 'txn_123',
  livemode: false,
  metadata: {},
  payment_intent: 'pi_123',
  billing_details: {
    address: null,
    email: null,
    name: null,
    phone: null,
  },
  outcome: null,
  payment_method_details: {
    card: {
      brand: 'visa',
      checks: null,
      country: null,
      exp_month: null,
      exp_year: null,
      fingerprint: null,
      funding: 'credit',
      installments: null,
      last4: '4242',
      mandate: null,
      network: null,
      three_d_secure: null,
      wallet: null,
      generated_from: null,
    },
    type: 'card',
  },
  source: null,
  statement_descriptor: null,
  statement_descriptor_suffix: null,
  fraud_details: null,
  receipt_number: null,
  refunds: {
    object: 'list',
    data: [],
    has_more: false,
    total_count: 0,
    url: '',
  },
  description: null,
};

describe('StripePaymentsProvider', () => {
  it('creates and retrieves customers', async () => {
    const stripe = createMockStripe();
    const provider = new StripePaymentsProvider({
      apiKey: 'test',
      stripe,
    });
    const customer = await provider.createCustomer({
      email: 'user@example.com',
    });
    expect(stripe.customers.create).toHaveBeenCalled();
    expect(customer.id).toBe('cus_123');

    const retrieved = await provider.getCustomer('cus_123');
    expect(stripe.customers.retrieve).toHaveBeenCalledWith('cus_123');
    expect(retrieved?.email).toBe('user@example.com');
  });

  it('handles payment intents lifecycle', async () => {
    const stripe = createMockStripe();
    const provider = new StripePaymentsProvider({
      apiKey: 'test',
      stripe,
    });

    const intent = await provider.createPaymentIntent({
      amount: { amount: 1000, currency: 'usd' },
    });
    expect(intent.id).toBe('pi_123');

    const captured = await provider.capturePayment('pi_123');
    expect(captured.status).toBe('requires_payment_method');

    const cancelled = await provider.cancelPaymentIntent('pi_123');
    expect(cancelled.id).toBe('pi_123');
  });

  it('creates refunds', async () => {
    const stripe = createMockStripe();
    const provider = new StripePaymentsProvider({
      apiKey: 'test',
      stripe,
    });

    const refund = await provider.refundPayment({
      paymentIntentId: 'pi_123',
      amount: { amount: 500, currency: 'usd' },
    });
    expect(stripe.refunds.create).toHaveBeenCalled();
    expect(refund.paymentIntentId).toBe('pi_123');
  });

  it('lists invoices and transactions', async () => {
    const stripe = createMockStripe();
    const provider = new StripePaymentsProvider({
      apiKey: 'test',
      stripe,
    });

    const invoices = await provider.listInvoices();
    expect(invoices).toHaveLength(1);

    const transactions = await provider.listTransactions();
    expect(transactions).toHaveLength(1);
    expect(transactions[0].paymentIntentId).toBe('pi_123');
  });
});

function createMockStripe() {
  return {
    customers: {
      create: vi.fn(async () => sampleCustomer),
      retrieve: vi.fn(async () => sampleCustomer),
    },
    paymentIntents: {
      create: vi.fn(async () => sampleIntent),
      capture: vi.fn(async () => sampleIntent),
      cancel: vi.fn(async () => sampleIntent),
    },
    refunds: {
      create: vi.fn(async () => ({
        id: 're_123',
        amount: 500,
        currency: 'usd',
        status: 'succeeded',
        payment_intent: 'pi_123',
        metadata: {},
        created: Math.floor(Date.now() / 1000),
      })),
    },
    invoices: {
      list: vi.fn(async () => ({
        data: [sampleInvoice],
      })),
    },
    charges: {
      list: vi.fn(async () => ({
        data: [sampleCharge],
      })),
    },
  } as unknown as Stripe;
}

