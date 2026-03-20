import { ContactClient } from '@contractspec/bundle.marketing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Contact Us | ContractSpec',
	description:
		'Talk to the ContractSpec team about OSS adoption, Studio evaluation, or AI-native workflows that need explicit control.',
	keywords: [
		'contact',
		'support',
		'help',
		'ContractSpec team',
		'AI code stabilization',
		'spec-first development',
	],
	openGraph: {
		title: 'Contact Us | ContractSpec',
		description:
			'Talk to the ContractSpec team about OSS adoption, Studio evaluation, or AI-native workflows that need explicit control.',
		url: 'https://www.contractspec.io/contact',
		type: 'website',
	},
	twitter: {
		card: 'summary',
		title: 'Contact Us | ContractSpec',
		description:
			'Talk to the ContractSpec team about OSS adoption and Studio evaluation.',
	},
	alternates: {
		canonical: 'https://www.contractspec.io/contact',
	},
};

export default ContactClient;
