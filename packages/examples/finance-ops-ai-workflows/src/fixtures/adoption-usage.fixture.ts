import type { AiAdoptionUsageInput } from '../handlers';

export const adoptionUsageFixtures: readonly AiAdoptionUsageInput[] = [
	{
		workflowKey: 'financeOps.missionIntake.triage',
		team: 'finance ops',
		useCase: 'mission intake triage',
		timeBeforeMinutes: 90,
		timeAfterMinutes: 35,
		dataRisk: 'low',
		humanValidated: true,
		qualityRating: 'high',
	},
	{
		workflowKey: 'financeOps.cashAging.prioritize',
		team: 'cash',
		useCase: 'cash prioritization',
		timeBeforeMinutes: 120,
		timeAfterMinutes: 45,
		dataRisk: 'medium',
		humanValidated: true,
		qualityRating: 'high',
	},
	{
		workflowKey: 'financeOps.procedureDraft.create',
		team: 'operations',
		useCase: 'procedure draft',
		timeBeforeMinutes: 180,
		timeAfterMinutes: 80,
		dataRisk: 'low',
		humanValidated: true,
		qualityRating: 'medium',
	},
	{
		workflowKey: 'financeOps.reportingNarrative.compose',
		team: 'control',
		useCase: 'sensitive management narrative',
		timeBeforeMinutes: 75,
		timeAfterMinutes: 60,
		dataRisk: 'high',
		humanValidated: true,
		qualityRating: 'medium',
	},
	{
		workflowKey: 'training-support',
		team: 'finance',
		useCase: 'training support',
		timeBeforeMinutes: 30,
		timeAfterMinutes: 35,
		dataRisk: 'low',
		humanValidated: false,
		qualityRating: 'low',
	},
] as const;

export const reportingResetAdoptionUsageFixtures: readonly AiAdoptionUsageInput[] =
	[
		{
			workflowKey: 'financeOps.reportingNarrative.compose',
			team: 'control',
			useCase: 'monthly reporting narrative',
			timeBeforeMinutes: 110,
			timeAfterMinutes: 45,
			dataRisk: 'medium',
			humanValidated: true,
			qualityRating: 'high',
		},
		{
			workflowKey: 'financeOps.procedureDraft.create',
			team: 'operations',
			useCase: 'closing procedure draft',
			timeBeforeMinutes: 160,
			timeAfterMinutes: 70,
			dataRisk: 'low',
			humanValidated: true,
			qualityRating: 'medium',
		},
	];
