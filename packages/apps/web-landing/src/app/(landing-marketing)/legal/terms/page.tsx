import { TermsTemplate } from '@contractspec/bundle.library';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ContractSpec',
  description: 'Terms of service and usage for ContractSpec.',
  openGraph: {
    title: 'Terms of Service | ContractSpec',
    description: 'Terms of service and usage for ContractSpec.',
    url: 'https://www.contractspec.io/legal/terms',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/legal/terms',
  },
};

export default TermsTemplate;
