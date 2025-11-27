'use client';

import { describe, expect, it, beforeEach, vi } from 'bun:test';
import { registerStudioSchema } from './studio';
import type { Context } from '../types';
import { prismaMock } from '../../../__tests__/mocks/prisma';

const deployProjectMock = vi.fn();
const saveDraftMock = vi.fn();
const deployVersionMock = vi.fn();
const undoVersionMock = vi.fn();

vi.mock('../../deployment/orchestrator', () => ({
  DeploymentOrchestrator: class {
    deployProject = deployProjectMock;
  },
}));

vi.mock('../../../modules/visual-builder/versioning', () => ({
  CanvasVersionManager: class {
    saveDraft = saveDraftMock;
    deploy = deployVersionMock;
    undo = undoVersionMock;
  },
}));

class BuilderStub {
  queryFieldsMap: Record<string, any> = {};
  mutationFieldsMap: Record<string, any> = {};
  private argBuilder = Object.assign((config: any) => config, {
    string: () => ({}),
    boolean: () => ({}),
    int: () => ({}),
    id: () => ({}),
  });

  enumType() {
    return {};
  }

  objectRef() {
    return {
      implement: () => ({}),
    };
  }

  inputType(
    _name: string,
    config: { fields: (t: any) => Record<string, unknown> }
  ) {
    const fieldBuilder = {
      string: () => ({}),
      field: () => ({}),
      boolean: () => ({}),
      int: () => ({}),
    };
    config.fields(fieldBuilder);
    return {};
  }

  queryFields(
    cb: (t: { field: (config: any) => any; arg: any }) => Record<string, any>
  ) {
    const fields = cb({
      field: (config) => config,
      arg: this.argBuilder,
    });
    Object.assign(this.queryFieldsMap, fields);
  }

  mutationFields(
    cb: (t: { field: (config: any) => any; arg: any }) => Record<string, any>
  ) {
    const fields = cb({
      field: (config) => config,
      arg: this.argBuilder,
    });
    Object.assign(this.mutationFieldsMap, fields);
  }
}

const builder = new BuilderStub();
registerStudioSchema(builder as any);

const baseCtx: Context = {
  user: {
    id: 'user-1',
    organizationId: 'org-1',
  } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {
    studio_dedicated_deployment: true,
  },
};

