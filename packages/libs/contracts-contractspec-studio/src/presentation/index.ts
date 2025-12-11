import {
  createFeatureModule,
  FeatureRegistry,
  OwnersEnum,
  type PresentationDescriptorV2,
  PresentationRegistry,
  type PresentationSpec,
} from '@lssm/lib.contracts';
import { ScalarTypeEnum, SchemaModel } from '@lssm/lib.schema';

// Minimal props schema for WebAuthTabs (host may ignore or extend via i18n/branding)
// const WebAuthTabsProps = new SchemaModel({
//   name: 'SigilWebAuthTabsProps',
//   description: 'Props for Sigil WebAuthTabs presentation',
//   fields: {
//     returnUrl: { type: ScalarTypeEnum.URL(), isOptional: true },
//     locale: { type: ScalarTypeEnum.Locale(), isOptional: true },
//     // Generic JSON bag for host-specific options (providers, labels, etc.)
//     options: { type: ScalarTypeEnum.JSONObject(), isOptional: true },
//   },
// });

export function buildPresentationRegistry() {
  const reg = new PresentationRegistry();

  return reg;
}

export function buildPresentationDescriptorsV2(): PresentationDescriptorV2[] {
  const list: PresentationDescriptorV2[] = [];
  return list;
}

export function buildFeatures() {
  const reg = new FeatureRegistry();
  return reg;
}
