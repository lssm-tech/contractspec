import { ScalarTypeEnum, SchemaModel } from '@contractspec/lib.schema';

export const BankAccountRecord = new SchemaModel({
  name: 'BankAccountRecord',
  description:
    'Canonical representation of a bank account synced from an open banking provider.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    userId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    institutionId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    institutionName: {
      type: ScalarTypeEnum.NonEmptyString(),
      isOptional: false,
    },
    institutionLogoUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
    iban: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    bic: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    accountType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    currency: { type: ScalarTypeEnum.Currency(), isOptional: false },
    displayName: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    accountNumberMasked: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    productCode: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    balance: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    availableBalance: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    lastSyncedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});

export const BankTransactionRecord = new SchemaModel({
  name: 'BankTransactionRecord',
  description:
    'Canonical transaction entry mapped from Powens into the open banking ledger.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountId: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    externalId: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    amount: { type: ScalarTypeEnum.Float_unsecure(), isOptional: false },
    currency: { type: ScalarTypeEnum.Currency(), isOptional: false },
    date: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    bookingDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    valueDate: { type: ScalarTypeEnum.DateTime(), isOptional: true },
    description: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    counterpartyName: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    counterpartyAccount: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    merchantCategoryCode: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    rawCategory: { type: ScalarTypeEnum.String_unsecure(), isOptional: true },
    standardizedCategory: {
      type: ScalarTypeEnum.String_unsecure(),
      isOptional: true,
    },
    transactionType: {
      type: ScalarTypeEnum.NonEmptyString(),
      isOptional: false,
    },
    status: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    runningBalance: { type: ScalarTypeEnum.Float_unsecure(), isOptional: true },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    updatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
  },
});

export const AccountBalanceRecord = new SchemaModel({
  name: 'AccountBalanceRecord',
  description:
    'Canonical balance snapshot computed from Powens balance payloads.',
  fields: {
    id: { type: ScalarTypeEnum.ID(), isOptional: false },
    accountId: { type: ScalarTypeEnum.ID(), isOptional: false },
    tenantId: { type: ScalarTypeEnum.ID(), isOptional: false },
    connectionId: { type: ScalarTypeEnum.ID(), isOptional: false },
    balanceType: { type: ScalarTypeEnum.NonEmptyString(), isOptional: false },
    currentBalance: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: false,
    },
    availableBalance: {
      type: ScalarTypeEnum.Float_unsecure(),
      isOptional: true,
    },
    currency: { type: ScalarTypeEnum.Currency(), isOptional: false },
    lastUpdatedAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    createdAt: { type: ScalarTypeEnum.DateTime(), isOptional: false },
    metadata: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
  },
});
