import * as React from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Square,
  GripVertical,
} from 'lucide-react';
import type {
  CanvasState,
  ComponentNode,
} from '../../../../modules/visual-builder';
import { useStudioFeatureFlag } from '../../../hooks/studio';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery';
import { FeatureGateNotice } from '../../shared/FeatureGateNotice';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  const [nodes, setNodes] = React.useState<ComponentNode[]>(state.nodes ?? []);
  const sensors = useSensors(useSensor(PointerSensor));

  React.useEffect(() => {
    setNodes(state.nodes ?? []);
  }, [state.nodes]);

  const toggleFullScreen = () => {
    setIsFullScreen((value) => !value);
    onFocusTree?.();
  };

  if (!visualBuilderEnabled) {
    return (
      <div className="border-border bg-card/40 rounded-2xl border border-dashed p-8 text-center">
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
          <span className="text-sm tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
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
        className={`border-border bg-card grid gap-4 rounded-2xl border p-4 ${
          isFullScreen ? 'bg-background fixed inset-6 z-50 shadow-2xl' : ''
        }`}
        style={isFullScreen ? undefined : { minHeight: height }}
      >
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div
            className="border-border bg-muted/40 relative overflow-hidden rounded-xl border"
            style={{ minHeight: height }}
          >
            <div
              className="absolute inset-0 origin-top-left p-8 transition-transform"
              style={{ transform: `scale(${zoom})` }}
            >
              {nodes.length ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={({ active, over }) => {
                    if (!over || active.id === over.id) return;
                    setNodes((items) => {
                      const oldIndex = items.findIndex(
                        (node) => node.id === active.id
                      );
                      const newIndex = items.findIndex(
                        (node) => node.id === over.id
                      );
                      if (oldIndex === -1 || newIndex === -1) return items;
                      return arrayMove(items, oldIndex, newIndex);
                    });
                  }}
                >
                  <SortableContext
                    items={nodes.map((node) => node.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="grid gap-4">
                      {nodes.map((node) => (
                        <SortableCanvasNode
                          key={node.id}
                          node={node}
                          depth={0}
                          selectedNodeId={selectedNodeId}
                          onSelectNode={onSelectNode}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
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
          <aside className="border-border bg-background space-y-3 rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold tracking-wide uppercase">
                Component tree
              </p>
              <span className="text-muted-foreground text-xs">
                {nodes.length} root node{nodes.length === 1 ? '' : 's'}
              </span>
            </div>
            <div
              className="space-y-2 overflow-y-auto"
              style={{ maxHeight: height - 96 }}
            >
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
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
}

function CanvasNodeCard({
  node,
  depth,
  selectedNodeId,
  onSelectNode,
  dragHandleProps,
  isDragging,
}: CanvasNodeCardProps) {
  return (
    <div
      className={`bg-card rounded-xl border p-4 shadow-sm transition ${
        selectedNodeId === node.id
          ? 'border-primary shadow-primary/20'
          : 'border-border'
      }`}
      style={{
        marginLeft: depth * 12,
        opacity: isDragging ? 0.75 : 1,
        cursor: dragHandleProps ? 'grab' : 'default',
      }}
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
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{node.type}</p>
          <p className="text-muted-foreground text-xs">
            {Object.keys(node.props ?? {}).length} props
          </p>
        </div>
        {dragHandleProps ? (
          <button
            type="button"
            className="btn-ghost inline-flex h-8 w-8 items-center justify-center rounded-full"
            {...dragHandleProps}
            aria-label="Reorder component"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        ) : (
          <span className="text-muted-foreground font-mono text-xs">
            {node.id.slice(0, 6)}
          </span>
        )}
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
        <span className="text-muted-foreground text-xs tracking-wide uppercase">
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

function SortableCanvasNode(props: CanvasNodeCardProps) {
  const { node } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <CanvasNodeCard
        {...props}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}
