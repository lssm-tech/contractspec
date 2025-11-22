import { vi } from 'vitest';

type MockFn = ReturnType<typeof vi.fn>;

function createModel<T extends string>(
  methods: readonly T[]
): Record<T, MockFn> {
  return methods.reduce<Record<T, MockFn>>(
    (acc, method) => {
      acc[method] = vi.fn();
      return acc;
    },
    {} as Record<T, MockFn>
  );
}

export const prismaMock = {
  organizationLifecycleProfile: createModel([
    'upsert',
    'findUnique',
    'findUniqueOrThrow',
    'create',
    'update',
  ] as const),
  lifecycleAssessment: createModel(['findMany', 'create'] as const),
  lifecycleMilestoneProgress: createModel([
    'findMany',
    'findFirst',
    'create',
    'update',
  ] as const),
  studioProject: createModel([
    'findMany',
    'findFirst',
    'create',
    'update',
  ] as const),
  studioSpec: createModel([
    'count',
    'findMany',
    'findUnique',
    'create',
    'update',
  ] as const),
  studioOverlay: createModel([
    'count',
    'findFirst',
    'create',
    'findUnique',
    'update',
  ] as const),
  studioIntegration: createModel([
    'count',
    'findMany',
    'findFirst',
    'findUnique',
    'findUniqueOrThrow',
    'create',
    'update',
    'updateMany',
  ] as const),
  knowledgeSource: createModel(['create', 'findMany', 'count'] as const),
  studioDeployment: createModel([
    'create',
    'aggregate',
    'findMany',
    'update',
    'findFirst',
    'findUnique',
  ] as const),
  evolutionSession: createModel(['create', 'update'] as const),
  organization: createModel(['findFirst'] as const),
  $transaction: vi.fn(async (actions: Promise<unknown>[]) =>
    Promise.all(actions)
  ),
};

export function resetPrismaMock() {
  resetObject(prismaMock);
  prismaMock.$transaction.mockImplementation(
    async (actions: Promise<unknown>[]) => Promise.all(actions)
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
