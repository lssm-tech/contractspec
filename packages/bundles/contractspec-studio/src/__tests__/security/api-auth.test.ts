import { describe, expect, it } from 'vitest';
import { registerStudioSchema } from '../../infrastructure/graphql/modules/studio';
import { registerLifecycleSchema } from '../../infrastructure/graphql/modules/lifecycle';
import type { Context } from '../../infrastructure/graphql/types';

class BuilderStub {
  queryFieldsMap: Record<string, any> = {};

  enumType() {
    return {};
  }

  objectRef() {
    return { implement: () => ({}) };
  }

  inputType() {
    return {};
  }

  queryFields(
    cb: (t: { field: (config: any) => any }) => Record<string, any>
  ) {
    const fields = cb({ field: (config) => config });
    Object.assign(this.queryFieldsMap, fields);
  }
}

const studioBuilder = new BuilderStub();
registerStudioSchema(studioBuilder as any);

const lifecycleBuilder = new BuilderStub();
registerLifecycleSchema(lifecycleBuilder as any);

const anonymousCtx: Context = {
  user: undefined,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {},
};

describe('API authentication', () => {
  it('rejects project queries without authentication', async () => {
    const resolver = studioBuilder.queryFieldsMap.myStudioProjects.resolve;
    await expect(resolver({}, {}, anonymousCtx)).rejects.toThrow(/Unauthorized/);
  });

  it('rejects lifecycle profile access for anonymous sessions', async () => {
    const resolver = lifecycleBuilder.queryFieldsMap.lifecycleProfile.resolve;
    await expect(resolver({}, {}, anonymousCtx)).rejects.toThrow(/Unauthorized/);
  });
});




