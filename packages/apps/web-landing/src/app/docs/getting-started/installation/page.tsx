import { InstallationPage } from '@contractspec/bundle.library';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Installation | ContractSpec Docs',
  description:
    'Install ContractSpec and set up your development environment. Supports npm, yarn, pnpm, and bun package managers.',
  keywords: [
    'installation',
    'setup',
    'npm',
    'yarn',
    'pnpm',
    'bun',
    'development environment',
    'ContractSpec',
  ],
  openGraph: {
    title: 'Installation | ContractSpec Docs',
    description:
      'Install ContractSpec and set up your development environment with our comprehensive installation guide.',
    url: 'https://www.contractspec.io/docs/getting-started/installation',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/docs/getting-started/installation',
  },
};

import { ArticleStructuredData } from '@/components/structured-data';

export default InstallationPage;
