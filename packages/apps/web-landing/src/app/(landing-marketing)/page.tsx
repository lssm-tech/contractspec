import { LandingPage } from '@contractspec/bundle.marketing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ContractSpec: The Regenerative App Engine',
  description:
    'ContractSpec turns intents into a customized & personalized, auto-evolutive codebase-policy-safe with signed overlays and one-click rollback.',
  keywords: [
    'regenerative app engine',
    'auto-evolutive codebase',
    'personalized software',
    'policy-safe runtime',
    'app compiler',
    'AI code stabilization',
    'spec-first development',
    'TypeScript',
  ],
  openGraph: {
    title: 'ContractSpec – The Regenerative App Engine',
    description:
      'ContractSpec turns intents into a customized & personalized, auto-evolutive codebase: policy-safe with signed overlays and one-click rollback.',
    url: 'https://www.contractspec.io',
    siteName: 'ContractSpec',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'ContractSpec: The Regenerative App Engine',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContractSpec – The Regenerative App Engine',
    description:
      'Customized & personalized, auto-evolutive codebase: compiled from intent, enforced by policy.',
    images: ['/api/og'],
  },
  alternates: {
    canonical: 'https://www.contractspec.io',
  },
};

export default LandingPage;
