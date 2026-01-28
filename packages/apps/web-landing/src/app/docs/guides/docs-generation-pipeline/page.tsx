import type { Metadata } from 'next';
import { GuideDocsPipelinePage } from '@contractspec/bundle.library';

export const metadata: Metadata = {
  title: 'Docs Pipeline - ContractSpec Guides',
  description:
    'Generate reference docs, chunk the index, and wire a docs pipeline like the ContractSpec repo.',
  alternates: {
    canonical:
      'https://www.contractspec.io/docs/guides/docs-generation-pipeline',
  },
};

export default GuideDocsPipelinePage;
