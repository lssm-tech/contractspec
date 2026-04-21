import type { LandingNavigationItem } from './landing-content.types';

export const contractspecPublicNavigation: readonly LandingNavigationItem[] = [
	{ id: 'nav-home', label: 'Home', href: '/', kind: 'native', pageKey: 'home' },
	{
		id: 'nav-product',
		label: 'Product',
		href: '/product',
		kind: 'native',
		pageKey: 'product',
	},
	{
		id: 'nav-templates',
		label: 'Templates',
		href: '/templates',
		kind: 'native',
		pageKey: 'templates',
	},
	{
		id: 'nav-pricing',
		label: 'Pricing',
		href: '/pricing',
		kind: 'native',
		pageKey: 'pricing',
	},
	{
		id: 'nav-docs',
		label: 'Docs',
		href: '/docs',
		kind: 'native',
		pageKey: 'docs',
	},
	{
		id: 'nav-changelog',
		label: 'Changelog',
		href: '/changelog',
		kind: 'native',
		pageKey: 'changelog',
	},
	{
		id: 'nav-github',
		label: 'GitHub',
		href: 'https://github.com/lssm-tech/contractspec',
		kind: 'external',
	},
];

export function listContractspecLandingNavigation() {
	return { items: contractspecPublicNavigation };
}
