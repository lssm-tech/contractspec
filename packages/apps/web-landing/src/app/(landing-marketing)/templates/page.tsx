import { TemplatesPage as TemplatesClientPage } from '@contractspec/bundle.marketing/components/templates/TemplatesClientPage';

import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Templates | ContractSpec',
	description:
		'Explore scenario templates that show how the ContractSpec open system behaves in real products and workflows.',
	openGraph: {
		title: 'Templates | ContractSpec',
		description:
			'Explore scenario templates that show how the ContractSpec open system behaves in real products and workflows.',
		url: 'https://www.contractspec.io/templates',
	},
	alternates: {
		canonical: 'https://www.contractspec.io/templates',
	},
};

export default function TemplatesPage() {
	return <TemplatesClientPage />;
}
