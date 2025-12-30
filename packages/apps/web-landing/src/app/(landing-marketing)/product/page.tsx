import type { Metadata } from 'next';
import { ProductClientPage } from '@contractspec/bundle.marketing';

export const metadata: Metadata = {
  title: 'ContractSpec: Compiler for AI-Coded Systems',
  description:
    'Multi-surface consistency, safe regeneration, no lock-in. The deterministic compiler that keeps AI-written software coherent. Standard TypeScript output you own.',
  keywords: [
    'AI code compiler',
    'multi-surface consistency',
    'safe regeneration',
    'contract enforcement',
    'AI governance',
    'TypeScript compiler',
    'no lock-in',
    'spec-first development',
  ],
  openGraph: {
    title: 'ContractSpec: Compiler for AI-Coded Systems',
    description:
      'Multi-surface consistency, safe regeneration, no lock-in. You own the code.',
    url: 'https://contractspec.io/product',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContractSpec Product: Compiler for AI-Coded Systems',
  },
  alternates: {
    canonical: 'https://contractspec.io/product',
  },
};

export default function ProductPage() {
  return <ProductClientPage />;
}
