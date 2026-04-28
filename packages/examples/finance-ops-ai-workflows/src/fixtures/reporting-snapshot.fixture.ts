import type { ReportingNarrativeInput } from '../handlers';

export const reportingNarrativeFixture: ReportingNarrativeInput = {
	reportingPeriod: 'April 2026',
	currency: 'EUR',
	audience: 'CEO and finance owner',
	dataSensitivity: 'medium',
	knownContext: '',
	kpiSnapshotJson: JSON.stringify([
		{
			metric: 'Revenue',
			currentValue: 1_120_000,
			previousValue: 1_050_000,
			targetValue: 1_180_000,
			unit: 'EUR',
			owner: 'Sales',
		},
		{
			metric: 'Gross margin',
			currentValue: 31,
			previousValue: 34,
			targetValue: 35,
			unit: '%',
			owner: 'Finance',
		},
		{
			metric: 'Operating expenses',
			currentValue: 420_000,
			previousValue: 390_000,
			targetValue: 400_000,
			unit: 'EUR',
			owner: 'Finance',
		},
		{
			metric: 'Cash balance',
			currentValue: 210_000,
			previousValue: 290_000,
			targetValue: 260_000,
			unit: 'EUR',
			owner: 'CEO',
		},
		{
			metric: 'DSO',
			currentValue: 67,
			previousValue: 58,
			targetValue: 52,
			unit: 'days',
			owner: 'Finance',
		},
	]),
};

export const reportingResetNarrativeFixture: ReportingNarrativeInput = {
	reportingPeriod: 'April 2026',
	currency: 'EUR',
	audience: 'CEO, controller and budget owners',
	dataSensitivity: 'medium',
	knownContext: 'First month with a consolidated reporting calendar.',
	kpiSnapshotJson: JSON.stringify([
		{
			metric: 'Revenue',
			currentValue: 520_000,
			previousValue: 480_000,
			targetValue: 500_000,
			unit: 'EUR',
			owner: 'Sales',
		},
		{
			metric: 'Project margin',
			currentValue: 24,
			previousValue: 27,
			targetValue: 30,
			unit: '%',
			owner: 'Operations',
		},
		{
			metric: 'Closing delay',
			currentValue: 8,
			previousValue: 12,
			targetValue: 5,
			unit: 'days',
			owner: 'Controller',
		},
	]),
};
