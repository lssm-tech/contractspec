import stringify from 'fast-json-stable-stringify';
import {
  constants,
  createPrivateKey,
  createPublicKey,
  type KeyLike,
  sign,
  verify,
} from 'crypto';
import type {
  OverlaySignatureAlgorithm,
  OverlaySpec,
  SignedOverlaySpec,
} from './spec';

export interface SignOverlayOptions {
  algorithm?: OverlaySignatureAlgorithm;
  keyId?: string;
  issuedAt?: Date | string;
  expiresAt?: Date | string;
  metadata?: Record<string, unknown>;
  publicKey?: string;
}

export function signOverlay(
  spec: OverlaySpec,
  privateKey: KeyLike | string | Buffer,
  options: SignOverlayOptions = {}
): SignedOverlaySpec {
  const algorithm = options.algorithm ?? 'ed25519';
  const keyObject =
    typeof privateKey === 'string' || Buffer.isBuffer(privateKey)
      ? createPrivateKey(privateKey)
      : privateKey;
  const payload = Buffer.from(canonicalizeOverlay(spec), 'utf8');

  let rawSignature: Buffer;
  if (algorithm === 'ed25519') {
    rawSignature = sign(null, payload, keyObject);
  } else if (algorithm === 'rsa-pss-sha256') {
    rawSignature = sign('sha256', payload, {
      key: keyObject,
      padding: constants.RSA_PKCS1_PSS_PADDING,
      saltLength: 32,
    });
  } else {
    throw new Error(`Unsupported overlay signature algorithm: ${algorithm}`);
  }

  const publicKey =
    options.publicKey ??
    createPublicKey(keyObject)
      .export({ format: 'pem', type: 'spki' })
      .toString();

  return {
    ...spec,
    signature: {
      algorithm,
      signature: rawSignature.toString('base64'),
      publicKey,
      keyId: options.keyId,
      issuedAt: toIso(options.issuedAt) ?? new Date().toISOString(),
      expiresAt: toIso(options.expiresAt),
      metadata: options.metadata,
    },
  };
}

export function verifyOverlaySignature(overlay: SignedOverlaySpec): boolean {
  if (!overlay.signature?.signature) {
    throw new Error(
      `Overlay "${overlay.overlayId}" is missing signature metadata.`
    );
  }
  const payload = Buffer.from(canonicalizeOverlay(overlay), 'utf8');
  const signature = Buffer.from(overlay.signature.signature, 'base64');
  const publicKey = createPublicKey(overlay.signature.publicKey);

  if (overlay.signature.algorithm === 'ed25519') {
    return verify(null, payload, publicKey, signature);
  }

  if (overlay.signature.algorithm === 'rsa-pss-sha256') {
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

  throw new Error(
    `Unsupported overlay signature algorithm: ${overlay.signature.algorithm}`
  );
}

export function canonicalizeOverlay(
  spec: OverlaySpec | SignedOverlaySpec
): string {
  const { signature, ...rest } = spec as SignedOverlaySpec;
  return stringify(rest);
}

export function stripSignature<T extends OverlaySpec | SignedOverlaySpec>(
  spec: T
): OverlaySpec {
  const { signature, ...rest } = spec as SignedOverlaySpec;
  return { ...rest };
}

function toIso(value?: Date | string): string | undefined {
  if (!value) {
    return undefined;
  }
  if (typeof value === 'string') {
    return new Date(value).toISOString();
  }
  return value.toISOString();
}

