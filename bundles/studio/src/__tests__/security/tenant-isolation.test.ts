/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */

import { beforeEach, describe, expect, it } from 'bun:test';
import { registerIntegrationsSchema } from '../../infrastructure/graphql/modules/integrations';
import { registerStudioSchema } from '../../infrastructure/graphql/modules/studio';
import {
  BuilderStub,
  createTestContext,
  type InputFieldBuilder,
} from '../mocks/builder-stub';
import { prismaMock, resetPrismaMock } from '../mocks/prisma';

class IntegrationsBuilderStub extends BuilderStub {
  override inputType(
    _name: string,
    config?: { fields: (t: InputFieldBuilder) => Record<string, unknown> }
  ): Record<string, unknown> {
    if (config?.fields) {
      const fieldBuilder: InputFieldBuilder = {
        string: () => ({}),
        stringList: () => ({}),
        field: () => ({}),
        boolean: () => ({}),
        int: () => ({}),
      };
      config.fields(fieldBuilder);
    }
    return {};
  }
}

const studioBuilder = new BuilderStub();

registerStudioSchema(studioBuilder as any);

const integrationsBuilder = new IntegrationsBuilderStub();

registerIntegrationsSchema(integrationsBuilder as any);

const ctx = createTestContext({
  user: {
    id: 'user-safe',
    email: 'safe@test.com',
    name: 'Safe User',
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    image: null,
    locale: 'en',
    onboardingCompleted: false,
    banned: false,
    organizationId: 'org-safe',
  },
  organization: { id: 'org-safe' } as any,
});

describe('tenant isolation', () => {
  beforeEach(() => {
    resetPrismaMock();
  });

  it('denies access to studio project from another organization', async () => {
    prismaMock.studioProject.findFirst.mockResolvedValue(null);

    const resolver = studioBuilder.queryFieldsMap.studioProject.resolve;
    await expect(resolver({}, { id: 'proj-foreign' }, ctx)).rejects.toThrow(
      /Project not found/
    );

    expect(prismaMock.studioProject.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'proj-foreign',
        organizationId: 'org-safe',
        deletedAt: null,
      },
    });
  });

  it('scopes integration listings to the current organization', async () => {
    prismaMock.studioIntegration.findMany.mockResolvedValue([]);

    const resolver =
      integrationsBuilder.queryFieldsMap.studioIntegrations.resolve;
    await resolver({}, {}, ctx);

    expect(prismaMock.studioIntegration.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org-safe' },
      })
    );
  });
});
