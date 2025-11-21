export const ContractSpecFeatureFlags = {
  LIFECYCLE_DETECTION_ALPHA: 'lifecycle_detection_alpha',
  LIFECYCLE_ADVISOR_ALPHA: 'lifecycle_advisor_alpha',
  LIFECYCLE_MANAGED_SERVICE: 'lifecycle_managed_service',
} as const;

export type ContractSpecFeatureFlag = keyof typeof ContractSpecFeatureFlags;

export const lifecycleFlags = [
  ContractSpecFeatureFlags.LIFECYCLE_DETECTION_ALPHA,
  ContractSpecFeatureFlags.LIFECYCLE_ADVISOR_ALPHA,
  ContractSpecFeatureFlags.LIFECYCLE_MANAGED_SERVICE,
];
