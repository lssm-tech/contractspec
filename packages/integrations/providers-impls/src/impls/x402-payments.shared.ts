import type { X402PaymentRequirement } from '../payments';

export const PAYMENT_REQUIRED_STATUS = 402;
export const DEFAULT_MAX_RETRIES = 1;
export const DEFAULT_PAYMENT_HEADER = 'x402-payment';
export const DEFAULT_CHALLENGE_HEADERS = [
	'x402-requirement',
	'x-payment-requirement',
	'payment-required',
];

const STANDARD_KEYS = new Set([
	'amount',
	'price',
	'value',
	'currency',
	'curr',
	'accepts',
	'schemes',
	'payto',
	'pay_to',
	'payee',
	'description',
	'resource',
	'uri',
	'nonce',
	'ttl',
	'ttlseconds',
]);

export class X402ProtocolError extends Error {
	readonly responseStatus: number;

	constructor(message: string, responseStatus = 402) {
		super(message);
		this.name = 'X402ProtocolError';
		this.responseStatus = responseStatus;
	}
}

export function parseRequirement(headerValue: string): X402PaymentRequirement {
	const structured = parseStructuredRequirement(headerValue);
	if (structured) return structured;

	const pairs = parseKeyValueHeader(headerValue);
	const amountValue =
		pairs.get('amount') ?? pairs.get('price') ?? pairs.get('value') ?? '0';
	const amount = Number(amountValue);
	if (!Number.isFinite(amount) || amount <= 0) {
		throw new X402ProtocolError('x402 challenge amount must be positive');
	}

	const currency = (pairs.get('currency') ?? pairs.get('curr') ?? 'USD')
		.trim()
		.toUpperCase();
	const accepts = (pairs.get('accepts') ?? pairs.get('schemes') ?? 'x402')
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);

	const metadata = Object.fromEntries(
		Array.from(pairs.entries()).filter(([key]) => !STANDARD_KEYS.has(key))
	);

	return {
		price: { amount, currency },
		accepts,
		payTo: pairs.get('payto') ?? pairs.get('pay_to') ?? pairs.get('payee'),
		description: pairs.get('description'),
		resource: pairs.get('resource') ?? pairs.get('uri'),
		nonce: pairs.get('nonce'),
		ttlSeconds: toPositiveInteger(pairs.get('ttl') ?? pairs.get('ttlseconds')),
		metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
	};
}

export function readChallengeHeader(
	headers: Headers,
	challengeHeaderNames: string[]
): string | null {
	for (const name of challengeHeaderNames) {
		const value = headers.get(name);
		if (typeof value === 'string' && value.trim().length > 0) {
			return value.trim();
		}
	}
	return null;
}

export function isRetryableBody(body: BodyInit | undefined): boolean {
	if (!body) return true;
	if (typeof body === 'string') return true;
	if (body instanceof URLSearchParams) return true;
	if (body instanceof FormData) return true;
	if (body instanceof Blob) return true;
	if (body instanceof ArrayBuffer) return true;
	return !('getReader' in (body as object));
}

function parseStructuredRequirement(
	headerValue: string
): X402PaymentRequirement | null {
	const trimmed = headerValue.trim();
	if (!trimmed.startsWith('{')) return null;
	const parsed = safeJsonParse(trimmed);
	if (!parsed || typeof parsed !== 'object') return null;

	const value = parsed as Record<string, unknown>;
	const price = value.price;
	const amount =
		typeof price === 'object' && price !== null
			? Number((price as Record<string, unknown>).amount)
			: Number(value.amount);
	const currencyRaw =
		typeof price === 'object' && price !== null
			? (price as Record<string, unknown>).currency
			: value.currency;
	if (!Number.isFinite(amount) || amount <= 0) {
		throw new X402ProtocolError('x402 structured challenge must include amount');
	}

	return {
		price: {
			amount,
			currency: typeof currencyRaw === 'string' ? currencyRaw.toUpperCase() : 'USD',
		},
		accepts: toStringArray(value.accepts) ?? ['x402'],
		payTo: asOptionalString(value.payTo),
		description: asOptionalString(value.description),
		resource: asOptionalString(value.resource),
		nonce: asOptionalString(value.nonce),
		ttlSeconds: toPositiveInteger(value.ttlSeconds),
	};
}

function parseKeyValueHeader(headerValue: string): Map<string, string> {
	const pairs = new Map<string, string>();
	const segments = headerValue
		.split(';')
		.map((segment) => segment.trim())
		.filter(Boolean);

	for (const segment of segments) {
		const [rawKey, ...valueParts] = segment.split('=');
		if (!rawKey || valueParts.length === 0) continue;
		const key = rawKey.trim().toLowerCase();
		const value = stripQuotes(valueParts.join('=').trim());
		pairs.set(key, value);
	}
	return pairs;
}

function stripQuotes(value: string): string {
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		return value.slice(1, -1);
	}
	return value;
}

function safeJsonParse(value: string): unknown {
	try {
		return JSON.parse(value);
	} catch {
		return null;
	}
}

function toStringArray(value: unknown): string[] | undefined {
	if (!Array.isArray(value)) return undefined;
	const result = value.filter((item): item is string => typeof item === 'string');
	return result.length > 0 ? result : undefined;
}

function asOptionalString(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function toPositiveInteger(value: unknown): number | undefined {
	if (typeof value === 'number' && Number.isInteger(value) && value > 0) {
		return value;
	}
	if (typeof value === 'string' && value.length > 0) {
		const parsed = Number(value);
		if (Number.isInteger(parsed) && parsed > 0) return parsed;
	}
	return undefined;
}
