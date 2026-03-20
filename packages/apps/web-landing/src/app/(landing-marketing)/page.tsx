import { LandingPage } from '@contractspec/bundle.marketing';
import type { Metadata } from 'next';

const homeDescription =
	'ContractSpec is the open spec system for AI-native software. Define explicit contracts, keep every surface aligned, and move into Studio when you want the operating layer on top.';

export const metadata: Metadata = {
	title: 'ContractSpec | The open spec system for AI-native software',
	description: homeDescription,
	keywords: [
		'open spec system',
		'open contract system',
		'AI-native software',
		'AI code stabilization',
		'safe regeneration',
		'multi-surface consistency',
		'TypeScript',
	],
	openGraph: {
		title: 'ContractSpec | The open spec system for AI-native software',
		description: homeDescription,
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
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ContractSpec | The open spec system for AI-native software',
		description: homeDescription,
		images: ['/api/og'],
	},
	alternates: {
		canonical: 'https://www.contractspec.io',
	},
};

export default LandingPage;
