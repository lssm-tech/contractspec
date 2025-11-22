'use client';

import { describe, expect, it, beforeEach, vi } from 'vitest';
import { registerStudioSchema } from './studio';
import type { Context } from '../types';
import { prismaMock } from '../../../__tests__/mocks/prisma';

const deployProjectMock = vi.fn();

vi.mock('../../deployment/orchestrator', () => ({
  DeploymentOrchestrator: class {
    deployProject = deployProjectMock;
  },
}));

class BuilderStub {
  queryFieldsMap: Record<string, any> = {};
  mutationFieldsMap: Record<string, any> = {};

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
    cb: (t: { field: (config: any) => any }) => Record<string, any>
  ) {
    const fields = cb({ field: (config) => config });
    Object.assign(this.queryFieldsMap, fields);
  }

  mutationFields(
    cb: (t: { field: (config: any) => any }) => Record<string, any>
  ) {
    const fields = cb({ field: (config) => config });
    Object.assign(this.mutationFieldsMap, fields);
  }
}

const builder = new BuilderStub();
registerStudioSchema(builder as any);

const baseCtx: Context = {
  user: {
    organizationId: 'org-1',
  } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {
    'studio_dedicated_deployment': true,
  },
};

describe('studio GraphQL module', () => {
  beforeEach(() => {
    deployProjectMock.mockReset();
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
    await expect(resolver({}, {}, { ...baseCtx, user: undefined })).rejects.toThrow(
      /Unauthorized/
    );
  });
});

