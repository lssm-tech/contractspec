import type { Metadata } from 'next';
import { ChangelogIndexClient } from '@/app/(landing-marketing)/changelog/clients/changelog-index-client';
import { getChangelogManifest } from '@/lib/changelog';

export const metadata: Metadata = {
	title: 'Changelog | ContractSpec',
	description:
		'Latest updates across the ContractSpec open system, from OSS packages to the operating surfaces around them.',
	openGraph: {
		title: 'Changelog | ContractSpec',
		description:
			'Latest updates across the ContractSpec open system, from OSS packages to the operating surfaces around them.',
		url: 'https://www.contractspec.io/changelog',
	},
	alternates: {
		canonical: 'https://www.contractspec.io/changelog',
	},
};

export default async function Page() {
	const manifest = await getChangelogManifest();
	return <ChangelogIndexClient manifest={manifest} />;
}
