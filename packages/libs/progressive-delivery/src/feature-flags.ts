export const ContractSpecFeatureFlags = {
  LIFECYCLE_DETECTION_ALPHA: 'lifecycle_detection_alpha',
  LIFECYCLE_ADVISOR_ALPHA: 'lifecycle_advisor_alpha',
  LIFECYCLE_MANAGED_SERVICE: 'lifecycle_managed_service',
  STUDIO_VISUAL_BUILDER: 'studio_visual_builder',
  STUDIO_AUTO_EVOLUTION: 'studio_auto_evolution',
  STUDIO_BYOK: 'studio_byok',
  STUDIO_DEDICATED_DEPLOYMENT: 'studio_dedicated_deployment',
  STUDIO_INTEGRATION_HUB: 'studio_integration_hub',
  STUDIO_KNOWLEDGE_HUB: 'studio_knowledge_hub',
  STUDIO_TEMPLATES: 'studio_templates',
} as const;

export type ContractSpecFeatureFlag = keyof typeof ContractSpecFeatureFlags;

export const lifecycleFlags = [
  ContractSpecFeatureFlags.LIFECYCLE_DETECTION_ALPHA,
  ContractSpecFeatureFlags.LIFECYCLE_ADVISOR_ALPHA,
  ContractSpecFeatureFlags.LIFECYCLE_MANAGED_SERVICE,
];

export const studioFlags = [
  ContractSpecFeatureFlags.STUDIO_VISUAL_BUILDER,
  ContractSpecFeatureFlags.STUDIO_AUTO_EVOLUTION,
  ContractSpecFeatureFlags.STUDIO_BYOK,
  ContractSpecFeatureFlags.STUDIO_DEDICATED_DEPLOYMENT,
  ContractSpecFeatureFlags.STUDIO_INTEGRATION_HUB,
  ContractSpecFeatureFlags.STUDIO_KNOWLEDGE_HUB,
  ContractSpecFeatureFlags.STUDIO_TEMPLATES,
];
