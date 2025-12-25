import { defineCommand } from '@lssm/lib.contracts';
import { PaymentModel, RecordPaymentInputModel } from './payment.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Record a payment.
 */
export const RecordPaymentContract = defineCommand({
  meta: {
    key: 'service.payment.record',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['service-business-os', 'payment', 'record'],
    description: 'Record a payment.',
    goal: 'Track payments.',
    context: 'Billing.',
  },
  io: {
    input: RecordPaymentInputModel,
    output: PaymentModel,
  },
  policy: { auth: 'user' },
  acceptance: {
    scenarios: [
      {
        key: 'record-payment-happy-path',
        given: ['Invoice exists'],
        when: ['User records payment'],
        then: ['Payment is recorded'],
      },
    ],
    examples: [
      {
        key: 'record-check',
        input: { invoiceId: 'inv-456', amount: 100, method: 'check' },
        output: { id: 'pay-123', status: 'completed' },
      },
    ],
  },
});
