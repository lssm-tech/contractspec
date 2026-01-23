import type { Metadata } from 'next';
import SandboxExperienceClient from './SandboxExperienceClient';

export const metadata: Metadata = {
  title: 'Sandbox – ContractSpec',
  description:
    'Explore templates, specs, and visual builder in your browser. Fully local runtime, no infrastructure required.',
  keywords: [
    'sandbox',
    'playground',
    'interactive demo',
    'templates',
    'visual builder',
    'browser development',
    'local runtime',
  ],
  openGraph: {
    title: 'Sandbox – ContractSpec',
    description:
      'Explore templates, specs, and visual builder in your browser. Fully local runtime, no infrastructure required.',
    url: 'https://www.contractspec.io/sandbox',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sandbox – ContractSpec',
    description:
      'Explore templates, specs, and visual builder in your browser. Fully local runtime, no infrastructure required.',
  },
  alternates: {
    canonical: 'https://www.contractspec.io/sandbox',
  },
};

export default function SandboxPage() {
  return <SandboxExperienceClient />;
}
