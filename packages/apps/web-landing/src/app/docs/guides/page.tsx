import type { Metadata } from 'next';
import { GuidesIndexPage } from '@contractspec/bundle.library';

export const metadata: Metadata = {
  title: 'Guides - ContractSpec',
  description:
    'Hands-on guides with runnable commands and CI-verified examples for ContractSpec adoption.',
  alternates: {
    canonical: 'https://www.contractspec.io/docs/guides',
  },
};

export default GuidesIndexPage;
