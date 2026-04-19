import type { AdoptionCandidate } from './types';

export function normalizeText(value: string): string {
	return value.toLowerCase().trim();
}

export function tokenize(value: string): string[] {
	return normalizeText(value)
		.split(/[^a-z0-9@./-]+/)
		.flatMap((part) => part.split(/[./_-]+/))
		.filter((part) => part.length > 1);
}

export function uniqueTokens(values: string[]): string[] {
	return [...new Set(values.flatMap((value) => tokenize(value)))];
}

export function candidateTokens(candidate: AdoptionCandidate): string[] {
	const values = [candidate.id, candidate.title];
	if (candidate.description) {
		values.push(candidate.description);
	}
	values.push(...candidate.capabilityTags);
	values.push(...candidate.preferredUseCases);
	if ('packageRef' in candidate && candidate.packageRef) {
		values.push(candidate.packageRef);
	}
	if ('filePath' in candidate && candidate.filePath) {
		values.push(candidate.filePath);
	}
	return uniqueTokens(values);
}

export function overlap(left: string[], right: string[]): number {
	const rightSet = new Set(right);
	return left.filter((token) => rightSet.has(token)).length;
}
