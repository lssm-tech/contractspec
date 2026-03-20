/**
 * Bundle spec validators: undeclared slots in layouts, missing renderers for node kinds.
 * Aligns with 12_typescript_api_and_package_skeleton.md lints.
 */

import type {
	BundleContext,
	BundleNodeKind,
	RegionNode,
	SlotSpec,
	SurfaceSpec,
} from './types';

/** Node kinds with dedicated renderers in SlotRenderer. Others use generic fallback. */
const KNOWN_NODE_KIND_RENDERERS: ReadonlySet<BundleNodeKind> = new Set([
	'entity-section',
	'entity-field',
	'action-bar',
	'table',
	'timeline',
	'rich-doc',
	'chat-thread',
	'assistant-panel',
	'entity-card',
	'entity-header',
	'entity-summary',
	'entity-activity',
	'entity-relations',
	'relation-graph',
	'custom-widget',
]);

function collectSlotIdsFromRegion(node: RegionNode): string[] {
	const ids: string[] = [];
	if (node.type === 'slot') {
		ids.push(node.slotId);
	}
	if (node.type === 'panel-group' || node.type === 'stack') {
		for (const child of node.children) {
			ids.push(...collectSlotIdsFromRegion(child));
		}
	}
	if (node.type === 'tabs') {
		for (const tab of node.tabs) {
			ids.push(...collectSlotIdsFromRegion(tab.child));
		}
	}
	if (node.type === 'floating') {
		ids.push(node.anchorSlotId);
		ids.push(...collectSlotIdsFromRegion(node.child));
	}
	return ids;
}

/**
 * Validates that every slot referenced in layout roots is declared in surface.slots.
 *
 * @param surface - Surface spec to validate
 * @throws Error if layout references undeclared slot
 */
export function validateLayoutSlots<C extends BundleContext>(
	surface: SurfaceSpec<C>
): void {
	const declaredSlotIds = new Set(surface.slots.map((s: SlotSpec) => s.slotId));

	for (const layout of surface.layouts) {
		const layoutSlotIds = collectSlotIdsFromRegion(layout.root);
		for (const slotId of layoutSlotIds) {
			if (!declaredSlotIds.has(slotId)) {
				throw new Error(
					`Surface "${surface.surfaceId}" layout "${layout.layoutId}" references undeclared slot "${slotId}". Declared slots: ${[...declaredSlotIds].join(', ')}`
				);
			}
		}
	}
}

export interface ValidateNodeKindsResult {
	warnings: string[];
}

/**
 * Checks which node kinds in slot.accepts lack dedicated renderers.
 * Returns warnings; does not throw. SlotRenderer uses generic fallback for unknown kinds.
 *
 * @param surface - Surface spec to check
 * @returns Warnings for node kinds without dedicated renderers
 */
export function validateBundleNodeKinds<C extends BundleContext>(
	surface: SurfaceSpec<C>
): ValidateNodeKindsResult {
	const warnings: string[] = [];

	for (const slot of surface.slots) {
		for (const kind of slot.accepts) {
			if (!KNOWN_NODE_KIND_RENDERERS.has(kind as BundleNodeKind)) {
				warnings.push(
					`Surface "${surface.surfaceId}" slot "${slot.slotId}" accepts "${kind}" which has no dedicated renderer (generic fallback used)`
				);
			}
		}
	}

	return { warnings };
}
