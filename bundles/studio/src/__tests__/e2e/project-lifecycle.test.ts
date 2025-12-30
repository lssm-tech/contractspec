/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */

import { describe, expect, it } from 'bun:test';
import { registerStudioSchema } from '../../infrastructure/graphql/modules/studio';
import { BuilderStub, createTestContext } from '../mocks/builder-stub';
import { prismaMock } from '../mocks/prisma';

const builder = new BuilderStub();

registerStudioSchema(builder as any);

const ctx = createTestContext({
  user: {
    id: 'user-e2e',
    email: 'e2e@test.com',
    name: 'E2E User',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    locale: 'en',
    onboardingCompleted: false,
    banned: false,
  },
  featureFlags: {
    studio_dedicated_deployment: true,
  },
});

describe('Project lifecycle e2e', () => {
  it('creates a project, adds a spec, and deploys to shared and dedicated targets', async () => {
    prismaMock.studioProject.create.mockResolvedValue({
      id: 'proj-e2e',
      organizationId: 'org-e2e',
      name: 'Atlas',
      slug: 'atlas',
      description: null,
      tier: 'STARTER',
      deploymentMode: 'SHARED',

      deploymentStatus: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prismaMock.studioDeployment.create.mockResolvedValue({
      id: 'deploy-1',
      projectId: 'proj-e2e',
      version: 'v1.0.0',
    } as any);
    prismaMock.studioDeployment.findFirst.mockResolvedValue({
      id: 'deploy-1',
      version: 'v1.0.0',
    } as any);
    prismaMock.studioDeployment.update.mockResolvedValue({
      id: 'deploy-1',
      status: 'DEPLOYED',
    } as any);

    prismaMock.studioSpec.create.mockResolvedValue({
      id: 'spec-e2e',
      projectId: 'proj-e2e',
      type: 'CAPABILITY',
      name: 'Spec',
      version: '1.0.0',
      content: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    prismaMock.studioProject.findFirst.mockImplementation(({ where }) => {
      const projectId = where?.id;
      if (projectId === 'proj-e2e-shared') {
        return Promise.resolve({
          id: 'proj-e2e-shared',
          organizationId: 'org-e2e',
          name: 'Shared Project',
          slug: 'shared-project',
          description: null,
          tier: 'STARTER',
          deploymentMode: 'SHARED',
          deploymentStatus: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      return Promise.resolve({
        id: 'proj-e2e',
        organizationId: 'org-e2e',
        name: 'Atlas',
        slug: 'atlas',
        description: null,
        tier: 'STARTER',
        deploymentMode: 'DEDICATED',
        deploymentStatus: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    const createProject = builder.mutationFieldsMap.createStudioProject.resolve;
    const createSpec = builder.mutationFieldsMap.createStudioSpec.resolve;
    const deployProject = builder.mutationFieldsMap.deployStudioProject.resolve;

    const project = await createProject(
      {},
      { input: { name: 'Atlas', tier: 'STARTER' } },
      ctx
    );
    expect((project as { id: string }).id).toBe('proj-e2e');

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
    expect((spec as { projectId: string }).projectId).toBe('proj-e2e');

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

    expect(prismaMock.studioDeployment.update).toHaveBeenCalledTimes(2);
  });
});
