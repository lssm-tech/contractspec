'use client';

/**
 * dnd-kit adapter for customization mode. Wraps content in DndContext.
 * Requires @dnd-kit/core (optional peer). Falls back to stub when not installed.
 */

import React from 'react';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import type { SurfacePatchOp } from '../spec/types';
import type { DragDropBundleAdapter } from './interfaces';

let _onPatch: (ops: SurfacePatchOp[]) => void = () => {};

function handleDragEnd(event: DragEndEvent) {
  const { active, over } = event;
  if (!over) return;
  const fromId = active.id as string;
  const toSlotId = over.id as string;
  if (fromId && toSlotId) {
    _onPatch([{ op: 'move-node', nodeId: fromId, toSlotId }]);
  }
}

export interface DndWrapperProps {
  children: React.ReactNode;
  mutableSlots: string[];
  onPatch: (ops: SurfacePatchOp[]) => void;
}

function DndWrapperComponent({ children, onPatch }: DndWrapperProps) {
  _onPatch = onPatch;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
}

export const dndKitAdapter: DragDropBundleAdapter = {
  enableSurfaceEditing(args) {
    _onPatch = args.onPatch;
  },
  DndWrapper: DndWrapperComponent,
};
