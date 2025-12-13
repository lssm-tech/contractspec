import type React from 'react';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/query-provider';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ContractSpec: The Regenerative App Engine',
  description:
    'ContractSpec turns intents into a customized & personalized, auto-evolutive codebase-policy-safe with signed overlays and one-click rollback.',
  metadataBase: new URL('https://contractspec.lssm.tech'),
  keywords: [
    'regenerative app engine',
    'auto-evolutive codebase',
    'personalized software',
    'policy-safe runtime',
    'app compiler',
  ],
  openGraph: {
    title: 'ContractSpec – The Regenerative App Engine',
    description:
      'ContractSpec turns intents into a customized & personalized, auto-evolutive codebase: policy-safe with signed overlays and one-click rollback.',
    url: 'https://contractspec.lssm.tech',
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
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geist.className} flex min-h-screen flex-col antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
