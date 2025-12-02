import type { Metadata } from 'next';
import TemplatesClientPage from './TemplatesClientPage';

export const metadata: Metadata = {
  title: 'Templates – ContractSpec',
  description:
    'Ready-to-use, customizable application templates. Policies built in. One-click deploy.',
  alternates: {
    canonical: 'https://contractspec.chaman.ventures/templates',
  },
};

export default function TemplatesPage() {
  return <TemplatesClientPage />;
}
