import {
	AccountsListPresentation,
	AssetsListPresentation,
	GoalsListPresentation,
	LiabilitiesListPresentation,
	WealthDashboardPresentation,
} from '../presentations';

export const wealthSnapshotPreviewMetrics = [
	{ label: 'Net worth', value: '$1.42M', tone: 'positive' },
	{ label: 'Assets', value: '$1.78M', tone: 'neutral' },
	{ label: 'Liabilities', value: '$360K', tone: 'warning' },
	{ label: 'Goals', value: '4 active', tone: 'neutral' },
] as const;

export const wealthSnapshotPreviewAccounts = [
	{
		name: 'Operating cash',
		type: 'Checking',
		balance: '$42,400',
		institution: 'Northstar Bank',
	},
	{
		name: 'Brokerage',
		type: 'Investment',
		balance: '$684,900',
		institution: 'Atlas Wealth',
	},
	{
		name: 'Primary mortgage',
		type: 'Loan',
		balance: '-$312,000',
		institution: 'Home Credit',
	},
] as const;

export const wealthSnapshotPreviewGoals = [
	{ name: 'Emergency runway', progress: '92%', status: 'On track' },
	{ name: 'Retirement bridge', progress: '68%', status: 'Active' },
	{ name: 'Education reserve', progress: '41%', status: 'At risk' },
] as const;

export const wealthSnapshotPreviewPresentations = [
	WealthDashboardPresentation,
	AccountsListPresentation,
	AssetsListPresentation,
	LiabilitiesListPresentation,
	GoalsListPresentation,
].map((presentation) => ({
	key: presentation.meta.key,
	title: presentation.meta.title,
	description: presentation.meta.description,
}));
