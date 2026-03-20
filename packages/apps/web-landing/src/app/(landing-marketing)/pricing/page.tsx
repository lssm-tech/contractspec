import { PricingClient } from '@contractspec/bundle.marketing/components/marketing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Pricing | ContractSpec',
	description:
		'Packaging for the ContractSpec open system: OSS/Core first, Studio when your team needs the operating layer.',
	openGraph: {
		title: 'Pricing | ContractSpec',
		description:
			'Packaging for the ContractSpec open system: OSS/Core first, Studio when your team needs the operating layer.',
		url: 'https://www.contractspec.io/pricing',
	},
	alternates: {
		canonical: 'https://www.contractspec.io/pricing',
	},
};

export default PricingClient;
