/**
 * Resizable panels adapter stub.
 * Renders panel groups with flex layout. Full react-resizable-panels integration deferred.
 */

import type { PanelGroupRegion, RegionNode } from '../spec/types';
import type {
  PanelLayoutAdapter,
  RenderContext,
  RenderRegionFn,
} from './interfaces';

const LAYOUT_STORAGE_KEY = 'surface-runtime:panel-layout:';

export const resizablePanelsAdapterStub: PanelLayoutAdapter = {
  renderPanelGroup(
    region: PanelGroupRegion,
    ctx: RenderContext,
    renderChild: RenderRegionFn
  ) {
    const direction = region.direction === 'horizontal' ? 'row' : 'column';
    return (
      <div
        data-panel-group
        data-persist-key={region.persistKey}
        style={{
          display: 'flex',
          flexDirection: direction,
          flex: 1,
          minHeight: 0,
        }}
      >
        {region.children.map((child: RegionNode, i: number) => (
          <div key={i} style={{ flex: 1, minWidth: 0, minHeight: 0 }}>
            {renderChild(child, ctx)}
          </div>
        ))}
      </div>
    );
  },

  async restoreLayout(persistKey: string): Promise<number[] | null> {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(LAYOUT_STORAGE_KEY + persistKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as number[];
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  async saveLayout(persistKey: string, sizes: number[]): Promise<void> {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        LAYOUT_STORAGE_KEY + persistKey,
        JSON.stringify(sizes)
      );
    } catch {
      // Ignore storage errors
    }
  },
};
