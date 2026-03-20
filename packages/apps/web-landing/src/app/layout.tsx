import type { Metadata } from 'next';
import { IBM_Plex_Mono, Newsreader, Public_Sans } from 'next/font/google';
import type React from 'react';
import './globals.css';
import { QueryProvider } from '@/components/query-provider';

const displayFont = Newsreader({
	subsets: ['latin'],
	variable: '--font-display',
	display: 'swap',
});

const bodyFont = Public_Sans({
	subsets: ['latin'],
	variable: '--font-body',
	display: 'swap',
});

const monoFont = IBM_Plex_Mono({
	subsets: ['latin'],
	variable: '--font-mono',
	display: 'swap',
	weight: ['400', '500', '600'],
});

const siteDescription =
	'The open spec system for AI-native software. Define explicit contracts, keep every surface aligned, and adopt Studio when you want the operating layer on top.';

export const metadata: Metadata = {
	title: {
		default: 'ContractSpec | The open spec system for AI-native software',
		template: '%s | ContractSpec',
	},
	description: siteDescription,
	metadataBase: new URL('https://www.contractspec.io'),
	keywords: [
		'open spec system',
		'open contract system',
		'AI-native software',
		'AI code stabilization',
		'safe regeneration',
		'multi-surface consistency',
		'contracts',
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
		title: 'ContractSpec | The open spec system for AI-native software',
		description: siteDescription,
		url: 'https://www.contractspec.io',
		siteName: 'ContractSpec',
		images: [
			{
				url: '/api/og',
				width: 1200,
				height: 630,
				alt: 'ContractSpec | The open spec system for AI-native software',
			},
		],
		type: 'website',
		locale: 'en_US',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ContractSpec | The open spec system for AI-native software',
		description: siteDescription,
		images: ['/api/og'],
		creator: '@contractspec',
		site: '@contractspec',
	},
	icons: {
		icon: [{ url: '/icon.png', sizes: '32x32', type: 'image/png' }],
		apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
	},
	verification: {
		google: 'google-site-verification-code',
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
		<html lang="en">
			<head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=5"
				/>
				<meta name="theme-color" content="#f7f0e6" />
				<meta name="color-scheme" content="light" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body
				className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} flex min-h-screen flex-col`}
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
										description: siteDescription,
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
