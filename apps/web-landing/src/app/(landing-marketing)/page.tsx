import type { Metadata } from 'next';
import { LandingPage } from '@contractspec/bundle.marketing';

export const metadata: Metadata = {
  title: 'ContractSpec: Stabilize Your AI-Generated Code',
  description:
    'The deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable. You keep your app. You own the code. One module at a time.',
  keywords: [
    'AI code stabilization',
    'AI governance',
    'spec-first compiler',
    'multi-surface consistency',
    'safe regeneration',
    'no lock-in',
    'TypeScript contracts',
    'AI safety',
  ],
  openGraph: {
    title: 'ContractSpec: Stabilize Your AI-Generated Code',
    description:
      'The compiler that keeps AI-written software coherent, safe, and regenerable. You own the code. Standard tech, no lock-in.',
    url: 'https://contractspec.io',
    siteName: 'ContractSpec',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'ContractSpec: Stabilize Your AI-Generated Code',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContractSpec: Stabilize Your AI-Generated Code',
    description: 'The compiler for AI-coded systems. You own the code.',
    images: ['/api/og'],
  },
  alternates: {
    canonical: 'https://contractspec.io',
  },
};

export default function Page() {
  return <LandingPage />;
}
