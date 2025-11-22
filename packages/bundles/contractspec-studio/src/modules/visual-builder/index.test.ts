import { describe, expect, it, beforeEach, vi } from 'vitest';
import * as crypto from 'node:crypto';
import { VisualBuilderModule } from './index';
import { prismaMock } from '../../__tests__/mocks/prisma';

const randomUUIDSpy = vi.spyOn(crypto, 'randomUUID');

describe('VisualBuilderModule', () => {
  const module = new VisualBuilderModule();

  beforeEach(() => {
    randomUUIDSpy.mockReturnValue('generated-node-id');
  });

  it('creates a canvas overlay when rendering for the first time', async () => {
    prismaMock.studioOverlay.findFirst.mockResolvedValue(null);
    prismaMock.studioOverlay.create.mockResolvedValue({
      id: 'canvas-1',
      projectId: 'project-1',
      content: null,
    } as any);

    const canvas = await module.renderCanvas('project-1');

    expect(prismaMock.studioOverlay.create).toHaveBeenCalled();
    expect(canvas.projectId).toBe('project-1');
    expect(canvas.nodes).toEqual([]);
  });

  it('adds a component to the canvas state', async () => {
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-1',
      projectId: 'project-1',
      content: {
        id: 'canvas-1',
        projectId: 'project-1',
        nodes: [],
        updatedAt: new Date().toISOString(),
      },
    } as any);

    const node = await module.addComponent('canvas-1', {
      type: 'Hero',
      props: { title: 'Hello' },
    });

    expect(node).toMatchObject({ type: 'Hero', props: { title: 'Hello' } });
    expect(prismaMock.studioOverlay.update).toHaveBeenCalledWith({
      where: { id: 'canvas-1' },
      data: {
        content: expect.objectContaining({
          nodes: expect.arrayContaining([
            expect.objectContaining({ type: 'Hero' }),
          ]),
        }),
      },
    });
  });

  it('updates an existing component by id', async () => {
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-1',
      projectId: 'project-1',
      content: {
        id: 'canvas-1',
        projectId: 'project-1',
        nodes: [
          {
            id: 'node-1',
            type: 'Hero',
            props: { title: 'Old' },
          },
        ],
        updatedAt: new Date().toISOString(),
      },
    } as any);

    const updated = await module.updateComponent('canvas-1', 'node-1', {
      props: { title: 'Updated' },
    });

    expect(updated.props).toMatchObject({ title: 'Updated' });
    expect(prismaMock.studioOverlay.update).toHaveBeenCalled();
  });

  it('generates code artifacts from canvas state', async () => {
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-1',
      projectId: 'project-1',
      content: {
        id: 'canvas-1',
        projectId: 'project-1',
        nodes: [
          {
            id: 'node-1',
            type: 'Hero',
            props: { title: 'Welcome' },
          },
        ],
        updatedAt: new Date().toISOString(),
      },
    } as any);

    const result = await module.generateCode('canvas-1');

    expect(result.components).toBe(1);
    expect(result.files[0]?.path).toBe('StudioCanvas.tsx');
    expect(result.files[0]?.contents).toContain('Hero');
  });
});

