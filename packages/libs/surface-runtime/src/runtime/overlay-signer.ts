/**
 * Workspace overlay signing using lib.overlay-engine signer.
 * Aligns with 09_extension_and_override_model.md.
 *
 * Workspace overlays require signing for audit and provenance.
 * Never use ephemeral-ai trust for durable registration.
 */

import {
	type SignOverlayOptions,
	signOverlay,
	verifyOverlaySignature,
} from '@contractspec/lib.overlay-engine/signer';
import type {
	OverlaySpec,
	SignedOverlaySpec,
} from '@contractspec/lib.overlay-engine/spec';

/** Private key for signing (PEM string, Buffer, or crypto.KeyObject). */
export type OverlaySigningKey = string | Buffer | import('crypto').KeyLike;

/** Sign a workspace overlay for durable persistence. */
export function signWorkspaceOverlay(
	spec: OverlaySpec,
	privateKey: OverlaySigningKey,
	options?: SignOverlayOptions
): SignedOverlaySpec {
	return signOverlay(spec, privateKey, options);
}

/** Verify a signed workspace overlay. */
export function verifyWorkspaceOverlay(overlay: SignedOverlaySpec): boolean {
	return verifyOverlaySignature(overlay);
}
