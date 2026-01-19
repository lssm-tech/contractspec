import type { Metadata } from 'next';
import { FeatureDiscovery } from '@contractspec/bundle.library/presentation/features';

export const metadata: Metadata = {
  title: 'Features | ContractSpec',
  description:
    'Explore ContractSpec features and capabilities. From spec-first design to auto-evolutive safety.',
  openGraph: {
    title: 'Features | ContractSpec',
    description:
      'Explore ContractSpec features and capabilities. From spec-first design to auto-evolutive safety.',
    url: 'https://www.contractspec.io/features',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/features',
  },
};

export default function FeaturesPage() {
  return <FeatureDiscovery />;
}
