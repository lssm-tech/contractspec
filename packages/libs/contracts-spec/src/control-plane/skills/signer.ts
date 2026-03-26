import {
	constants,
	createPrivateKey,
	createPublicKey,
	type KeyLike,
	sign,
	verify,
} from 'crypto';

import type {
	ControlPlaneSkillManifest,
	ControlPlaneSkillSignatureAlgorithm,
} from './types';

export interface SignControlPlaneSkillOptions {
	algorithm?: ControlPlaneSkillSignatureAlgorithm;
	keyId?: string;
	issuedAt?: Date | string;
	expiresAt?: Date | string;
	metadata?: Record<string, unknown>;
	publicKey?: string;
}

export function signControlPlaneSkillManifest(
	manifest: ControlPlaneSkillManifest,
	privateKey: KeyLike | string | Buffer,
	options: SignControlPlaneSkillOptions = {}
): ControlPlaneSkillManifest {
	const algorithm = options.algorithm ?? 'ed25519';
	const keyObject =
		typeof privateKey === 'string' || Buffer.isBuffer(privateKey)
			? createPrivateKey(privateKey)
			: privateKey;
	const payload = Buffer.from(
		canonicalizeControlPlaneSkillManifest(manifest),
		'utf8'
	);
	const rawSignature =
		algorithm === 'ed25519'
			? sign(null, payload, keyObject)
			: sign('sha256', payload, {
					key: keyObject,
					padding: constants.RSA_PKCS1_PSS_PADDING,
					saltLength: 32,
				});

	return {
		...manifest,
		signature: {
			algorithm,
			signature: rawSignature.toString('base64'),
			publicKey:
				options.publicKey ??
				createPublicKey(keyObject)
					.export({ format: 'pem', type: 'spki' })
					.toString(),
			keyId: options.keyId,
			issuedAt: toIso(options.issuedAt) ?? new Date().toISOString(),
			expiresAt: toIso(options.expiresAt),
			metadata: options.metadata,
		},
	};
}

export function verifyControlPlaneSkillSignature(
	manifest: ControlPlaneSkillManifest
): boolean {
	if (!manifest.signature?.signature) {
		throw new Error('Skill manifest is missing signature metadata.');
	}

	const payload = Buffer.from(
		canonicalizeControlPlaneSkillManifest(manifest),
		'utf8'
	);
	const signature = Buffer.from(manifest.signature.signature, 'base64');
	const publicKey = createPublicKey(manifest.signature.publicKey);

	if (manifest.signature.algorithm === 'ed25519') {
		return verify(null, payload, publicKey, signature);
	}

	return verify(
		'sha256',
		payload,
		{
			key: publicKey,
			padding: constants.RSA_PKCS1_PSS_PADDING,
			saltLength: 32,
		},
		signature
	);
}

export function canonicalizeControlPlaneSkillManifest(
	manifest: ControlPlaneSkillManifest
): string {
	const clone = deepSort({ ...manifest, signature: undefined });
	return JSON.stringify(clone);
}

function deepSort(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((item) => deepSort(item));
	}
	if (!value || typeof value !== 'object') {
		return value;
	}
	return Object.fromEntries(
		Object.entries(value)
			.filter(([, item]) => item !== undefined)
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, item]) => [key, deepSort(item)])
	);
}

function toIso(value?: Date | string): string | undefined {
	if (!value) {
		return undefined;
	}
	return typeof value === 'string'
		? new Date(value).toISOString()
		: value.toISOString();
}
