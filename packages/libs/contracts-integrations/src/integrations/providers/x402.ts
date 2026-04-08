import { StabilityEnum } from '@contractspec/lib.contracts-spec/ownership';
import { defineIntegration, IntegrationSpecRegistry } from '../spec';

export const x402IntegrationSpec = defineIntegration({
	meta: {
		key: 'payments.x402',
		version: '1.0.0',
		category: 'payments',
		title: 'x402 Payments Protocol',
		description:
			'HTTP-native payment challenge/settlement integration using 402 Payment Required semantics.',
		domain: 'payments',
		owners: ['platform.payments'],
		tags: ['payments', 'http', 'x402'],
		stability: StabilityEnum.Emerging,
	},
	supportedModes: ['managed', 'byok'],
	transports: [
		{
			type: 'rest',
			baseUrl: 'https://x402.org',
		},
	],
	preferredTransport: 'rest',
	supportedAuthMethods: [
		{ type: 'api-key', headerName: 'x402-api-key' },
		{ type: 'custom', scheme: 'x402' },
	],
	capabilities: {
		provides: [
			{ key: 'payments.psp', version: '1.0.0' },
			{ key: 'payments.http402', version: '1.0.0' },
		],
	},
	configSchema: {
		schema: {
			type: 'object',
			properties: {
				defaultNetwork: {
					type: 'string',
					description:
						'Default payment rail/network used for settlement (for example, base-sepolia).',
				},
				maxPaymentRetries: {
					type: 'number',
					description: 'Maximum number of 402 payment retries per request.',
					minimum: 0,
					maximum: 5,
				},
				payer: {
					type: 'string',
					description: 'Logical payer identifier stamped into generated x402 proofs.',
				},
				paymentHeaderName: {
					type: 'string',
					description: 'Outbound header used to send x402 proof tokens.',
				},
				challengeHeaderNames: {
					type: 'array',
					items: { type: 'string' },
					description: 'Inbound headers checked for payment challenge payloads.',
				},
				throwOnRetryExhausted: {
					type: 'boolean',
					description: 'Whether to throw when all configured payment retries are exhausted.',
				},
			},
		},
		example: {
			defaultNetwork: 'base-sepolia',
			maxPaymentRetries: 1,
			payer: 'contractspec.platform',
			paymentHeaderName: 'x402-payment',
			challengeHeaderNames: ['x402-requirement', 'payment-required'],
			throwOnRetryExhausted: true,
		},
	},
	secretSchema: {
		schema: {
			type: 'object',
			required: ['apiKey'],
			properties: {
				apiKey: {
					type: 'string',
					description: 'x402 issuer API key used to mint payment proofs.',
				},
			},
		},
		example: {
			apiKey: 'x402_live_***',
		},
	},
	healthCheck: {
		method: 'ping',
		timeoutMs: 3000,
	},
	docsUrl: 'https://x402.org',
	constraints: {
		rateLimit: {
			rpm: 120,
		},
	},
	byokSetup: {
		setupInstructions:
			'Provision an x402 API key and configure a signing wallet/network for proof settlement.',
		keyRotationSupported: true,
		quotaTrackingSupported: true,
	},
});

export function registerX402Integration(
	registry: IntegrationSpecRegistry
): IntegrationSpecRegistry {
	return registry.register(x402IntegrationSpec);
}
