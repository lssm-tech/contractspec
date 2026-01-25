import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Install ContractSpec | Getting Started',
  description:
    'Install ContractSpec and start building regenerative applications. Get step-by-step installation instructions for your development environment.',
  keywords: [
    'install',
    'getting started',
    'setup',
    'ContractSpec installation',
    'development environment',
    'TypeScript',
  ],
  openGraph: {
    title: 'Install ContractSpec | Getting Started',
    description:
      'Install ContractSpec and start building regenerative applications with our step-by-step guide.',
    url: 'https://www.contractspec.io/install',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Install ContractSpec | Getting Started',
    description:
      'Install ContractSpec and start building regenerative applications with our step-by-step guide.',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/install',
  },
};

export default function InstallPage() {
  redirect('/docs/getting-started/installation');
}
