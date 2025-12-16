import { defineCommand } from '@lssm/lib.contracts';
import { PaymentModel, RecordPaymentInputModel } from './payment.schema';

const OWNERS = ['@examples.service-business-os'] as const;

/**
 * Record a payment.
 */
export const RecordPaymentContract = defineCommand({
  meta: {
    name: 'service.payment.record',
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
});
