import { PrivacyTemplate } from '@contractspec/bundle.library';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ContractSpec',
  description: 'Privacy policy and data protection practices at ContractSpec.',
  openGraph: {
    title: 'Privacy Policy | ContractSpec',
    description:
      'Privacy policy and data protection practices at ContractSpec.',
    url: 'https://www.contractspec.io/legal/privacy',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/legal/privacy',
  },
};

export default PrivacyTemplate;
