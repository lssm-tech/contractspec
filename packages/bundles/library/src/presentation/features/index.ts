// Atoms
export {
  FeatureIcon,
  getFeatureIconTone,
  type FeatureIconProps,
} from './atoms/FeatureIcon';

// Hooks
export {
  useFeatureRegistry,
  type UseFeatureRegistryReturn,
  useFeatureFilters,
  type UseFeatureFiltersReturn,
  type FeatureFilters,
  useContractsRegistry,
  type UseContractsRegistryReturn,
} from './hooks';
export { useRelatedDocs } from './hooks/useRelatedDocs';

// Molecules
export { FeatureCard, type FeatureCardProps } from './molecules/FeatureCard';
export {
  FeatureFiltersBar,
  type FeatureFiltersBarProps,
} from './molecules/FeatureFilters';
export {
  FeatureHoverPreview,
  type FeatureHoverPreviewProps,
} from './molecules/FeatureHoverPreview';
export {
  FeatureCategoryHeader,
  type FeatureCategoryHeaderProps,
} from './molecules/FeatureCategoryHeader';

// Organisms
export {
  FeatureDiscovery,
  type FeatureDiscoveryProps,
  type FeatureViewMode,
  type FeatureGroupBy,
} from './organisms/FeatureDiscovery';
export {
  FeatureDetail,
  type FeatureDetailProps,
} from './organisms/FeatureDetail';
export { FeatureOperationsList } from './organisms/FeatureOperationsList';
export { FeatureEventsList } from './organisms/FeatureEventsList';
export { FeaturePresentationsList } from './organisms/FeaturePresentationsList';
export { FeatureDataViewsList } from './organisms/FeatureDataViewsList';
export { FeatureFormsList } from './organisms/FeatureFormsList';

// Templates
export {
  FeatureOverviewTemplate,
  type FeatureOverviewTemplateProps,
} from './templates/FeatureOverviewTemplate';
export { FeatureOperationsTemplate } from './templates/FeatureOperationsTemplate';
export { FeatureEventsTemplate } from './templates/FeatureEventsTemplate';
export { FeaturePresentationsTemplate } from './templates/FeaturePresentationsTemplate';
export { FeatureDataViewsTemplate } from './templates/FeatureDataViewsTemplate';
export { FeatureFormsTemplate } from './templates/FeatureFormsTemplate';
export {
  FeatureOperationDetailTemplate,
  type FeatureOperationDetailTemplateProps,
} from './templates/FeatureOperationDetailTemplate';
export {
  FeatureEventDetailTemplate,
  type FeatureEventDetailTemplateProps,
} from './templates/FeatureEventDetailTemplate';
export {
  FeaturePresentationDetailTemplate,
  type FeaturePresentationDetailTemplateProps,
} from './templates/FeaturePresentationDetailTemplate';
export {
  FeatureDataViewDetailTemplate,
  type FeatureDataViewDetailTemplateProps,
} from './templates/FeatureDataViewDetailTemplate';
export {
  FeatureFormDetailTemplate,
  type FeatureFormDetailTemplateProps,
} from './templates/FeatureFormDetailTemplate';
export type { FeatureListTemplateProps } from './templates/types';
