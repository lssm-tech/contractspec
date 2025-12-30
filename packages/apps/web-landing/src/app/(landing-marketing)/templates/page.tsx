import type { Metadata } from 'next';
import { TemplatesPage } from '@contractspec/bundle.marketing';

export const metadata: Metadata = {
  title: 'Templates – ContractSpec',
  description:
    'Ready-to-use, customizable application templates. Policies built in. One-click deploy.',
  alternates: {
    canonical: 'https://contractspec.io/templates',
  },
};

export default TemplatesPage;
