/**
 * Recursively renders a RegionNode (layout tree).
 * Delegates panel-group to adapter; handles stack, tabs, slot, floating.
 */

import React from 'react';
import type { RenderContext, RenderRegionFn } from '../adapters/interfaces';
import { resizablePanelsAdapterStub } from '../adapters/resizable-panels-stub';
import type { RegionNode } from '../spec/types';

export interface RegionRendererProps {
	region: RegionNode;
	ctx: RenderContext;
	renderSlot: (slotId: string, ctx: RenderContext) => React.ReactNode;
}

export function RegionRenderer({
	region,
	ctx,
	renderSlot,
}: RegionRendererProps) {
	const renderChild: RenderRegionFn = (child, childCtx) => (
		<RegionRenderer region={child} ctx={childCtx} renderSlot={renderSlot} />
	);

	switch (region.type) {
		case 'panel-group':
			return resizablePanelsAdapterStub.renderPanelGroup(
				region,
				ctx,
				renderChild
			);
		case 'stack': {
			const direction = region.direction === 'horizontal' ? 'row' : 'column';
			const gapMap = {
				none: 0,
				xs: 4,
				sm: 8,
				md: 16,
				lg: 24,
			};
			const gap = gapMap[region.gap ?? 'md'];
			return (
				<div
					data-region="stack"
					style={{
						display: 'flex',
						flexDirection: direction,
						gap,
						flex: 1,
						minHeight: 0,
					}}
				>
					{region.children.map((child, i) => (
						<div key={i} style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
							<RegionRenderer
								region={child}
								ctx={ctx}
								renderSlot={renderSlot}
							/>
						</div>
					))}
				</div>
			);
		}
		case 'tabs':
			return (
				<div data-region="tabs">
					<div role="tablist">
						{region.tabs.map((t) => (
							<button key={t.key} type="button" role="tab">
								{t.title}
							</button>
						))}
					</div>
					{region.tabs[0] && (
						<RegionRenderer
							region={region.tabs[0].child}
							ctx={ctx}
							renderSlot={renderSlot}
						/>
					)}
				</div>
			);
		case 'slot':
			return (
				<div data-slot={region.slotId}>{renderSlot(region.slotId, ctx)}</div>
			);
		case 'floating':
			return (
				<div data-floating data-anchor={region.anchorSlotId}>
					<RegionRenderer
						region={region.child}
						ctx={ctx}
						renderSlot={renderSlot}
					/>
				</div>
			);
		default:
			return null;
	}
}
