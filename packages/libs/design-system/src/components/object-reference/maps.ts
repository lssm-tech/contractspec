import type {
	ObjectReferenceActionDescriptor,
	ObjectReferenceDescriptor,
} from './types';

export type ObjectReferenceMapsProvider = 'apple' | 'google' | 'waze' | 'geo';

export interface ObjectReferenceMapsActionOptions {
	providers?: ObjectReferenceMapsProvider[];
	labelPrefix?: string;
}

export function createMapsProviderHref(
	provider: ObjectReferenceMapsProvider,
	query: string
): string {
	const encoded = encodeURIComponent(compactMapQuery(query));
	switch (provider) {
		case 'apple':
			return `https://maps.apple.com/?q=${encoded}`;
		case 'google':
			return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
		case 'waze':
			return `https://waze.com/ul?q=${encoded}&navigate=yes`;
		case 'geo':
			return `geo:0,0?q=${encoded}`;
	}
}

export function createMapsReferenceActions(
	reference: ObjectReferenceDescriptor,
	options: ObjectReferenceMapsActionOptions = {}
): ObjectReferenceActionDescriptor[] {
	if (reference.kind !== 'address') {
		return [];
	}

	const query = reference.value ?? reference.label;
	if (!compactMapQuery(query)) {
		return [];
	}

	const providers = options.providers ?? ['google', 'apple', 'waze'];
	const labelPrefix = options.labelPrefix ?? 'Open in';
	return providers.map((provider) => ({
		id: `maps.${provider}`,
		label: `${labelPrefix} ${providerName(provider)}`,
		description: 'Open navigation for this address',
		href: createMapsProviderHref(provider, query),
		iconKey: 'map',
		metadata: { provider },
	}));
}

function compactMapQuery(value: string): string {
	return value.trim().replace(/\s+/g, ' ');
}

function providerName(provider: ObjectReferenceMapsProvider): string {
	switch (provider) {
		case 'apple':
			return 'Apple Maps';
		case 'google':
			return 'Google Maps';
		case 'waze':
			return 'Waze';
		case 'geo':
			return 'Maps';
	}
}
