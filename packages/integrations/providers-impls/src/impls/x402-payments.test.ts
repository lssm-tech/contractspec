import { describe, expect, it, vi } from 'bun:test';

import type { PaymentsProvider } from '../payments';
import { X402PaymentsClient, X402ProtocolError } from './x402-payments';

describe('X402PaymentsClient', () => {
	it('parses key/value payment requirement headers', () => {
		const client = new X402PaymentsClient({
			paymentsProvider: createPaymentsProvider(),
			fetchImpl: vi.fn(),
		});

		const requirement = client.parsePaymentRequirement(
			'amount=125; currency=usd; accepts=x402,usdc; payTo=merchant_1; nonce=abc123; ttl=60; description="Premium endpoint"'
		);

		expect(requirement.price.amount).toBe(125);
		expect(requirement.price.currency).toBe('USD');
		expect(requirement.accepts).toEqual(['x402', 'usdc']);
		expect(requirement.payTo).toBe('merchant_1');
		expect(requirement.nonce).toBe('abc123');
		expect(requirement.ttlSeconds).toBe(60);
	});

	it('parses structured JSON payment requirements', () => {
		const client = new X402PaymentsClient({
			paymentsProvider: createPaymentsProvider(),
			fetchImpl: vi.fn(),
		});

		const requirement = client.parsePaymentRequirement(
			JSON.stringify({
				price: { amount: 250, currency: 'eur' },
				accepts: ['x402', 'usdc'],
				payTo: 'merchant_2',
				resource: '/premium',
			})
		);

		expect(requirement.price.amount).toBe(250);
		expect(requirement.price.currency).toBe('EUR');
		expect(requirement.resource).toBe('/premium');
	});

	it('retries with payment proof and supports alternate challenge headers', async () => {
		const fetchImpl = vi
			.fn()
			.mockResolvedValueOnce(
				new Response('payment required', {
					status: 402,
					headers: {
						'payment-required': 'amount=250;currency=usd;accepts=x402;ttl=120',
					},
				})
			)
			.mockResolvedValueOnce(new Response('ok', { status: 200 }));

		const paymentsProvider = createPaymentsProvider();
		const client = new X402PaymentsClient({
			paymentsProvider,
			fetchImpl: fetchImpl as typeof fetch,
		});

		const response = await client.fetchWithPayment({
			url: 'https://example.com/paid',
			method: 'POST',
			body: JSON.stringify({ hello: 'world' }),
			headers: {
				'content-type': 'application/json',
			},
		});

		expect(response.status).toBe(200);
		expect(paymentsProvider.createPaymentIntent).toHaveBeenCalled();
		expect(paymentsProvider.capturePayment).toHaveBeenCalledWith('pi_x402');
		expect(fetchImpl).toHaveBeenCalledTimes(2);
		const secondCall = fetchImpl.mock.calls[1];
		expect(secondCall?.[1]?.headers).toMatchObject({
			'x402-payment': expect.any(String),
		});
	});

	it('throws typed error when retries are exhausted', async () => {
		const fetchImpl = vi.fn().mockResolvedValue(
			new Response('payment required', {
				status: 402,
				headers: {
					'x402-requirement': 'amount=250;currency=usd;accepts=x402',
				},
			})
		);

		const client = new X402PaymentsClient({
			paymentsProvider: createPaymentsProvider(),
			fetchImpl: fetchImpl as typeof fetch,
			maxPaymentRetries: 1,
		});

		await expect(
			client.fetchWithPayment({ url: 'https://example.com/paid' })
		).rejects.toBeInstanceOf(X402ProtocolError);
		expect(fetchImpl).toHaveBeenCalledTimes(2);
	});

	it('fails if challenge header is missing', async () => {
		const fetchImpl = vi
			.fn()
			.mockResolvedValueOnce(new Response('payment required', { status: 402 }));

		const client = new X402PaymentsClient({
			paymentsProvider: createPaymentsProvider(),
			fetchImpl: fetchImpl as typeof fetch,
		});

		await expect(
			client.fetchWithPayment({ url: 'https://example.com/paid' })
		).rejects.toThrow('x402 challenge missing');
	});
});

function createPaymentsProvider(): PaymentsProvider {
	return {
		createCustomer: vi.fn(),
		getCustomer: vi.fn(),
		createPaymentIntent: vi.fn(async () => ({
			id: 'pi_x402',
			amount: { amount: 250, currency: 'USD' },
			status: 'requires_payment_method',
		})),
		capturePayment: vi.fn(async () => ({
			id: 'pi_x402',
			amount: { amount: 250, currency: 'USD' },
			status: 'succeeded',
		})),
		cancelPaymentIntent: vi.fn(),
		refundPayment: vi.fn(),
		listInvoices: vi.fn(),
		listTransactions: vi.fn(),
	};
}
