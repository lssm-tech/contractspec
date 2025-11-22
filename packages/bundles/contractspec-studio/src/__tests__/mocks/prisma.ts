import { vi } from 'vitest';

type ModelMethods = Record<string, ReturnType<typeof vi.fn>>;

function createModel(methods: string[]): ModelMethods {
  return methods.reduce<ModelMethods>((acc, method) => {
    acc[method] = vi.fn();
    return acc;
  }, {});
}

export const prismaMock = {
  organizationLifecycleProfile: createModel([
    'upsert',
    'findUnique',
    'findUniqueOrThrow',
    'create',
    'update',
  ]),
  lifecycleAssessment: createModel(['findMany', 'create']),
  lifecycleMilestoneProgress: createModel([
    'findMany',
    'findFirst',
    'create',
    'update',
  ]),
  studioProject: createModel([
    'findMany',
    'findFirst',
    'create',
    'update',
  ]),
  studioSpec: createModel(['count', 'findMany', 'findUnique', 'create', 'update']),
  studioOverlay: createModel(['count', 'findFirst', 'create', 'findUnique', 'update']),
  studioIntegration: createModel([
    'count',
    'findMany',
    'findFirst',
    'findUnique',
    'findUniqueOrThrow',
    'create',
    'update',
  ]),
  knowledgeSource: createModel(['create', 'findMany', 'count']),
  studioDeployment: createModel(['create', 'aggregate', 'findMany', 'update']),
  evolutionSession: createModel(['create', 'update']),
  organization: createModel(['findFirst']),
  $transaction: vi.fn(async (actions: Promise<unknown>[]) => Promise.all(actions)),
};

export function resetPrismaMock() {
  resetObject(prismaMock);
  prismaMock.$transaction.mockImplementation(async (actions: Promise<unknown>[]) =>
    Promise.all(actions)
  );
}

function resetObject(target: Record<string, unknown>) {
  Object.values(target).forEach((value) => {
    if (typeof value === 'function' && 'mockReset' in value) {
      (value as ReturnType<typeof vi.fn>).mockReset();
    } else if (value && typeof value === 'object') {
      resetObject(value as Record<string, unknown>);
    }
  });
}

