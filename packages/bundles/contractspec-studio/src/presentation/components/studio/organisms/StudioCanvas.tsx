import * as React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Square,
} from 'lucide-react';
import type {
  CanvasState,
  ComponentNode,
} from '../../../../modules/visual-builder';
import { useStudioFeatureFlag } from '../../../hooks/studio';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery';
import { FeatureGateNotice } from '../../shared/FeatureGateNotice';

export interface StudioCanvasProps {
  state: CanvasState;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  onFocusTree?: () => void;
  height?: number;
}

export function StudioCanvas({
  state,
  selectedNodeId,
  onSelectNode,
  onFocusTree,
  height = 560,
}: StudioCanvasProps) {
  const [zoom, setZoom] = React.useState(1);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const visualBuilderEnabled = useStudioFeatureFlag(
    ContractSpecFeatureFlags.STUDIO_VISUAL_BUILDER
  );

  const nodes = state.nodes ?? [];

  const toggleFullScreen = () => {
    setIsFullScreen((value) => !value);
    onFocusTree?.();
  };

  if (!visualBuilderEnabled) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
        <FeatureGateNotice
          title="Visual builder in private preview"
          description="Your workspace is still on the shared canvas track. Enable STUDIO_VISUAL_BUILDER to unlock drag-and-drop editing."
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-lg font-semibold">Visual builder canvas</p>
          <p className="text-muted-foreground text-sm">
            Drag-and-drop components, inspect hierarchy, and preview layouts.
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-full"
            onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))}
            aria-label="Zoom out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-sm tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-full"
            onClick={() => setZoom((value) => Math.min(2, value + 0.1))}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="btn-ghost inline-flex h-9 w-9 items-center justify-center rounded-full"
            onClick={toggleFullScreen}
            aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isFullScreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>
      <div
        className={`border-border grid gap-4 rounded-2xl border bg-card p-4 ${
          isFullScreen ? 'fixed inset-6 z-50 bg-background shadow-2xl' : ''
        }`}
        style={isFullScreen ? undefined : { minHeight: height }}
      >
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div
            className="border-border relative overflow-hidden rounded-xl border bg-muted/40"
            style={{ minHeight: height }}
          >
            <div
              className="absolute inset-0 origin-top-left p-8 transition-transform"
              style={{ transform: `scale(${zoom})` }}
            >
              {nodes.length ? (
                <div className="grid gap-4">
                  {nodes.map((node) => (
                    <CanvasNodeCard
                      key={node.id}
                      node={node}
                      depth={0}
                      selectedNodeId={selectedNodeId}
                      onSelectNode={onSelectNode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3 text-center">
                  <Square className="h-8 w-8" />
                  <p className="text-base font-medium">
                    Empty canvas – start by adding a component.
                  </p>
                </div>
              )}
            </div>
          </div>
          <aside className="space-y-3 rounded-xl border border-border bg-background p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Component tree
              </p>
              <span className="text-muted-foreground text-xs">
                {nodes.length} root node{nodes.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="space-y-2 overflow-y-auto" style={{ maxHeight: height - 96 }}>
              {nodes.length ? (
                nodes.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    selectedNodeId={selectedNodeId}
                    onSelectNode={onSelectNode}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Add a component to see the hierarchy.
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

interface CanvasNodeCardProps {
  node: ComponentNode;
  depth: number;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
}

function CanvasNodeCard({
  node,
  depth,
  selectedNodeId,
  onSelectNode,
}: CanvasNodeCardProps) {
  return (
    <div
      className={`rounded-xl border bg-card p-4 shadow-sm transition ${
        selectedNodeId === node.id
          ? 'border-primary shadow-primary/20'
          : 'border-border'
      }`}
      style={{ marginLeft: depth * 12 }}
      role="button"
      tabIndex={0}
      onClick={() => onSelectNode?.(node.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelectNode?.(node.id);
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{node.type}</p>
          <p className="text-muted-foreground text-xs">
            {Object.keys(node.props ?? {}).length} props
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {node.id.slice(0, 6)}
        </span>
      </div>
      {node.children?.length ? (
        <p className="text-muted-foreground mt-2 text-xs">
          {node.children.length} child component
          {node.children.length === 1 ? '' : 's'}
        </p>
      ) : null}
    </div>
  );
}

interface TreeNodeProps {
  node: ComponentNode;
  depth: number;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
}

function TreeNode({
  node,
  depth,
  selectedNodeId,
  onSelectNode,
}: TreeNodeProps) {
  const isSelected = node.id === selectedNodeId;
  return (
    <div>
      <button
        type="button"
        className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm ${
          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40'
        }`}
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => onSelectNode?.(node.id)}
      >
        <span className="font-medium">{node.type}</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          {node.children?.length ?? 0}
        </span>
      </button>
      {node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
        />
      ))}
    </div>
  );
}

