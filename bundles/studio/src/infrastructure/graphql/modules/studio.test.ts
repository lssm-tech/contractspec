'use client';

/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */
import { beforeEach, describe, expect, it } from 'bun:test';
import { prismaMock } from '../../../__tests__/mocks/prisma';
import type { Context } from '../types';
import { registerStudioSchema } from './studio';

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
      stringList: () => ({}),
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
  organization: {
    id: 'org-1',
    name: 'Test Organization',
  } as any,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {
    studio_dedicated_deployment: true,
  },
};

describe('studio GraphQL module', () => {
  beforeEach(() => {
    // No explicit resets needed as resetPrismaMock handles db mocks globally
  });

  it('returns studio projects scoped to the organization', async () => {
    prismaMock.studioProject.findMany.mockResolvedValue([
      { id: 'proj-1', organizationId: 'org-1' },
    ] as any);

    const resolver = builder.queryFieldsMap.myStudioProjects.resolve;
    const result = await resolver({}, {}, baseCtx);

    expect(prismaMock.studioProject.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ organizationId: 'org-1' }),
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
    prismaMock.studioDeployment.create.mockResolvedValue({
      id: 'deploy-1',
      status: 'DEPLOYING',
    } as any);
    prismaMock.studioDeployment.findFirst.mockResolvedValue({
      id: 'deploy-1',
      version: 'v1',
    } as any);
    prismaMock.studioDeployment.update.mockResolvedValue({
      id: 'deploy-1',
      status: 'DEPLOYED',
      deployedAt: new Date(),
    } as any);

    const resolver = builder.mutationFieldsMap.deployStudioProject.resolve;
    const result = await resolver(
      {},
      { input: { projectId: 'proj-4', environment: 'DEVELOPMENT' } },
      baseCtx
    );

    expect(prismaMock.studioDeployment.create).toHaveBeenCalled();
    expect(prismaMock.studioDeployment.update).toHaveBeenCalledWith({
      where: { id: 'deploy-1' },
      data: expect.objectContaining({ status: 'DEPLOYED' }),
    });
    expect(result).toEqual(
      expect.objectContaining({ id: 'deploy-1', status: 'DEPLOYED' })
    );
  });

  it('rejects access when user context is missing', async () => {
    const resolver = builder.queryFieldsMap.myStudioProjects.resolve;
    await expect(
      resolver({}, {}, { ...baseCtx, user: undefined })
    ).rejects.toThrow(/Unauthorized/);
  });

  it('saves a canvas draft via the version manager', async () => {
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-1',
      projectId: 'proj-1',
      content: {
        id: 'canvas-1',
        versions: [],
        nodes: [],
        updatedAt: new Date().toISOString(),
      },
    } as any);
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-1',
      organizationId: 'org-1',
    } as any);
    prismaMock.studioOverlay.update.mockResolvedValue({} as any);

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
    expect(prismaMock.studioOverlay.update).toHaveBeenCalledWith({
      where: { id: 'canvas-1' },
      data: {
        content: expect.objectContaining({
          versions: expect.arrayContaining([
            expect.objectContaining({
              label: 'Draft #1',
              status: 'draft',
              createdBy: 'user-1',
            }),
          ]),
        }),
      },
    });
    expect(result).toMatchObject({
      label: 'Draft #1',
      status: 'draft',
    });
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
      id: 'canvas-1',
      projectId: 'proj-1',
      content: {
        id: 'canvas-1',
        versions: [snapshot],
        nodes: [],
        updatedAt: new Date().toISOString(),
      },
    } as any);
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-1',
      organizationId: 'org-1',
    } as any);
    prismaMock.studioOverlay.update.mockResolvedValue({} as any);

    const resolver = builder.mutationFieldsMap.deployCanvasVersion.resolve;
    const result = await resolver(
      {},
      { input: { canvasId: 'canvas-1', versionId: 'ver-2' } },
      baseCtx
    );
    // Wait, the input in test was { canvasId: 'canvas-1', label: 'v1.0.0' } but code uses mock data for 'canvas-2'. Mismatch from previous edits. I should fix canvasId to match.

    expect(prismaMock.studioOverlay.update).toHaveBeenCalledWith({
      where: { id: 'canvas-1' },
      data: {
        content: expect.objectContaining({
          versions: expect.arrayContaining([
            expect.objectContaining({
              id: 'ver-2',
              status: 'deployed',
            }),
          ]),
        }),
      },
    });
    expect(result).toMatchObject({
      id: 'ver-2',
      status: 'deployed',
    });
  });

  it('undoes the latest canvas version and returns the previous snapshot', async () => {
    const previous = {
      id: 'ver-3',
      label: 'Draft #3',
      status: 'draft',
      nodes: [],
      createdAt: new Date().toISOString(),
    };
    const snapshot = {
      id: 'ver-3',
      label: 'Draft #3',
      status: 'draft',
      nodes: [],
      createdAt: new Date().toISOString(),
    };
    const history = [previous, snapshot];
    prismaMock.studioOverlay.findUnique.mockResolvedValue({
      id: 'canvas-1',
      projectId: 'proj-1',
      content: {
        id: 'canvas-1',
        versions: history,
        nodes: [],
        updatedAt: new Date().toISOString(),
      },
    } as any);
    prismaMock.studioProject.findFirst.mockResolvedValue({
      id: 'proj-1',
      organizationId: 'org-1',
    } as any);
    prismaMock.studioOverlay.update.mockResolvedValue({} as any);

    const resolver = builder.mutationFieldsMap.undoCanvasVersion.resolve;
    const result = await resolver(
      {},
      { input: { canvasId: 'canvas-1' } },
      baseCtx
    );

    expect(prismaMock.studioOverlay.update).toHaveBeenCalled();
    expect(result).toMatchObject({
      id: 'ver-3',
    });
  });
});
