import { describe, expect, it, vi } from 'bun:test';
import { registerStudioSchema } from '../../infrastructure/graphql/modules/studio';
import type { Context } from '../../infrastructure/graphql/types';
import { prismaMock } from '../mocks/prisma';

const deployProjectMock = vi.fn();

vi.mock('../../infrastructure/deployment/orchestrator', () => ({
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
    return { implement: () => ({}) };
  }

  objectType() {
    return {};
  }

  inputType() {
    return {};
  }

  private helpers() {
    const argFn = ((config?: any) => config) as any;
    argFn.string = (config?: any) => ({ type: 'String', ...config });
    argFn.boolean = (config?: any) => ({ type: 'Boolean', ...config });
    return {
      field: (config: any) => config,
      arg: argFn,
      string: argFn.string,
      boolean: argFn.boolean,
    };
  }

  queryFields(cb: (t: { field: (config: any) => any }) => Record<string, any>) {
    const fields = cb(this.helpers() as any);
    Object.assign(this.queryFieldsMap, fields);
  }

  mutationFields(
    cb: (t: { field: (config: any) => any }) => Record<string, any>
  ) {
    const fields = cb(this.helpers() as any);
    Object.assign(this.mutationFieldsMap, fields);
  }
}

const builder = new BuilderStub();
registerStudioSchema(builder as any);

const ctx: Context = {
  user: { organizationId: 'org-e2e' } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {
    studio_dedicated_deployment: true,
  },
};

describe('Project lifecycle e2e', () => {
  it('creates a project, adds a spec, and deploys to shared and dedicated targets', async () => {
    prismaMock.studioProject.create.mockResolvedValue({
      id: 'proj-e2e',
      organizationId: 'org-e2e',
    } as any);
    prismaMock.studioSpec.create.mockResolvedValue({
      id: 'spec-e2e',
      projectId: 'proj-e2e',
    } as any);
    prismaMock.studioProject.findFirst.mockImplementation(({ where }) => {
      if (where?.id === 'proj-e2e-shared') {
        return Promise.resolve({
          id: 'proj-e2e-shared',
          organizationId: 'org-e2e',
          deploymentMode: 'SHARED',
        } as any);
      }
      return Promise.resolve({
        id: 'proj-e2e',
        organizationId: 'org-e2e',
        deploymentMode: 'DEDICATED',
      } as any);
    });
    deployProjectMock.mockResolvedValue({ id: 'deploy-1' });

    const createProject = builder.mutationFieldsMap.createStudioProject.resolve;
    const createSpec = builder.mutationFieldsMap.createStudioSpec.resolve;
    const deployProject = builder.mutationFieldsMap.deployStudioProject.resolve;

    const project = await createProject(
      {},
      { input: { name: 'Atlas', tier: 'STARTER' } },
      ctx
    );
    expect(project.id).toBe('proj-e2e');

    const spec = await createSpec(
      {},
      {
        input: {
          projectId: 'proj-e2e',
          type: 'CAPABILITY',
          name: 'Spec',
          version: '1.0.0',
          content: {},
        },
      },
      ctx
    );
    expect(spec.projectId).toBe('proj-e2e');

    await deployProject(
      {},
      { input: { projectId: 'proj-e2e-shared', environment: 'STAGING' } },
      ctx
    );
    await deployProject(
      {},
      { input: { projectId: 'proj-e2e', environment: 'PRODUCTION' } },
      ctx
    );

    expect(deployProjectMock).toHaveBeenCalledTimes(2);
  });
});
