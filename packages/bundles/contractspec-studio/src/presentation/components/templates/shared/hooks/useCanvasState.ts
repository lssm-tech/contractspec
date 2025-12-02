'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  CanvasState,
  ComponentNode,
  ComponentDefinition,
} from '../../../../../modules/visual-builder';
import type { TemplateId } from '../../../../../templates/registry';
import { generateCanvasFromTemplate } from '../utils/generateCanvasFromTemplate';

/**
 * Storage key prefix for canvas state persistence
 */
const CANVAS_STORAGE_KEY = 'contractspec-canvas-state';

/**
 * Generate a unique ID for canvas nodes
 */
function generateId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Recursively convert ComponentDefinition to ComponentNode
 */
function toComponentNode(definition: ComponentDefinition): ComponentNode {
  return {
    id: generateId(),
    type: definition.type,
    props: definition.props ?? {},
    children: definition.children?.map(toComponentNode),
  };
}

/**
 * Hook return type
 */
export interface UseCanvasStateReturn {
  /** Current canvas state */
  canvasState: CanvasState;
  /** Whether the canvas is loading */
  loading: boolean;
  /** Add a new component node */
  addNode: (component: ComponentDefinition, parentId?: string) => ComponentNode;
  /** Update an existing node */
  updateNode: (nodeId: string, patch: Partial<ComponentDefinition>) => void;
  /** Delete a node */
  deleteNode: (nodeId: string) => void;
  /** Reorder nodes */
  reorderNodes: (nodeIds: string[]) => void;
  /** Save current state as a draft */
  saveDraft: (label?: string) => void;
  /** Reset canvas to initial state */
  resetCanvas: () => void;
  /** Select a node */
  selectedNodeId: string | undefined;
  /** Set selected node */
  setSelectedNodeId: (nodeId: string | undefined) => void;
}

/**
 * Hook for managing persisted canvas state for a template.
 * Uses localStorage for persistence in the sandbox environment.
 */
export function useCanvasState(templateId: TemplateId): UseCanvasStateReturn {
  const [canvasState, setCanvasState] = useState<CanvasState>(() =>
    createInitialState(templateId)
  );
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

  // Load canvas state from storage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const stored = localStorage.getItem(
        `${CANVAS_STORAGE_KEY}-${templateId}`
      );
      if (stored) {
        const parsed = JSON.parse(stored) as CanvasState;
        // Validate the parsed state has required fields
        if (parsed.id && parsed.projectId && Array.isArray(parsed.nodes)) {
          setCanvasState(parsed);
        } else {
          // Invalid stored state, generate from template
          const generated = generateCanvasFromTemplate(templateId);
          setCanvasState(generated);
        }
      } else {
        // No stored state, generate from template
        const generated = generateCanvasFromTemplate(templateId);
        setCanvasState(generated);
      }
    } catch {
      // On error, generate from template
      const generated = generateCanvasFromTemplate(templateId);
      setCanvasState(generated);
    }
    setLoading(false);
  }, [templateId]);

  // Save to storage whenever state changes
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(
          `${CANVAS_STORAGE_KEY}-${templateId}`,
          JSON.stringify(canvasState)
        );
      } catch {
        // Ignore storage errors (e.g., quota exceeded)
      }
    }
  }, [canvasState, templateId, loading]);

  /**
   * Add a new component node
   */
  const addNode = useCallback(
    (component: ComponentDefinition, parentId?: string): ComponentNode => {
      const newNode: ComponentNode = toComponentNode(component);

      setCanvasState((prev) => {
        if (!parentId) {
          // Add to root level
          return {
            ...prev,
            nodes: [...prev.nodes, newNode],
            updatedAt: new Date().toISOString(),
          };
        }

        // Add as child of parent
        const addToParent = (nodes: ComponentNode[]): ComponentNode[] =>
          nodes.map((node) => {
            if (node.id === parentId) {
              return {
                ...node,
                children: [...(node.children ?? []), newNode],
              };
            }
            if (node.children) {
              return {
                ...node,
                children: addToParent(node.children),
              };
            }
            return node;
          });

        return {
          ...prev,
          nodes: addToParent(prev.nodes),
          updatedAt: new Date().toISOString(),
        };
      });

      return newNode;
    },
    []
  );

  /**
   * Update an existing node
   */
  const updateNode = useCallback(
    (nodeId: string, patch: Partial<ComponentDefinition>): void => {
      setCanvasState((prev) => {
        const updateInTree = (nodes: ComponentNode[]): ComponentNode[] =>
          nodes.map((node) => {
            if (node.id === nodeId) {
              return {
                ...node,
                type: patch.type ?? node.type,
                props: patch.props
                  ? { ...node.props, ...patch.props }
                  : node.props,
                children: patch.children
                  ? patch.children.map(toComponentNode)
                  : node.children,
              };
            }
            if (node.children) {
              return {
                ...node,
                children: updateInTree(node.children),
              };
            }
            return node;
          });

        return {
          ...prev,
          nodes: updateInTree(prev.nodes),
          updatedAt: new Date().toISOString(),
        };
      });
    },
    []
  );

  /**
   * Delete a node
   */
  const deleteNode = useCallback((nodeId: string): void => {
    setCanvasState((prev) => {
      const removeFromTree = (nodes: ComponentNode[]): ComponentNode[] =>
        nodes
          .filter((node) => node.id !== nodeId)
          .map((node) => ({
            ...node,
            children: node.children ? removeFromTree(node.children) : undefined,
          }));

      return {
        ...prev,
        nodes: removeFromTree(prev.nodes),
        updatedAt: new Date().toISOString(),
      };
    });

    // Clear selection if deleted node was selected
    setSelectedNodeId((prev) => (prev === nodeId ? undefined : prev));
  }, []);

  /**
   * Reorder nodes at root level
   */
  const reorderNodes = useCallback((nodeIds: string[]): void => {
    setCanvasState((prev) => {
      const nodeMap = new Map(prev.nodes.map((n) => [n.id, n]));
      const reordered = nodeIds
        .map((id) => nodeMap.get(id))
        .filter((n): n is ComponentNode => n !== undefined);

      return {
        ...prev,
        nodes: reordered,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Save current state as a draft version
   */
  const saveDraft = useCallback((label?: string): void => {
    setCanvasState((prev) => {
      const version = {
        id: generateId(),
        label: label ?? `Draft ${prev.versions.length + 1}`,
        status: 'draft' as const,
        nodes: JSON.parse(JSON.stringify(prev.nodes)),
        createdAt: new Date().toISOString(),
      };

      return {
        ...prev,
        versions: [...prev.versions, version],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Reset canvas to initial state (regenerate from template)
   */
  const resetCanvas = useCallback((): void => {
    const generated = generateCanvasFromTemplate(templateId);
    setCanvasState(generated);
    setSelectedNodeId(undefined);
  }, [templateId]);

  return {
    canvasState,
    loading,
    addNode,
    updateNode,
    deleteNode,
    reorderNodes,
    saveDraft,
    resetCanvas,
    selectedNodeId,
    setSelectedNodeId,
  };
}

/**
 * Create initial empty state for a template
 */
function createInitialState(templateId: TemplateId): CanvasState {
  return {
    id: `canvas-${templateId}`,
    projectId: 'sandbox',
    nodes: [],
    updatedAt: new Date().toISOString(),
    versions: [],
  };
}
