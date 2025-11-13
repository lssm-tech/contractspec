export interface Money {
  /** Amount denominated in the smallest currency unit (e.g., cents). */
  amount: number;
  currency: string;
}

export type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'succeeded'
  | 'canceled';

export interface PaymentCustomer {
  id: string;
  email?: string;
  name?: string;
  metadata?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCustomerInput {
  email?: string;
  name?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntent {
  id: string;
  amount: Money;
  status: PaymentIntentStatus;
  customerId?: string;
  clientSecret?: string;
  description?: string;
  metadata?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreatePaymentIntentInput {
  amount: Money;
  customerId?: string;
  confirmationMethod?: 'automatic' | 'manual';
  captureMethod?: 'automatic' | 'manual';
  description?: string;
  metadata?: Record<string, string>;
  statementDescriptor?: string;
  returnUrl?: string;
}

export interface CapturePaymentInput {
  amount?: Money;
  receiptEmail?: string;
  metadata?: Record<string, string>;
}

export interface PaymentRefund {
  id: string;
  paymentIntentId: string;
  amount: Money;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  reason?: string;
  metadata?: Record<string, string>;
  createdAt?: Date;
}

export interface RefundPaymentInput {
  paymentIntentId: string;
  amount?: Money;
  reason?: string;
  metadata?: Record<string, string>;
}

export interface PaymentInvoice {
  id: string;
  number?: string;
  status:
    | 'draft'
    | 'open'
    | 'paid'
    | 'uncollectible'
    | 'void'
    | 'deleted';
  amountDue: Money;
  amountPaid?: Money;
  customerId?: string;
  dueDate?: Date;
  hostedInvoiceUrl?: string;
  metadata?: Record<string, string>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ListInvoicesQuery {
  customerId?: string;
  status?: PaymentInvoice['status'][];
  limit?: number;
  startingAfter?: string;
}

export interface PaymentTransaction {
  id: string;
  paymentIntentId?: string;
  amount: Money;
  type: 'capture' | 'refund' | 'payout';
  status: 'pending' | 'succeeded' | 'failed';
  description?: string;
  createdAt: Date;
  metadata?: Record<string, string>;
}

export interface ListTransactionsQuery {
  customerId?: string;
  paymentIntentId?: string;
  limit?: number;
  startingAfter?: string;
}

export interface PaymentsProvider {
  createCustomer(input: CreateCustomerInput): Promise<PaymentCustomer>;
  getCustomer(customerId: string): Promise<PaymentCustomer | null>;
  createPaymentIntent(
    input: CreatePaymentIntentInput
  ): Promise<PaymentIntent>;
  capturePayment(
    paymentIntentId: string,
    input?: CapturePaymentInput
  ): Promise<PaymentIntent>;
  cancelPaymentIntent(paymentIntentId: string): Promise<PaymentIntent>;
  refundPayment(input: RefundPaymentInput): Promise<PaymentRefund>;
  listInvoices(query?: ListInvoicesQuery): Promise<PaymentInvoice[]>;
  listTransactions(
    query?: ListTransactionsQuery
  ): Promise<PaymentTransaction[]>;
}


