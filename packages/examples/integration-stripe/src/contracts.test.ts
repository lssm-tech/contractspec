import { describe, expect, test } from 'bun:test';
import {
	artisanStripeBlueprint,
	collectPaymentWorkflow,
	IntegrationStripeFeature,
	StripePaymentsIntegrationSpec,
	stripeLiveConnection,
} from './index';

describe('@contractspec/example.integration-stripe', () => {
	test('exports the canonical integration, workflow, and app config', () => {
		expect(StripePaymentsIntegrationSpec.meta.key).toBe(
			'integration-stripe.integration.psp'
		);
		expect(collectPaymentWorkflow.meta.key).toBe(
			'integration-stripe.workflow.payment'
		);
		expect(artisanStripeBlueprint.workflows).toEqual({
			collectPayment: {
				key: collectPaymentWorkflow.meta.key,
				version: collectPaymentWorkflow.meta.version,
			},
		});
		expect(IntegrationStripeFeature.integrations).toEqual([
			{
				key: StripePaymentsIntegrationSpec.meta.key,
				version: StripePaymentsIntegrationSpec.meta.version,
			},
		]);
		expect(stripeLiveConnection.meta.integrationKey).toBe(
			StripePaymentsIntegrationSpec.meta.key
		);
	});
});
