import {
  defineEntity,
  defineEntityEnum,
  field,
  index,
} from '@contractspec/lib.schema';
import type { ModuleSchemaContribution } from '@contractspec/lib.schema';

const schema = 'lssm_wealth_snapshot';

export const AccountTypeEnum = defineEntityEnum({
  name: 'AccountType',
  schema,
  values: ['CHECKING', 'SAVINGS', 'INVESTMENT', 'CREDIT_CARD', 'LOAN'] as const,
  description: 'Account categories for holdings and debts.',
});

export const AssetCategoryEnum = defineEntityEnum({
  name: 'AssetCategory',
  schema,
  values: ['CASH', 'EQUITY', 'REAL_ESTATE', 'CRYPTO', 'OTHER'] as const,
  description: 'Asset categories.',
});

export const LiabilityCategoryEnum = defineEntityEnum({
  name: 'LiabilityCategory',
  schema,
  values: ['CREDIT_CARD', 'LOAN', 'MORTGAGE', 'TAX', 'OTHER'] as const,
  description: 'Liability categories.',
});

export const GoalStatusEnum = defineEntityEnum({
  name: 'GoalStatus',
  schema,
  values: ['ACTIVE', 'ON_TRACK', 'AT_RISK', 'OFF_TRACK', 'COMPLETED'] as const,
  description: 'Goal health/status.',
});

export const AccountEntity = defineEntity({
  name: 'Account',
  description: 'Financial account representing holdings or debts.',
  schema,
  map: 'account',
  fields: {
    id: field.id({ description: 'Account ID' }),
    name: field.string({ description: 'Account name' }),
    type: field.enum('AccountType', { description: 'Account type' }),
    currency: field.string({ description: 'Currency code', default: '"USD"' }),
    balance: field.decimal({ description: 'Current balance' }),
    institution: field.string({ description: 'Institution', isOptional: true }),
    orgId: field.string({ description: 'Org/household id' }),
    ownerId: field.string({ description: 'Owner user id', isOptional: true }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  enums: [AccountTypeEnum],
  indexes: [index.on(['orgId']), index.on(['type']), index.on(['ownerId'])],
});

export const AssetEntity = defineEntity({
  name: 'Asset',
  description: 'Individual asset position.',
  schema,
  map: 'asset',
  fields: {
    id: field.id({ description: 'Asset ID' }),
    accountId: field.foreignKey({
      description: 'Holding account',
      isOptional: true,
    }),
    name: field.string({ description: 'Asset name' }),
    category: field.enum('AssetCategory', { description: 'Asset category' }),
    value: field.decimal({ description: 'Current value' }),
    currency: field.string({ description: 'Currency', default: '"USD"' }),
    orgId: field.string({ description: 'Org/household id' }),
    metadata: field.json({ description: 'Metadata', isOptional: true }),
    updatedAt: field.updatedAt(),
    createdAt: field.createdAt(),
    account: field.belongsTo('Account', ['accountId'], ['id'], {
      onDelete: 'SetNull',
    }),
  },
  enums: [AssetCategoryEnum],
  indexes: [index.on(['orgId']), index.on(['category'])],
});

export const LiabilityEntity = defineEntity({
  name: 'Liability',
  description: 'Debt or obligation.',
  schema,
  map: 'liability',
  fields: {
    id: field.id({ description: 'Liability ID' }),
    accountId: field.foreignKey({
      description: 'Liability account',
      isOptional: true,
    }),
    name: field.string({ description: 'Liability name' }),
    category: field.enum('LiabilityCategory', {
      description: 'Liability category',
    }),
    balance: field.decimal({ description: 'Outstanding balance' }),
    currency: field.string({ description: 'Currency', default: '"USD"' }),
    interestRate: field.decimal({
      description: 'Interest rate (e.g., 0.05 for 5%)',
      isOptional: true,
    }),
    orgId: field.string({ description: 'Org/household id' }),
    metadata: field.json({ description: 'Metadata', isOptional: true }),
    updatedAt: field.updatedAt(),
    createdAt: field.createdAt(),
    account: field.belongsTo('Account', ['accountId'], ['id'], {
      onDelete: 'SetNull',
    }),
  },
  enums: [LiabilityCategoryEnum],
  indexes: [index.on(['orgId']), index.on(['category'])],
});

export const GoalEntity = defineEntity({
  name: 'Goal',
  description: 'Financial goal with target amount/date.',
  schema,
  map: 'goal',
  fields: {
    id: field.id({ description: 'Goal ID' }),
    name: field.string({ description: 'Goal name' }),
    targetAmount: field.decimal({ description: 'Target amount' }),
    currentAmount: field.decimal({
      description: 'Current progress amount',
      default: 0,
    }),
    currency: field.string({ description: 'Currency', default: '"USD"' }),
    targetDate: field.dateTime({
      description: 'Target completion date',
      isOptional: true,
    }),
    status: field.enum('GoalStatus', {
      description: 'Goal status',
      default: 'ACTIVE',
    }),
    orgId: field.string({ description: 'Org/household id' }),
    ownerId: field.string({ description: 'Owner user id', isOptional: true }),
    createdAt: field.createdAt(),
    updatedAt: field.updatedAt(),
  },
  enums: [GoalStatusEnum],
  indexes: [
    index.on(['orgId']),
    index.on(['status']),
    index.on(['targetDate']),
  ],
});

export const NetWorthSnapshotEntity = defineEntity({
  name: 'NetWorthSnapshot',
  description: 'Aggregated net worth snapshot for a date.',
  schema,
  map: 'networth_snapshot',
  fields: {
    id: field.id({ description: 'Snapshot ID' }),
    asOf: field.dateTime({ description: 'Snapshot date' }),
    totalAssets: field.decimal({ description: 'Total assets' }),
    totalLiabilities: field.decimal({ description: 'Total liabilities' }),
    netWorth: field.decimal({ description: 'Net worth' }),
    currency: field.string({ description: 'Currency', default: '"USD"' }),
    orgId: field.string({ description: 'Org/household id' }),
    createdAt: field.createdAt(),
  },
  indexes: [index.unique(['orgId', 'asOf'], { name: 'networth_unique' })],
});

export const wealthSnapshotEntities = [
  AccountEntity,
  AssetEntity,
  LiabilityEntity,
  GoalEntity,
  NetWorthSnapshotEntity,
];

export const wealthSnapshotSchemaContribution: ModuleSchemaContribution = {
  moduleId: '@contractspec/example.wealth-snapshot',
  // schema,
  entities: wealthSnapshotEntities,
  enums: [
    AccountTypeEnum,
    AssetCategoryEnum,
    LiabilityCategoryEnum,
    GoalStatusEnum,
  ],
};
