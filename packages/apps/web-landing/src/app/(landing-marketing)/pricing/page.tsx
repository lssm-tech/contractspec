import { PricingClient } from '@contractspec/bundle.marketing/components/marketing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | ContractSpec',
  description:
    'Simple, transparent pricing. Start for free, scale with your team.',
  openGraph: {
    title: 'Pricing | ContractSpec',
    description:
      'Simple, transparent pricing. Start for free, scale with your team.',
    url: 'https://www.contractspec.io/pricing',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/pricing',
  },
};

export default PricingClient;
