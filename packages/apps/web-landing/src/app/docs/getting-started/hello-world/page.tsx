import { HelloWorldPage } from '@contractspec/bundle.library';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hello World | ContractSpec Docs',
  description:
    'Create your first contract specification and generate a live API endpoint. Learn the basics of spec-first development.',
  keywords: [
    'hello world',
    'tutorial',
    'getting started',
    'first contract',
    'specification',
    'API endpoint',
    'ContractSpec',
  ],
  openGraph: {
    title: 'Hello World | ContractSpec Docs',
    description:
      'Create your first contract specification and generate a live API endpoint with our step-by-step tutorial.',
    url: 'https://www.contractspec.io/docs/getting-started/hello-world',
    type: 'article',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/docs/getting-started/hello-world',
  },
};

export default HelloWorldPage;
