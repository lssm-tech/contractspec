import type { FeatureModuleSpec } from '@contractspec/lib.contracts-spec/features';

export type FeatureViewMode = 'grid' | 'list';
export type FeatureGroupBy = 'none' | 'domain' | 'stability';

export interface FeatureDiscoveryProps {
  /** Callback when a feature is selected. */
  onSelectFeature?: (feature: FeatureModuleSpec) => void;
  /** Additional class name. */
  className?: string;
  /** Default view mode */
  defaultViewMode?: FeatureViewMode;
  /** Group features by category */
  groupBy?: FeatureGroupBy;
  /** Show featured/stable features at top */
  showFeatured?: boolean;
}
