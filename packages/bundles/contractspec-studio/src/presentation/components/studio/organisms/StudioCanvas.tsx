import * as React from 'react';
import {
  GripVertical,
  Maximize2,
  Minimize2,
  Square,
  Trash2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type {
  CanvasState,
  ComponentDefinition,
  ComponentNode,
} from '../../../../modules/visual-builder';
import { useStudioFeatureFlag } from '../../../hooks/studio';
import { ContractSpecFeatureFlags } from '@lssm/lib.progressive-delivery';
import { FeatureGateNotice } from '../../shared/FeatureGateNotice';
import { PropertyEditor } from '../molecules/PropertyEditor';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// import { Button } from '@lssm/lib.design-system';
import { Button } from '@lssm/lib.ui-kit-web/ui/button';
import { cn } from '@lssm/lib.ui-kit-core';

export interface StudioCanvasProps {
  state: CanvasState;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  onFocusTree?: () => void;
  height?: number;
  onAddNode?: (node: ComponentNode, parentId?: string) => void;
  onDeleteNode?: (nodeId: string) => void;
  onUpdateNode?: (nodeId: string, updates: Partial<ComponentNode>) => void;
  onReorderNodes?: (nodes: ComponentNode[]) => void;
  onSaveDraft?: () => Promise<void> | void;
  onDeploy?: () => Promise<void> | void;
  onUndo?: () => Promise<void> | void;
  canUndo?: boolean;
  isDraft?: boolean;
}

export function StudioCanvas({
  state,
  selectedNodeId,
  onSelectNode,
  onFocusTree,
  height = 560,
  onAddNode,
  onDeleteNode,
  onUpdateNode,
  onReorderNodes,
  onSaveDraft,
  onDeploy,
  onUndo,
  canUndo,
  isDraft,
}: StudioCanvasProps) {
  const [zoom, setZoom] = React.useState(1);
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  const visualBuilderEnabled = useStudioFeatureFlag(
    ContractSpecFeatureFlags.STUDIO_VISUAL_BUILDER
  );
  const [nodes, setNodes] = React.useState<ComponentNode[]>(state.nodes ?? []);
  const [internalSelectedId, setInternalSelectedId] = React.useState<
    string | undefined
  >(selectedNodeId);
  const sensors = useSensors(useSensor(PointerSensor));

  React.useEffect(() => {
    setNodes(state.nodes ?? []);
  }, [state.nodes]);

  React.useEffect(() => {
    setInternalSelectedId(selectedNodeId);
  }, [selectedNodeId]);

  const activeNode = React.useMemo(
    () => (internalSelectedId ? findNodeById(nodes, internalSelectedId) : null),
    [nodes, internalSelectedId]
  );

  const handleSelectNode = (nodeId: string) => {
    setInternalSelectedId(nodeId);
    onSelectNode?.(nodeId);
  };

  const handleDropComponent = (
    definition: ComponentDefinition,
    parentId?: string
  ) => {
    const newNode = createNodeFromDefinition(definition);
    setNodes((prev) => {
      const next = parentId
        ? addChildNode(prev, parentId, newNode)
        : [...prev, newNode];
      return next;
    });
    setInternalSelectedId(newNode.id);
    onSelectNode?.(newNode.id);
    onAddNode?.(newNode, parentId);
  };

  const handleDropEvent = (
    event: React.DragEvent<HTMLElement>,
    parentId?: string
  ) => {
    event.preventDefault();
    const payload = event.dataTransfer.getData('application/json');
    if (!payload) return;
    try {
      const definition = JSON.parse(payload) as ComponentDefinition;
      if (!definition?.type) return;
      handleDropComponent(definition, parentId);
    } catch {
      // ignore invalid payload
    }
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((prev) => removeNode(prev, nodeId));
    if (internalSelectedId === nodeId) {
      setInternalSelectedId(undefined);
    }
    onDeleteNode?.(nodeId);
  };

  const handlePropertyChange = (updates: Partial<ComponentNode>) => {
    if (!internalSelectedId) return;
    setNodes((prev) => updateNode(prev, internalSelectedId, updates));
    onUpdateNode?.(internalSelectedId, updates);
  };

  const allowDrop = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setNodes((items) => {
      const oldIndex = items.findIndex((node) => node.id === String(active.id));
      const newIndex = items.findIndex((node) => node.id === String(over.id));
      if (oldIndex === -1 || newIndex === -1) return items;
      const reordered = arrayMove(items, oldIndex, newIndex);
      onReorderNodes?.(reordered);
      return reordered;
    });
  };

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
          <p className="text-muted-foreground text-xs">
            Drag blocks from the palette to add them here. Drop on a node to
            nest components.
          </p>
        </div>
        <div className="inline-flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => setZoom((value) => Math.max(0.5, value - 0.1))}
            aria-label="Zoom out"
          >
            <ZoomOut className="text-blue h-4 w-4" />
          </Button>
          <span className="text-sm tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            onClick={() => setZoom((value) => Math.min(2, value + 0.1))}
            aria-label="Zoom in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            onClick={toggleFullScreen}
            aria-label={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isFullScreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>
      <div
        className={cn(
          'border-border bg-card grid gap-4 rounded-2xl border p-4',
          isFullScreen && 'bg-background fixed inset-6 z-50 shadow-2xl'
        )}
        style={isFullScreen ? undefined : { minHeight: height }}
      >
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div
            className="border-border bg-muted/40 relative overflow-hidden rounded-xl border"
            style={{ minHeight: height }}
            onDragOver={allowDrop}
            onDrop={(event) => handleDropEvent(event)}
          >
            <div
              className="absolute inset-0 origin-top-left p-8 transition-transform"
              style={{ transform: `scale(${zoom})` }}
            >
              {nodes.length ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
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
                          selectedNodeId={internalSelectedId}
                          onSelectNode={handleSelectNode}
                          onDeleteNode={handleDeleteNode}
                          onDropComponent={(event) =>
                            handleDropEvent(event, node.id)
                          }
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
          <aside className="border-border bg-background space-y-4 rounded-xl border p-4">
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
              style={{ maxHeight: height - 200 }}
              onDragOver={allowDrop}
            >
              {nodes.length ? (
                nodes.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    depth={0}
                    selectedNodeId={internalSelectedId}
                    onSelectNode={handleSelectNode}
                    onDropComponent={(event) => handleDropEvent(event, node.id)}
                  />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">
                  Add a component to see the hierarchy.
                </p>
              )}
            </div>
            <PropertyEditor
              node={activeNode ?? null}
              onChange={handlePropertyChange}
            />
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
  onDeleteNode?: (nodeId: string) => void;
  onDropComponent?: (
    event: React.DragEvent<HTMLElement>,
    nodeId: string
  ) => void;
}

function CanvasNodeCard({
  node,
  depth,
  selectedNodeId,
  onSelectNode,
  dragHandleProps,
  isDragging,
  onDeleteNode,
  onDropComponent,
}: CanvasNodeCardProps) {
  const handleDrop = (event: React.DragEvent<HTMLElement>) => {
    if (!onDropComponent) return;
    event.preventDefault();
    event.stopPropagation();
    onDropComponent(event, node.id);
  };

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
      onDragOver={
        onDropComponent
          ? (event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'copy';
            }
          : undefined
      }
      onDrop={onDropComponent ? handleDrop : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">{node.type}</p>
          <p className="text-muted-foreground text-xs">
            {Object.keys(node.props ?? {}).length} props
          </p>
        </div>
        <div className="inline-flex items-center gap-1">
          {dragHandleProps ? (
            <Button
              variant="ghost"
              {...dragHandleProps}
              aria-label="Reorder component"
            >
              <GripVertical className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-muted-foreground font-mono text-xs">
              {node.id.slice(0, 6)}
            </span>
          )}
          {onDeleteNode ? (
            <Button
              variant="ghost"
              aria-label={`Delete ${node.type}`}
              onClick={(event) => {
                event.stopPropagation();
                onDeleteNode(node.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
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
  onDropComponent?: (
    event: React.DragEvent<HTMLElement>,
    nodeId: string
  ) => void;
}

function TreeNode({
  node,
  depth,
  selectedNodeId,
  onSelectNode,
  onDropComponent,
}: TreeNodeProps) {
  const isSelected = node.id === selectedNodeId;
  return (
    <div
      onDragOver={
        onDropComponent
          ? (event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'copy';
            }
          : undefined
      }
      onDrop={
        onDropComponent
          ? (event) => {
              event.preventDefault();
              event.stopPropagation();
              onDropComponent(event, node.id);
            }
          : undefined
      }
    >
      <Button
        // type="button"
        // className={`flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm ${
        //   isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40'
        // }`}
        className={
          isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40'
        }
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => onSelectNode?.(node.id)}
      >
        <span className="font-medium">{node.type}</span>
        <span className="text-muted-foreground text-xs tracking-wide uppercase">
          {node.children?.length ?? 0}
        </span>
      </Button>
      {node.children?.map((child) => (
        <TreeNode
          key={child.id}
          node={child}
          depth={depth + 1}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          onDropComponent={onDropComponent}
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

const makeNodeId = () =>
  globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2);

function createNodeFromDefinition(
  definition: ComponentDefinition
): ComponentNode {
  return {
    id: makeNodeId(),
    type: definition.type,
    props: definition.props ? { ...definition.props } : {},
    children: definition.children
      ? definition.children.map((child) => createNodeFromDefinition(child))
      : [],
  };
}

function addChildNode(
  nodes: ComponentNode[],
  parentId: string,
  child: ComponentNode
): ComponentNode[] {
  let inserted = false;
  const next = nodes.map((node) => {
    if (node.id === parentId) {
      inserted = true;
      const children = Array.isArray(node.children) ? node.children : [];
      return { ...node, children: [...children, child] };
    }
    if (node.children?.length) {
      const updatedChildren = addChildNode(node.children, parentId, child);
      if (updatedChildren !== node.children) {
        inserted = true;
        return { ...node, children: updatedChildren };
      }
    }
    return node;
  });
  if (!inserted) {
    return [...nodes, child];
  }
  return next;
}

function removeNode(nodes: ComponentNode[], nodeId: string): ComponentNode[] {
  const result: ComponentNode[] = [];
  for (const node of nodes) {
    if (node.id === nodeId) {
      continue;
    }
    if (node.children?.length) {
      const children = removeNode(node.children, nodeId);
      result.push(children === node.children ? node : { ...node, children });
    } else {
      result.push(node);
    }
  }
  return result;
}

function updateNode(
  nodes: ComponentNode[],
  nodeId: string,
  updates: Partial<ComponentNode>
): ComponentNode[] {
  return nodes.map((node) => {
    if (node.id === nodeId) {
      return {
        ...node,
        ...updates,
        props: updates.props
          ? { ...(node.props ?? {}), ...(updates.props ?? {}) }
          : node.props,
        children:
          updates.children !== undefined ? updates.children : node.children,
      };
    }
    if (node.children?.length) {
      const updatedChildren = updateNode(node.children, nodeId, updates);
      if (updatedChildren !== node.children) {
        return { ...node, children: updatedChildren };
      }
    }
    return node;
  });
}

function findNodeById(
  nodes: ComponentNode[],
  nodeId: string
): ComponentNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;
    if (node.children?.length) {
      const match = findNodeById(node.children, nodeId);
      if (match) return match;
    }
  }
  return null;
}
