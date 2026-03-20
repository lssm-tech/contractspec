'use client';

import {
	getPrimaryDocsSections,
	getSecondaryDocsPages,
} from '@contractspec/bundle.library/components/docs/docsManifest';

export const docsSections = getPrimaryDocsSections().map((section) => ({
	key: section.key,
	title: section.title,
	description: section.description,
	items: section.items.map((item) => ({
		title: item.navTitle ?? item.title,
		href: item.href,
	})),
}));

export const docsSecondarySections = [
	{
		key: 'why-contractspec',
		title: 'Why ContractSpec',
		description:
			'Secondary reading for positioning, comparisons, and the open-system philosophy.',
		items: getSecondaryDocsPages().map((page) => ({
			title: page.navTitle ?? page.title,
			href: page.href,
		})),
	},
];
