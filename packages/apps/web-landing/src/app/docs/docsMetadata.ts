import { getDocsPageByHref } from '@contractspec/bundle.library/components/docs/docsManifest';
import type { Metadata } from 'next';

const DOCS_BASE_URL = 'https://www.contractspec.io';
const defaultDescription =
	'OSS-first ContractSpec docs for explicit contracts, generated surfaces, safe regeneration, and the Studio bridge.';

export function docsPageMetadata(href: string): Metadata {
	const page = getDocsPageByHref(href);
	const title =
		href === '/docs'
			? 'Documentation | ContractSpec'
			: `${page?.title ?? 'Documentation'} | ContractSpec Docs`;
	const description = page?.description ?? defaultDescription;
	const url = `${DOCS_BASE_URL}${href}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url,
			type: href === '/docs' ? 'website' : 'article',
		},
		alternates: {
			canonical: url,
		},
	};
}
