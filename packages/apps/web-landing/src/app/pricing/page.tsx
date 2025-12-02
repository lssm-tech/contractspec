import PricingClient from './pricing-client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - ContractSpec',
  description:
    'Transparent pricing for ContractSpec. Free for individuals, Pro for teams, Business for agencies. Usage-based regenerations. No lock-in.',
  keywords: [
    'ContractSpec pricing',
    'AI code compiler pricing',
    'spec-first development cost',
    'free tier',
    'team pricing',
    'agency pricing',
  ],
  openGraph: {
    title: 'ContractSpec Pricing',
    description:
      'Free for individuals. Scale with your team. No surprise bills.',
    url: 'https://contractspec.chaman.ventures/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'ContractSpec Pricing',
    description:
      'Free for individuals. Scale with your team. No surprise bills.',
  },
  alternates: {
    canonical: 'https://contractspec.chaman.ventures/pricing',
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
