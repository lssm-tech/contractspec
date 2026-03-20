/**
 * dnd-kit adapter stub. Full customization mode deferred to Phase 6.
 * No direct dnd-kit imports in Phase 2.
 */

import type { DragDropBundleAdapter } from './interfaces';

export const dndKitAdapterStub: DragDropBundleAdapter = {
	enableSurfaceEditing(_args) {
		// No-op stub. DnD editing mode in Phase 6.
	},
};
