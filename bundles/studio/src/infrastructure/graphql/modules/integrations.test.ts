/* eslint-disable @typescript-eslint/no-explicit-any -- Pragmatic use of any for test mocks */

import { describe, expect, it, vi } from 'bun:test';
import { prismaMock } from '../../../__tests__/mocks/prisma';
import { StudioIntegrationModule } from '../../../modules/integrations';
import { StudioKnowledgeModule } from '../../../modules/knowledge';
import type { Context } from '../types';
import { registerIntegrationsSchema } from './integrations';

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
    const fields = cb({ field: (config) => config, arg: this.argBuilder });
    Object.assign(this.queryFieldsMap, fields);
  }

  mutationFields(
    cb: (t: { field: (config: any) => any; arg: any }) => Record<string, any>
  ) {
    const fields = cb({ field: (config) => config, arg: this.argBuilder });
    Object.assign(this.mutationFieldsMap, fields);
  }
}

const builder = new BuilderStub();
registerIntegrationsSchema(builder as any);

const baseCtx: Context = {
  user: { organizationId: 'org-1' } as any,
  organization: { id: 'org-1' } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {
    studio_integration_hub: true,
    studio_knowledge_hub: true,
  },
};

describe('integrations GraphQL module', () => {
  it('lists studio integrations for the organization', async () => {
    prismaMock.studioIntegration.findMany.mockResolvedValue([
      { id: 'int-1' },
    ] as any);

    const resolver = builder.queryFieldsMap.studioIntegrations.resolve;
    const list = await resolver({}, {}, baseCtx);

    expect(prismaMock.studioIntegration.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { organizationId: 'org-1' },
      })
    );
    expect(list).toHaveLength(1);
  });

  it('connects integrations through the module', async () => {
    const connectSpy = vi
      .spyOn(StudioIntegrationModule.prototype, 'connectIntegration')
      .mockResolvedValue({ id: 'int-2' } as any);

    const resolver = builder.mutationFieldsMap.connectIntegration.resolve;
    const integration = await resolver(
      {},
      { input: { provider: 'OPENAI', credentials: {} } },
      baseCtx
    );

    expect(connectSpy).toHaveBeenCalledWith(
      expect.objectContaining({ organizationId: 'org-1' })
    );
    expect(integration.id).toBe('int-2');
  });

  it('indexes knowledge sources when flag enabled', async () => {
    const indexSpy = vi
      .spyOn(StudioKnowledgeModule.prototype, 'indexSource')
      .mockResolvedValue({ id: 'source-1' } as any);

    const resolver = builder.mutationFieldsMap.indexKnowledgeSource.resolve;
    const source = await resolver(
      {},
      {
        input: {
          type: 'DOCUMENTATION',
          name: 'Docs',
          documents: [{ id: 'doc-1', text: 'Hello' }],
        },
      },
      baseCtx
    );

    expect(indexSpy).toHaveBeenCalled();
    expect(source.id).toBe('source-1');
  });

  it('queries knowledge sources using the module', async () => {
    const querySpy = vi
      .spyOn(StudioKnowledgeModule.prototype, 'queryKnowledge')
      .mockResolvedValue({ answer: '42' } as any);

    const resolver = builder.queryFieldsMap.queryKnowledge.resolve;
    const answer = await resolver(
      {},
      { input: { query: 'meaning?' } },
      baseCtx
    );

    expect(querySpy).toHaveBeenCalledWith(
      expect.objectContaining({ question: 'meaning?' })
    );
    expect(answer).toEqual({ answer: '42' });
  });
});
