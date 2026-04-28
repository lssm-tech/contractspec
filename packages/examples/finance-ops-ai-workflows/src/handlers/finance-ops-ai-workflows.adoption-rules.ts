import type { AdoptionNextStep } from './finance-ops-ai-workflows.types';

export function recommendAdoptionStep(
	policyReview: boolean,
	standardize: boolean,
	minutesSaved: number,
	quality: 'low' | 'medium' | 'high'
): AdoptionNextStep {
	if (policyReview) return 'policy_review';
	if (standardize && quality !== 'low') return 'standardize';
	if (minutesSaved <= 0) return 'abandon_or_redesign';
	if (quality === 'low') return 'train';
	return 'monitor';
}

export function stableSlug(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}
