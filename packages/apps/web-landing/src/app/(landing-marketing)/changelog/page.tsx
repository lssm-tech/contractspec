import { ChangelogPage } from '@contractspec/bundle.marketing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog | ContractSpec',
  description:
    'Latest updates, improvements, and fixes to the ContractSpec platform.',
  openGraph: {
    title: 'Changelog | ContractSpec',
    description:
      'Latest updates, improvements, and fixes to the ContractSpec platform.',
    url: 'https://www.contractspec.io/changelog',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/changelog',
  },
};

export default ChangelogPage;
