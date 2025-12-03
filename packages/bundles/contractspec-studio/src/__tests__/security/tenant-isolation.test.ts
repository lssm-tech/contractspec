import { describe, expect, it } from 'bun:test';
import { registerStudioSchema } from '../../infrastructure/graphql/modules/studio';
import { registerIntegrationsSchema } from '../../infrastructure/graphql/modules/integrations';
import type { Context } from '../../infrastructure/graphql/types';
import { prismaMock } from '../mocks/prisma';

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

  queryFields(cb: (t: { field: (config: any) => any }) => Record<string, any>) {
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

const studioBuilder = new BuilderStub();
registerStudioSchema(studioBuilder as any);

const integrationsBuilder = new BuilderStub();
registerIntegrationsSchema(integrationsBuilder as any);

const ctx: Context = {
  user: { organizationId: 'org-safe' } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {},
};

describe('tenant isolation', () => {
  it('denies access to studio project from another organization', async () => {
    prismaMock.studioProject.findFirst.mockResolvedValue(null);

    const resolver = studioBuilder.queryFieldsMap.studioProject.resolve;
    await expect(resolver({}, { id: 'proj-foreign' }, ctx)).rejects.toThrow(
      /Project not found/
    );

    expect(prismaMock.studioProject.findFirst).toHaveBeenCalledWith({
      where: { id: 'proj-foreign', organizationId: 'org-safe' },
    });
  });

  it('scopes integration listings to the current organization', async () => {
    prismaMock.studioIntegration.findMany.mockResolvedValue([] as any);

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


