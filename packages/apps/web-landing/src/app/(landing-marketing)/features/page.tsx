import type { Metadata } from 'next';
import { FeatureDiscovery } from '@contractspec/bundle.library/presentation/features';

export const metadata: Metadata = {
  title: 'Features | ContractSpec',
  description: 'Explore ContractSpec features and capabilities',
};

export default function FeaturesPage() {
  return <FeatureDiscovery />;
}
