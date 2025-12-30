/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */

import { describe, expect, it } from 'bun:test';
import { registerStudioSchema } from '../../infrastructure/graphql/modules/studio';
import { registerLifecycleSchema } from '../../infrastructure/graphql/modules/lifecycle';
import { BuilderStub, createAnonymousContext } from '../mocks/builder-stub';

const studioBuilder = new BuilderStub();

registerStudioSchema(studioBuilder as any);

const lifecycleBuilder = new BuilderStub();

registerLifecycleSchema(lifecycleBuilder as any);

const anonymousCtx = createAnonymousContext();

describe('API authentication', () => {
  it('rejects project queries without authentication', async () => {
    const resolver = studioBuilder.queryFieldsMap.myStudioProjects.resolve;
    await expect(resolver({}, {}, anonymousCtx)).rejects.toThrow(
      /Unauthorized/
    );
  });

  it('rejects lifecycle profile access for anonymous sessions', async () => {
    const resolver = lifecycleBuilder.queryFieldsMap.lifecycleProfile.resolve;
    await expect(resolver({}, {}, anonymousCtx)).rejects.toThrow(
      /Unauthorized/
    );
  });
});
