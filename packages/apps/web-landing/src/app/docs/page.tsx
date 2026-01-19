import { DocsIndexPage } from '@contractspec/bundle.library/components/docs/DocsIndexPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation – ContractSpec',
  description:
    'Learn to stabilize your AI-generated code. Define contracts, generate consistent code across all surfaces, regenerate safely.',
  keywords: [
    'documentation',
    'guides',
    'API reference',
    'spec-first compiler',
    'AI code stabilization',
    'TypeScript',
    'contracts',
  ],
  openGraph: {
    title: 'Documentation – ContractSpec',
    description:
      'Learn to stabilize your AI-generated code with spec-first development.',
    url: 'https://www.contractspec.io/docs',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/docs',
  },
};

export default DocsIndexPage;
