import { randomUUID } from 'node:crypto';
import {
  type CanvasState,
  type CanvasVersionSnapshot,
  type ComponentNode,
  VisualBuilderModule,
} from './index';

const MAX_HISTORY = 25;

interface DraftOptions {
  label?: string;
  userId?: string;
}

export class CanvasVersionManager {
  private builder = new VisualBuilderModule();

  async list(canvasId: string): Promise<CanvasVersionSnapshot[]> {
    const { state } = await this.builder.loadCanvasById(canvasId);
    return [...state.versions].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );
  }

  async saveDraft(
    canvasId: string,
    nodes: ComponentNode[],
    options?: DraftOptions
  ): Promise<CanvasVersionSnapshot> {
    const { state } = await this.builder.loadCanvasById(canvasId);
    const timestamp = new Date().toISOString();
    const snapshot: CanvasVersionSnapshot = {
      id: randomUUID(),
      label: options?.label ?? `Draft #${state.versions.length + 1}`,
      status: 'draft',
      nodes: this.cloneNodes(nodes),
      createdAt: timestamp,
      createdBy: options?.userId,
    };
    const history = [...state.versions, snapshot].slice(-MAX_HISTORY);
    state.versions = history;
    state.nodes = this.cloneNodes(nodes);
    state.updatedAt = timestamp;
    await this.builder.saveCanvasState(canvasId, state);
    return snapshot;
  }

  async deploy(
    canvasId: string,
    versionId: string
  ): Promise<CanvasVersionSnapshot> {
    const { state } = await this.builder.loadCanvasById(canvasId);
    const snapshot = state.versions.find((entry) => entry.id === versionId);
    if (!snapshot) {
      throw new Error('Version not found');
    }
    snapshot.status = 'deployed';
    state.nodes = this.cloneNodes(snapshot.nodes);
    state.updatedAt = new Date().toISOString();
    await this.builder.saveCanvasState(canvasId, state);
    return snapshot;
  }

  async undo(canvasId: string): Promise<CanvasVersionSnapshot | null> {
    const { state } = await this.builder.loadCanvasById(canvasId);
    if (!state.versions.length) {
      throw new Error('No versions available for undo');
    }
    const history = [...state.versions];
    history.pop();
    const previous = history.at(-1) ?? null;
    state.versions = history;
    state.nodes = previous ? this.cloneNodes(previous.nodes) : [];
    state.updatedAt = new Date().toISOString();
    await this.builder.saveCanvasState(canvasId, state);
    return previous;
  }

  private cloneNodes(nodes: ComponentNode[]): ComponentNode[] {
    return JSON.parse(JSON.stringify(nodes));
  }
}

