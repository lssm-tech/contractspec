/**
 * Floating UI adapter stub. Full implementation deferred.
 * No direct Floating UI imports in Phase 2.
 */

import type { FloatingBundleAdapter } from './interfaces';

export const floatingUiAdapterStub: FloatingBundleAdapter = {
	renderAnchoredMenu({ anchorId, items }) {
		return (
			<div data-floating-stub data-anchor-id={anchorId} role="menu">
				{items.map((a) => (
					<div key={a.actionId} role="menuitem">
						{a.title}
					</div>
				))}
			</div>
		);
	},
};
