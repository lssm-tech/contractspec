import { ScalarTypeEnum, defineSchemaModel } from '@contractspec/lib.schema';
import { defineCommand, defineQuery } from '@contractspec/lib.contracts';

const OWNERS = ['examples.wealth-snapshot'] as const;

export const AccountModel = defineSchemaModel({
  name: 'Account',
  description: 'Account model',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    balance: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
  },
});

export const AssetModel = defineSchemaModel({
  name: 'Asset',
  description: 'Asset model',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const LiabilityModel = defineSchemaModel({
  name: 'Liability',
  description: 'Liability model',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    balance: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const GoalModel = defineSchemaModel({
  name: 'Goal',
  description: 'Goal model',
  fields: {
    id: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currentAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

export const NetWorthSnapshotModel = defineSchemaModel({
  name: 'NetWorthSnapshot',
  description: 'Net worth snapshot model',
  fields: {
    asOf: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    totalAssets: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    totalLiabilities: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: false,
    },
    netWorth: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

// Inputs
const CreateAccountInput = defineSchemaModel({
  name: 'CreateAccountInput',
  description: 'Create account input',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    type: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    balance: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const AddAssetInput = defineSchemaModel({
  name: 'AddAssetInput',
  description: 'Add asset input',
  fields: {
    accountId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    value: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const AddLiabilityInput = defineSchemaModel({
  name: 'AddLiabilityInput',
  description: 'Add liability input',
  fields: {
    accountId: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    category: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    balance: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const UpdateGoalInput = defineSchemaModel({
  name: 'UpdateGoalInput',
  description: 'Update goal progress',
  fields: {
    goalId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    currentAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    status: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
  },
});

const CreateGoalInput = defineSchemaModel({
  name: 'CreateGoalInput',
  description: 'Create goal input',
  fields: {
    name: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    targetAmount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    targetDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
  },
});

const NetWorthQueryInput = defineSchemaModel({
  name: 'NetWorthQueryInput',
  description: 'Filter for net worth snapshots',
  fields: {
    orgId: { type: ScalarTypeEnum.String_unsecure(), isOptional: false },
    from: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    to: { type: ScalarTypeEnum.DateTime(), isOptional: true },
  },
});

// Commands
export const CreateAccountContract = defineCommand({
  meta: {
    key: 'wealth.account.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['wealth', 'account', 'create'],
    description: 'Create a financial account.',
    goal: 'Track account balances.',
    context: 'Onboarding/import.',
  },
  io: { input: CreateAccountInput, output: AccountModel },
  policy: { auth: 'user' },
});

export const AddAssetContract = defineCommand({
  meta: {
    key: 'wealth.asset.add',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['wealth', 'asset', 'add'],
    description: 'Add an asset position.',
    goal: 'Track holdings.',
    context: 'Asset onboarding/update.',
  },
  io: { input: AddAssetInput, output: AssetModel },
  policy: { auth: 'user' },
});

export const AddLiabilityContract = defineCommand({
  meta: {
    key: 'wealth.liability.add',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['wealth', 'liability', 'add'],
    description: 'Add a liability.',
    goal: 'Track debts.',
    context: 'Debt onboarding/update.',
  },
  io: { input: AddLiabilityInput, output: LiabilityModel },
  policy: { auth: 'user' },
});

export const CreateGoalContract = defineCommand({
  meta: {
    key: 'wealth.goal.create',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['wealth', 'goal', 'create'],
    description: 'Create a financial goal.',
    goal: 'Track progress toward goals.',
    context: 'Planning.',
  },
  io: { input: CreateGoalInput, output: GoalModel },
  policy: { auth: 'user' },
});

export const UpdateGoalContract = defineCommand({
  meta: {
    key: 'wealth.goal.update',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['wealth', 'goal', 'update'],
    description: 'Update goal progress.',
    goal: 'Keep progress current.',
    context: 'Periodic update.',
  },
  io: { input: UpdateGoalInput, output: GoalModel },
  policy: { auth: 'user' },
});

// Queries
export const GetNetWorthContract = defineQuery({
  meta: {
    key: 'wealth.networth.get',
    version: 1,
    stability: 'stable',
    owners: [...OWNERS],
    tags: ['wealth', 'networth'],
    description: 'Get net worth snapshots for a period.',
    goal: 'Render charts and indicators.',
    context: 'Dashboard.',
  },
  io: {
    input: NetWorthQueryInput,
    output: defineSchemaModel({
      name: 'NetWorthQueryOutput',
      description: 'Snapshots + latest indicators',
      fields: {
        snapshots: {
          type: NetWorthSnapshotModel,
          isArray: true,
          isOptional: false,
        },
        latest: { type: NetWorthSnapshotModel, isOptional: true },
      },
    }),
  },
  policy: { auth: 'user' },
});
