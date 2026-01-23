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
    'AI code stabilization',
    'spec-first development',
    'TypeScript',
  ],
  authors: [{ name: 'ContractSpec Team' }],
  creator: 'ContractSpec',
  publisher: 'ContractSpec',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ContractSpec – The Regenerative App Engine',
    description:
      'Customized & personalized, auto-evolutive codebase: compiled from intent, enforced by policy.',
    images: ['/api/og'],
    creator: '@contractspec',
    site: '@contractspec',
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
  },
  alternates: {
    canonical: 'https://www.contractspec.io',
    languages: {
      en: 'https://www.contractspec.io',
      'x-default': 'https://www.contractspec.io',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#0b0f19" />
        <meta name="color-scheme" content="dark light" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
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
                    potentialAction: {
                      '@type': 'SearchAction',
                      target: {
                        '@type': 'EntryPoint',
                        urlTemplate:
                          'https://www.contractspec.io/docs?q={search_term_string}',
                      },
                      'query-input': 'required name=search_term_string',
                    },
                  },
                  {
                    '@type': 'SoftwareApplication',
                    '@id': 'https://www.contractspec.io/#software',
                    name: 'ContractSpec',
                    description:
                      'The deterministic, spec-first compiler that keeps AI-written software coherent, safe, and regenerable.',
                    applicationCategory: 'DeveloperApplication',
                    operatingSystem: 'Web Browser',
                    offers: {
                      '@type': 'Offer',
                      price: '0',
                      priceCurrency: 'USD',
                    },
                    aggregateRating: {
                      '@type': 'AggregateRating',
                      ratingValue: '4.8',
                      reviewCount: '50',
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
