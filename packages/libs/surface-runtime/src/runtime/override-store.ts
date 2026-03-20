/**
 * Overlay persistence for surface runtime.
 * Aligns with 09_extension_and_override_model.md.
 *
 * Merge order: base → system → workspace → user → session → AI proposals.
 * User and workspace overlays are durable; session and AI are ephemeral.
 */

import type { BundleScope, SurfacePatchOp } from '../spec/types';

export interface StoredOverride {
	overrideId: string;
	scope: BundleScope;
	targetKey: string;
	patch: SurfacePatchOp[];
	createdAt: string;
	createdBy?: string;
}

export interface BundleOverrideStore {
	list(scope: BundleScope, targetKey: string): Promise<StoredOverride[]>;
	save(
		scope: BundleScope,
		targetKey: string,
		patch: SurfacePatchOp[],
		options?: { overrideId?: string; createdBy?: string }
	): Promise<string>;
	remove(overrideId: string): Promise<void>;
}

/** Build target key for overlay lookup (bundleKey:surfaceId or bundleKey:routeId). */
export function buildOverrideTargetKey(
	bundleKey: string,
	surfaceId: string,
	routeId?: string
): string {
	return routeId
		? `${bundleKey}:${routeId}:${surfaceId}`
		: `${bundleKey}:${surfaceId}`;
}

export interface ApprovalGateOptions {
	/** When true, workspace scope saves require approval before persisting. */
	requireApprovalForWorkspacePatches?: boolean;
	/** Called when workspace save is attempted. Return true to allow, false to reject. */
	requestApproval?: (args: {
		scope: BundleScope;
		targetKey: string;
		patch: SurfacePatchOp[];
	}) => Promise<boolean>;
}

/**
 * Wraps a store with an approval gate for workspace overlays.
 * When requireApprovalForWorkspacePatches is true and scope is 'workspace',
 * calls requestApproval before save. Rejects if requestApproval returns false.
 */
export function createOverrideStoreWithApprovalGate(
	store: BundleOverrideStore,
	options: ApprovalGateOptions
): BundleOverrideStore {
	const { requireApprovalForWorkspacePatches = false, requestApproval } =
		options;

	return {
		list: store.list.bind(store),
		async save(
			scope: BundleScope,
			targetKey: string,
			patch: SurfacePatchOp[],
			saveOptions?: { overrideId?: string; createdBy?: string }
		): Promise<string> {
			if (
				requireApprovalForWorkspacePatches &&
				scope === 'workspace' &&
				requestApproval
			) {
				const approved = await requestApproval({ scope, targetKey, patch });
				if (!approved) {
					throw new Error(
						'Workspace overlay save rejected: approval required and not granted'
					);
				}
			}
			return store.save(scope, targetKey, patch, saveOptions);
		},
		remove: store.remove.bind(store),
	};
}

/** In-memory override store. For production, replace with persisted backend. */
export function createInMemoryOverrideStore(): BundleOverrideStore {
	const overrides = new Map<string, StoredOverride>();

	function nextId(): string {
		return `ov_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
	}

	return {
		async list(
			scope: BundleScope,
			targetKey: string
		): Promise<StoredOverride[]> {
			return Array.from(overrides.values()).filter(
				(o) => o.scope === scope && o.targetKey === targetKey
			);
		},
		async save(
			scope: BundleScope,
			targetKey: string,
			patch: SurfacePatchOp[],
			options?: { overrideId?: string; createdBy?: string }
		): Promise<string> {
			const overrideId = options?.overrideId ?? nextId();
			const stored: StoredOverride = {
				overrideId,
				scope,
				targetKey,
				patch,
				createdAt: new Date().toISOString(),
				createdBy: options?.createdBy,
			};
			overrides.set(overrideId, stored);
			return overrideId;
		},
		async remove(overrideId: string): Promise<void> {
			overrides.delete(overrideId);
		},
	};
}
