import { randomUUID } from 'node:crypto';
import {
  prisma,
  type StudioOverlay,
  type Prisma,
} from '@lssm/lib.database-contractspec-studio';

export interface ComponentDefinition {
  type: string;
  props?: Record<string, unknown>;
  children?: ComponentDefinition[];
}

export interface ComponentNode extends ComponentDefinition {
  id: string;
  children?: ComponentNode[];
}

export interface CanvasState {
  id: string;
  projectId: string;
  nodes: ComponentNode[];
  updatedAt: string;
}

export interface GeneratedCode {
  components: number;
  files: { path: string; contents: string }[];
}

const CANVAS_OVERLAY_NAME = 'visual-builder.canvas';

export class VisualBuilderModule {
  async renderCanvas(projectId: string): Promise<CanvasState> {
    const { state } = await this.ensureCanvas(projectId);
    return state;
  }

  async addComponent(
    canvasId: string,
    component: ComponentDefinition
  ): Promise<ComponentNode> {
    const overlay = await this.getCanvasOverlay(canvasId);
    const state = this.normalizeState(overlay);
    const node = this.toNode(component);
    state.nodes.push(node);
    await this.persistState(overlay.id, state);
    return node;
  }

  async updateComponent(
    canvasId: string,
    nodeId: string,
    patch: Partial<ComponentDefinition>
  ): Promise<ComponentNode> {
    const overlay = await this.getCanvasOverlay(canvasId);
    const state = this.normalizeState(overlay);
    const node = this.findNode(state.nodes, nodeId);
    if (!node) {
      throw new Error(`Component ${nodeId} not found on canvas ${canvasId}`);
    }
    if (patch.type) node.type = patch.type;
    if (patch.props) node.props = { ...node.props, ...patch.props };
    if (patch.children) {
      node.children = patch.children.map((child) => this.toNode(child));
    }
    await this.persistState(overlay.id, state);
    return node;
  }

  async generateCode(canvasId: string): Promise<GeneratedCode> {
    const overlay = await this.getCanvasOverlay(canvasId);
    const state = this.normalizeState(overlay);
    const code = this.renderNodes(state.nodes, 0).join('\n');
    return {
      components: state.nodes.length,
      files: [
        {
          path: 'StudioCanvas.tsx',
          contents: [
            "import React from 'react';",
            '',
            'export const StudioCanvas = () => {',
            '  return (',
            `    <>`,
            code
              .split('\n')
              .map((line) => `      ${line}`)
              .join('\n'),
            '    </>',
            '  );',
            '};',
            '',
          ].join('\n'),
        },
      ],
    };
  }

  private async ensureCanvas(projectId: string) {
    let overlay = await prisma.studioOverlay.findFirst({
      where: { projectId, name: CANVAS_OVERLAY_NAME },
    });

    if (!overlay) {
      overlay = await prisma.studioOverlay.create({
        data: {
          projectId,
          name: CANVAS_OVERLAY_NAME,
          content: this.defaultState(projectId) as Prisma.JsonValue,
        },
      });
    }

    return { overlay, state: this.normalizeState(overlay) };
  }

  private async getCanvasOverlay(canvasId: string): Promise<StudioOverlay> {
    const overlay = await prisma.studioOverlay.findUnique({
      where: { id: canvasId },
    });
    if (!overlay) {
      throw new Error(`Canvas overlay ${canvasId} not found`);
    }
    return overlay;
  }

  private normalizeState(overlay: StudioOverlay): CanvasState {
    if (
      overlay.content &&
      typeof overlay.content === 'object' &&
      'nodes' in overlay.content
    ) {
      const state = overlay.content as CanvasState;
      return { ...state, id: overlay.id, projectId: overlay.projectId };
    }
    return this.defaultState(overlay.projectId, overlay.id);
  }

  private defaultState(
    projectId: string,
    overlayId?: string
  ): CanvasState {
    return {
      id: overlayId ?? randomUUID(),
      projectId,
      nodes: [],
      updatedAt: new Date().toISOString(),
    };
  }

  private async persistState(canvasId: string, state: CanvasState) {
    state.updatedAt = new Date().toISOString();
    await prisma.studioOverlay.update({
      where: { id: canvasId },
      data: { content: state as Prisma.JsonValue },
    });
  }

  private findNode(
    nodes: ComponentNode[],
    nodeId: string
  ): ComponentNode | undefined {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      const child = node.children ? this.findNode(node.children, nodeId) : null;
      if (child) return child;
    }
    return undefined;
  }

  private toNode(definition: ComponentDefinition): ComponentNode {
    return {
      id: randomUUID(),
      type: definition.type,
      props: definition.props ?? {},
      children: definition.children?.map((child) => this.toNode(child)),
    };
  }

  private renderNodes(nodes: ComponentNode[], depth: number): string[] {
    if (!nodes.length) return ['<></>'];
    const indent = '  '.repeat(depth);
    return nodes.flatMap((node) => {
      const props = Object.entries(node.props ?? {})
        .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
        .join(' ');
      const open = props ? `<${node.type} ${props}>` : `<${node.type}>`;
      if (!node.children || node.children.length === 0) {
        return [`${indent}${open}</${node.type}>`];
      }
      return [
        `${indent}${open}`,
        ...this.renderNodes(node.children, depth + 1),
        `${indent}</${node.type}>`,
      ];
    });
  }
}

