import { Buffer } from 'node:buffer';

import type {
	CreatePaymentIntentInput,
	PaymentsProvider,
	X402FetchRequest,
	X402HttpPaymentClient,
	X402PaymentProof,
	X402PaymentRequirement,
} from '../payments';
import {
	DEFAULT_CHALLENGE_HEADERS,
	DEFAULT_MAX_RETRIES,
	DEFAULT_PAYMENT_HEADER,
	isRetryableBody,
	parseRequirement,
	PAYMENT_REQUIRED_STATUS,
	readChallengeHeader,
	X402ProtocolError,
} from './x402-payments.shared';

export { X402ProtocolError } from './x402-payments.shared';

export interface X402PaymentsClientOptions {
	paymentsProvider: PaymentsProvider;
	fetchImpl?: typeof fetch;
	maxPaymentRetries?: number;
	payer?: string;
	paymentHeaderName?: string;
	challengeHeaderNames?: string[];
	throwOnRetryExhausted?: boolean;
}

export class X402PaymentsClient implements X402HttpPaymentClient {
	private readonly paymentsProvider: PaymentsProvider;
	private readonly fetchImpl: typeof fetch;
	private readonly maxPaymentRetries: number;
	private readonly payer: string;
	private readonly paymentHeaderName: string;
	private readonly challengeHeaderNames: string[];
	private readonly throwOnRetryExhausted: boolean;

	constructor(options: X402PaymentsClientOptions) {
		this.paymentsProvider = options.paymentsProvider;
		this.fetchImpl = options.fetchImpl ?? fetch;
		this.maxPaymentRetries = options.maxPaymentRetries ?? DEFAULT_MAX_RETRIES;
		this.payer = options.payer ?? 'contractspec.x402';
		this.paymentHeaderName =
			options.paymentHeaderName?.trim() || DEFAULT_PAYMENT_HEADER;
		this.challengeHeaderNames =
			options.challengeHeaderNames?.map((header) => header.toLowerCase()) ??
			DEFAULT_CHALLENGE_HEADERS;
		this.throwOnRetryExhausted = options.throwOnRetryExhausted ?? true;
	}

	async fetchWithPayment(request: X402FetchRequest): Promise<Response> {
		if (!isRetryableBody(request.body) && this.maxPaymentRetries > 0) {
			throw new X402ProtocolError(
				'x402 payment retries require a replayable request body'
			);
		}

		const method = request.method ?? 'GET';
		const baseHeaders = request.headers ?? {};
		let headers = { ...baseHeaders };

		for (let attempt = 0; attempt <= this.maxPaymentRetries; attempt += 1) {
			const response = await this.fetchImpl(request.url, {
				method,
				headers,
				body: request.body,
			});

			if (response.status !== PAYMENT_REQUIRED_STATUS) return response;
			if (attempt === this.maxPaymentRetries) {
				if (this.throwOnRetryExhausted) {
					throw new X402ProtocolError(
						'x402 payment retries exhausted without successful settlement',
						response.status
					);
				}
				return response;
			}

			const challenge = readChallengeHeader(
				response.headers,
				this.challengeHeaderNames
			);
			if (!challenge) {
				throw new X402ProtocolError(
					'x402 challenge missing: expected payment requirement headers',
					response.status
				);
			}

			const requirement = this.parsePaymentRequirement(challenge);
			const proof = await this.createProof(requirement);
			headers = {
				...baseHeaders,
				[this.paymentHeaderName]: proof.token,
			};
		}

		throw new X402ProtocolError('x402 retry loop terminated unexpectedly');
	}

	parsePaymentRequirement(headerValue: string): X402PaymentRequirement {
		return parseRequirement(headerValue);
	}

	async createProof(
		requirement: X402PaymentRequirement
	): Promise<X402PaymentProof> {
		const input: CreatePaymentIntentInput = {
			amount: requirement.price,
			description:
				requirement.description ?? 'x402 payment challenge settlement',
			metadata: {
				protocol: 'x402',
				payTo: requirement.payTo ?? '',
				resource: requirement.resource ?? '',
				nonce: requirement.nonce ?? '',
			},
		};

		const intent = await this.paymentsProvider.createPaymentIntent(input);
		const captured = await this.paymentsProvider.capturePayment(intent.id);
		if (captured.status !== 'succeeded' && captured.status !== 'processing') {
			throw new X402ProtocolError(
				`x402 settlement failed for payment intent ${intent.id}`
			);
		}

		const createdAt = new Date();
		const expiresAt =
			typeof requirement.ttlSeconds === 'number'
				? new Date(createdAt.getTime() + requirement.ttlSeconds * 1000)
				: undefined;
		const payload = {
			intentId: intent.id,
			amount: requirement.price.amount,
			currency: requirement.price.currency,
			payTo: requirement.payTo,
			resource: requirement.resource,
			nonce: requirement.nonce,
			payer: this.payer,
			issuedAt: createdAt.toISOString(),
			expiresAt: expiresAt?.toISOString(),
		};

		return {
			scheme: 'x402',
			token: Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url'),
			paymentIntentId: intent.id,
			createdAt,
			expiresAt,
		};
	}
}
