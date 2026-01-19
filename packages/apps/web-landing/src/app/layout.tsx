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
  metadataBase: new URL('https://www.contractspec.io'),
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
        <QueryProvider>
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': [
                  {
                    '@type': 'Organization',
                    '@id': 'https://www.contractspec.io/#organization',
                    name: 'ContractSpec',
                    url: 'https://www.contractspec.io',
                    logo: 'https://www.contractspec.io/logo.png',
                    sameAs: [
                      'https://www.linkedin.com/company/contractspec/',
                      'https://www.github.com/lssm-tech',
                      'https://www.github.com/lssm-tech/contractspec',
                    ],
                  },
                  {
                    '@type': 'WebSite',
                    '@id': 'https://www.contractspec.io/#website',
                    url: 'https://www.contractspec.io',
                    name: 'ContractSpec',
                    description: 'The Regenerative App Engine',
                    publisher: {
                      '@id': 'https://www.contractspec.io/#organization',
                    },
                  },
                ],
              }),
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
