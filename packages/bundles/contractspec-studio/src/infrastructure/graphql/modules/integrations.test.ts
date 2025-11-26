import { describe, expect, it, beforeEach, vi } from 'bun:test';
import { registerIntegrationsSchema } from './integrations';
import type { Context } from '../types';
import { prismaMock } from '../../../__tests__/mocks/prisma';

const connectIntegrationMock = vi.fn();
const syncIntegrationMock = vi.fn();
const indexSourceMock = vi.fn();
const queryKnowledgeMock = vi.fn();

vi.mock('../../modules/integrations', () => ({
  StudioIntegrationModule: class {
    connectIntegration = connectIntegrationMock;
    syncIntegration = syncIntegrationMock;
  },
}));

vi.mock('../../modules/knowledge', () => ({
  StudioKnowledgeModule: class {
    indexSource = indexSourceMock;
    queryKnowledge = queryKnowledgeMock;
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

const builder = new BuilderStub();
registerIntegrationsSchema(builder as any);

const baseCtx: Context = {
  user: { organizationId: 'org-1' } as any,
  session: undefined,
  logger: console as any,
  headers: {} as Headers,
  featureFlags: {
    studio_integration_hub: true,
    studio_knowledge_hub: true,
  },
};

describe('integrations GraphQL module', () => {
  beforeEach(() => {
    connectIntegrationMock.mockReset();
    indexSourceMock.mockReset();
    queryKnowledgeMock.mockReset();
  });

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
    connectIntegrationMock.mockResolvedValue({ id: 'int-2' });

    const resolver = builder.mutationFieldsMap.connectIntegration.resolve;
    const integration = await resolver(
      {},
      { input: { provider: 'OPENAI', credentials: {} } },
      baseCtx
    );

    expect(connectIntegrationMock).toHaveBeenCalledWith(
      expect.objectContaining({ organizationId: 'org-1' })
    );
    expect(integration.id).toBe('int-2');
  });

  it('indexes knowledge sources when flag enabled', async () => {
    indexSourceMock.mockResolvedValue({ id: 'source-1' });

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

    expect(indexSourceMock).toHaveBeenCalled();
    expect(source.id).toBe('source-1');
  });

  it('queries knowledge sources using the module', async () => {
    queryKnowledgeMock.mockResolvedValue({ answer: '42' });

    const resolver = builder.queryFieldsMap.queryKnowledge.resolve;
    const answer = await resolver(
      {},
      { input: { query: 'meaning?' } },
      baseCtx
    );

    expect(queryKnowledgeMock).toHaveBeenCalledWith(
      expect.objectContaining({ question: 'meaning?' })
    );
    expect(answer).toEqual({ answer: '42' });
  });
});










