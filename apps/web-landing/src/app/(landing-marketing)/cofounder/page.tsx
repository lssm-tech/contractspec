import type { Metadata } from 'next';
import { CofounderPage } from '@contractspec/bundle.marketing';

export const metadata: Metadata = {
  title: 'Co-founder Wanted | ContractSpec',
  description:
    'Looking for a co-founder to build ContractSpec: a contract-first compiler for AI-generated code. Equity-first, pre-PMF, building in public.',
  openGraph: {
    title: 'Co-founder Wanted | ContractSpec',
    description:
      'Join as co-founder. Equity-first, pre-PMF, building in public.',
    url: 'https://contractspec.io/cofounder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Co-founder Wanted | ContractSpec',
    description:
      'Looking for a co-founder to build ContractSpec. Equity-first, pre-PMF.',
  },
  alternates: {
    canonical: 'https://contractspec.io/cofounder',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CofounderRoute() {
  return <CofounderPage />;
}