describe('studio GraphQL module', () => {
  beforeEach(() => {
    deployProjectMock.mockReset();
    saveDraftMock.mockReset();
    deployVersionMock.mockReset();
    undoVersionMock.mockReset();
  });

  it('returns studio projects scoped to the organization', async () => {
    prismaMock.studioProject.findMany.mockResolvedValue([
      { id: 'proj-1', organizationId: 'org-1' },
    ] as any);

    const resolver = builder.queryFieldsMap.myStudioProjects.resolve;
    const result = await resolver({}, {}, baseCtx);

    expect(prismaMock.studioProject.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org-1' },
      })
    );
    expect(result).toHaveLength(1);
  });

  it('creates a studio project for the user org', async () => {
    prismaMock.studioProject.create.mockResolvedValue({
      id: 'proj-2',
      organizationId: 'org-1',
    } as any);

    const resolver = builder.mutationFieldsMap.createStudioProject.resolve;
    const result = await resolver(
      {},
      { input: { name: 'Demo', tier: 'STARTER' } },
      baseCtx
    );

    expect(prismaMock.studioProject.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        organizationId: 'org-1',
        name: 'Demo',
      }),
    });
    expect(result.id).toBe('proj-2');
  });

  it('updates a studio project after ensuring access', async () => {
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-3',
      organizationId: 'org-1',
    } as any);
    prismaMock.studioProject.update.mockResolvedValue({
      id: 'proj-3',
      name: 'Updated',
    } as any);

    const resolver = builder.mutationFieldsMap.updateStudioProject.resolve;
    const updated = await resolver(
      {},
      { id: 'proj-3', input: { name: 'Updated' } },
      baseCtx
    );

    expect(prismaMock.studioProject.update).toHaveBeenCalledWith({
      where: { id: 'proj-3' },
      data: expect.objectContaining({ name: 'Updated' }),
    });
    expect(updated.name).toBe('Updated');
  });

  it('deploys a studio project through the orchestrator', async () => {
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-4',
      organizationId: 'org-1',
      deploymentMode: 'SHARED',
    } as any);
    deployProjectMock.mockResolvedValue({ id: 'deploy-1' });

    const resolver = builder.mutationFieldsMap.deployStudioProject.resolve;
    const result = await resolver(
      {},
      { input: { projectId: 'proj-4', environment: 'DEVELOPMENT' } },
      baseCtx
    );

    expect(deployProjectMock).toHaveBeenCalled();
    expect(result).toEqual({ id: 'deploy-1' });
  });

  it('rejects access when user context is missing', async () => {
    const resolver = builder.queryFieldsMap.myStudioProjects.resolve;
    await expect(
      resolver({}, {}, { ...baseCtx, user: undefined })
    ).rejects.toThrow(/Unauthorized/);
  });

  it('saves a canvas draft via the version manager', async () => {
    const snapshot = {
      id: 'ver-1',
      label: 'Draft #1',
      status: 'draft',
      nodes: [],
      createdAt: new Date().toISOString(),
    };
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-1',
      projectId: 'proj-1',
    } as any);
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-1',
      organizationId: 'org-1',
    } as any);
    saveDraftMock.mockResolvedValue(snapshot);

    const resolver = builder.mutationFieldsMap.saveCanvasDraft.resolve;
    const result = await resolver(
      {},
      { input: { canvasId: 'canvas-1', nodes: [], label: 'Draft #1' } },
      baseCtx
    );

    expect(prismaMock.studioOverlay.findUnique).toHaveBeenCalledWith({
      where: { id: 'canvas-1' },
      select: { projectId: true },
    });
    expect(prismaMock.studioProject.findFirst).toHaveBeenCalledWith({
      where: { id: 'proj-1', organizationId: 'org-1' },
    });
    expect(saveDraftMock).toHaveBeenCalledWith(
      'canvas-1',
      [],
      expect.objectContaining({ label: 'Draft #1', userId: 'user-1' })
    );
    expect(result).toEqual(snapshot);
  });

  it('deploys a canvas version after ensuring access', async () => {
    const snapshot = {
      id: 'ver-2',
      label: 'Draft #2',
      status: 'deployed',
      nodes: [],
      createdAt: new Date().toISOString(),
    };
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-2',
      projectId: 'proj-2',
    } as any);
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-2',
      organizationId: 'org-1',
    } as any);
    deployVersionMock.mockResolvedValue(snapshot);

    const resolver = builder.mutationFieldsMap.deployCanvasVersion.resolve;
    const result = await resolver(
      {},
      { input: { canvasId: 'canvas-2', versionId: 'ver-2' } },
      baseCtx
    );

    expect(deployVersionMock).toHaveBeenCalledWith('canvas-2', 'ver-2');
    expect(result).toEqual(snapshot);
  });

  it('undoes the latest canvas version and returns the previous snapshot', async () => {
    const previous = {
      id: 'ver-3',
      label: 'Draft #3',
      status: 'draft',
      nodes: [],
      createdAt: new Date().toISOString(),
    };
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-3',
      projectId: 'proj-3',
    } as any);
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-3',
      organizationId: 'org-1',
    } as any);
    undoVersionMock.mockResolvedValue(previous);

    const resolver = builder.mutationFieldsMap.undoCanvasVersion.resolve;
    const result = await resolver(
      {},
      { input: { canvasId: 'canvas-3' } },
      baseCtx
    );

    expect(undoVersionMock).toHaveBeenCalledWith('canvas-3');
    expect(result).toEqual(previous);
  });
});
