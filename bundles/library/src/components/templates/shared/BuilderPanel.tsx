'use client';

import { useEffect, useCallback } from 'react';
import { Button, LoaderBlock } from '@contractspec/lib.design-system';
import type { TemplateId } from '../../../lib/registry';
import { useCanvasState } from './hooks/useCanvasState';

// Note: StudioCanvas is imported dynamically in the parent component

export interface StudioCanvasProps {
  state: {
    id: string;
    projectId: string;
    nodes: {
      id: string;
      type: string;
      props?: Record<string, unknown>;
      children?: {
        id: string;
        type: string;
        props?: Record<string, unknown>;
      }[];
    }[];
    updatedAt: string;
    versions: {
      id: string;
      label: string;
      status: 'draft' | 'deployed';
      nodes: {
        id: string;
        type: string;
        props?: Record<string, unknown>;
      }[];
      createdAt: string;
    }[];
  };
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
}

export interface BuilderPanelProps {
  templateId: TemplateId;
  /** StudioCanvas component passed as a prop (for dynamic import compatibility) */
  StudioCanvas: React.ComponentType<StudioCanvasProps>;
  /** Callback for logging actions */
  onLog?: (message: string) => void;
}

/**
 * Builder panel that wraps StudioCanvas with persisted canvas state.
 * Uses useCanvasState hook to manage canvas persistence.
 */
export function BuilderPanel({
  templateId,
  StudioCanvas,
  onLog,
}: BuilderPanelProps) {
  const {
    canvasState,
    loading,
    selectedNodeId,
    setSelectedNodeId,
    addNode,
    saveDraft,
    resetCanvas,
  } = useCanvasState(templateId);

  // Log canvas state changes
  useEffect(() => {
    if (!loading && canvasState.nodes.length > 0) {
      onLog?.(`Canvas loaded with ${canvasState.nodes.length} nodes`);
    }
  }, [loading, canvasState.nodes.length, onLog]);

  const handleSelectNode = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      onLog?.(`Selected node ${nodeId}`);
    },
    [setSelectedNodeId, onLog]
  );

  const handleSaveDraft = useCallback(() => {
    saveDraft();
    onLog?.('Draft saved');
  }, [saveDraft, onLog]);

  const handleResetCanvas = useCallback(() => {
    resetCanvas();
    onLog?.('Canvas reset to template defaults');
  }, [resetCanvas, onLog]);

  const handleAddCard = useCallback(() => {
    const node = addNode({
      type: 'Card',
      props: { heading: 'New Card', body: 'Click to edit' },
    });
    onLog?.(`Added new card: ${node.id}`);
  }, [addNode, onLog]);

  if (loading) {
    return <LoaderBlock label="Loading canvas..." />;
  }

  return (
    <div className="space-y-4">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onPress={handleAddCard}>
            + Add Card
          </Button>
          <Button variant="outline" size="sm" onPress={handleSaveDraft}>
            Save Draft
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {canvasState.nodes.length} nodes • {canvasState.versions.length}{' '}
            versions
          </span>
          <Button variant="ghost" size="sm" onPress={handleResetCanvas}>
            Reset
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <StudioCanvas
        state={canvasState}
        selectedNodeId={selectedNodeId}
        onSelectNode={handleSelectNode}
      />
    </div>
  );
}
